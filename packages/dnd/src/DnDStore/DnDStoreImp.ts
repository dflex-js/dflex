import Store from "@dflex/store";
import CoreInstance, { Rect } from "@dflex/core-instance";

import type { ElmTree, DnDStoreInterface, RegisterInput } from "./types";

import Scroll from "../Plugins/Scroll";
import Tracker from "../Plugins/Tracker";

import type { ScrollInterface } from "../Plugins/Scroll";

import canUseDOM from "../utils/canUseDOM";

import type {
  LayoutState,
  Events,
  InteractivityEvent,
  DraggedEvent,
  SiblingsEvent,
  LayoutStateEvent,
} from "../types";

function throwElementIsNotConnected(id: string) {
  // eslint-disable-next-line no-console
  console.error(
    `DFlex: elements in the branch are not valid. Trying to validate element with id:${id} but failed.
Did you forget to call store.unregister(${id}) or add parenID when register the element?`
  );
}

class DnDStoreImp extends Store implements DnDStoreInterface {
  tracker: DnDStoreInterface["tracker"];

  siblingsBoundaries: DnDStoreInterface["siblingsBoundaries"];

  siblingsScrollElement: DnDStoreInterface["siblingsScrollElement"];

  siblingsAlignment: DnDStoreInterface["siblingsAlignment"];

  layoutState: DnDStoreInterface["layoutState"];

  private events: Events;

  private isDOM: boolean;

  private isInitialized: boolean;

  private elmIndicator!: {
    currentKy: string;
    prevKy: string;
    exceptionToNextElm: boolean;
  };

  static MAX_NUM_OF_SIBLINGS_BEFORE_DYNAMIC_VISIBILITY = 10;

  constructor() {
    super();

    this.siblingsBoundaries = {};
    this.siblingsScrollElement = {};
    this.siblingsAlignment = {};

    this.layoutState = "pending";

    // @ts-expect-error Should be initialized when calling DnD instance.
    this.events = null;

    this.tracker = new Tracker();

    this.initELmIndicator();

    this.isInitialized = false;
    this.isDOM = false;

    this.onLoadListeners = this.onLoadListeners.bind(this);
    this.updateBranchVisibility = this.updateBranchVisibility.bind(this);
  }

  onStateChange(state: LayoutState) {
    // Prevent emit a state change event if the state is not changing.
    // May change this behavior later.
    if (state === this.layoutState) return;

    this.layoutState = state;

    const evt: LayoutStateEvent = {
      layoutState: state,
      timeStamp: Date.now(),
      type: "onStateChange",
    };

    this.emitEvent(evt);
  }

  emitEvent(
    event: DraggedEvent | SiblingsEvent | InteractivityEvent | LayoutStateEvent
  ) {
    // @ts-expect-error
    this.events[event.type](event);
  }

  private init() {
    window.addEventListener("load", this.onLoadListeners);

    window.onbeforeunload = this.dispose();
  }

  private initELmIndicator() {
    this.elmIndicator = {
      currentKy: "",
      prevKy: "",
      exceptionToNextElm: false,
    };
  }

  private getBranchHeadAndTail(key: string) {
    const branch = this.DOMGen.branches[key];

    let hasSiblings = false;
    let firstElemID = "";
    let lastElemID = "";

    if (branch) {
      if (Array.isArray(branch)) {
        hasSiblings = true;
        [firstElemID] = branch as string[];

        lastElemID = branch[branch.length - 1];
      } else {
        firstElemID = branch!;
      }
    }

    return {
      hasSiblings,
      firstElemID,
      lastElemID,
    };
  }

  updateElementVisibility(
    elmID: string,
    scroll: ScrollInterface,
    allowDynamicVisibility: boolean,
    permitExceptionToOverride: boolean
  ) {
    if (this.registry[elmID].isPaused) {
      this.registry[elmID].resume(scroll.scrollX, scroll.scrollY);
    }

    this.assignSiblingsBoundariesAndAlignment(
      this.registry[elmID].keys.SK,
      this.registry[elmID].offset!
    );

    let isVisible = true;
    let isVisibleY = true;
    let isVisibleX = true;

    if (allowDynamicVisibility) {
      isVisibleY = scroll.isElementVisibleViewportY(
        this.registry[elmID].currentTop!
      );

      isVisibleX = scroll.isElementVisibleViewportX(
        this.registry[elmID].currentLeft!
      );

      isVisible = isVisibleY && isVisibleX;

      if (
        !isVisible &&
        !this.elmIndicator.exceptionToNextElm &&
        permitExceptionToOverride
      ) {
        this.elmIndicator.exceptionToNextElm = true;

        // Override the result.
        isVisible = true;
      } else if (isVisible) {
        if (this.elmIndicator.exceptionToNextElm) {
          // In this case, we are moving from hidden to visible.
          // Eg: 1, 2 are hidden the rest of the list is visible.
          // But, there's a possibility that the rest of the branch elements
          // are hidden.
          // Eg: 1, 2: hidden 3, 4, 5, 6, 7:visible 8, 9, 10: hidden.
          this.initELmIndicator();
        }
      }
    }

    this.registry[elmID].changeVisibility(isVisible);
  }

  private updateBranchVisibility(
    requiredBranchKey: string,
    allowDynamicVisibility: boolean
  ) {
    const requiredBranch = this.DOMGen.branches[requiredBranchKey];

    const scroll = this.siblingsScrollElement[requiredBranchKey];

    if (!scroll || !requiredBranch) {
      if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line no-console
        console.error(`Scroll and/or Sibling branch is not found`);
      }
      return;
    }

    this.initELmIndicator();

    let prevIndex = 0;

    // Should always have an array but just in case.
    const branch = Array.isArray(requiredBranch)
      ? requiredBranch
      : [requiredBranch];

    branch.forEach((elmID, i) => {
      if (elmID.length > 0) {
        const permitExceptionToOverride = i > prevIndex;

        this.updateElementVisibility(
          elmID,
          scroll,
          allowDynamicVisibility,
          permitExceptionToOverride
        );

        prevIndex = i;
      }
    });
  }

  private cleanupDisconnectedElements(branchKey: string) {
    const requiredBranch = this.DOMGen.branches[branchKey];

    const branch = Array.isArray(requiredBranch)
      ? requiredBranch
      : [requiredBranch];

    const extractedOldBranch: string[] = [];
    const connectedNodesID: string[] = [];

    let depth: null | number = null;
    let newSK = "";

    for (let i = 0; i < branch.length; i += 1) {
      const elmID = branch[i];

      if (elmID) {
        if (depth === null) {
          depth = this.registry[elmID].depth;

          // Can we get the parent ID, later?
          this.DOMGen.getElmPointer(`${Date.now()}`, (depth as number) + 1);

          newSK = this.DOMGen.accumulateIndicators(depth as number).SK;
        }

        if (
          this.registry[elmID].ref &&
          !this.registry[elmID].ref!.isConnected
        ) {
          this.registry[elmID].order.self = extractedOldBranch.push(elmID) - 1;

          // We don't know if element will be used in the future or not. So,
          // reference to prevent memory leak.
          this.registry[elmID].detach();
        } else {
          this.registry[elmID].order.self = connectedNodesID.push(elmID) - 1;

          // New key goes to the new branch.
          this.registry[elmID].keys.SK = newSK;
        }
      }
    }

    // Assign new branches
    this.DOMGen.branches[newSK] = connectedNodesID;
    this.DOMGen.branches[branchKey] = extractedOldBranch;

    return newSK;
  }

  initSiblingsScrollAndVisibilityIfNecessary(key: string) {
    const { hasSiblings, firstElemID, lastElemID } =
      this.getBranchHeadAndTail(key);

    if (!this.registry[firstElemID].isInitialized) {
      this.registry[firstElemID].resume(0, 0);
      this.registry[firstElemID].isPaused = true;
    }

    const isHeadNotConnected = !this.registry[firstElemID].ref!.isConnected;

    let isNotConnected = isHeadNotConnected;

    if (hasSiblings) {
      if (!this.registry[lastElemID].isInitialized) {
        this.registry[lastElemID].resume(0, 0);
        this.registry[lastElemID].isPaused = true;
      }

      const isTailNotConnected = !this.registry[lastElemID!].ref!.isConnected;

      isNotConnected = isTailNotConnected || isHeadNotConnected;
    }

    if (isNotConnected) {
      if (process.env.NODE_ENV !== "production") {
        throwElementIsNotConnected(firstElemID);
      }

      if (this.siblingsScrollElement[key]) {
        this.siblingsScrollElement[key].destroy();
        delete this.siblingsScrollElement[key];
      }

      const newKey = this.cleanupDisconnectedElements(key);

      this.initSiblingsScrollAndVisibilityIfNecessary(newKey);

      return;
    }

    if (this.siblingsScrollElement[key]) {
      return;
    }

    const scroll = new Scroll({
      element: this.registry[firstElemID].ref!,
      requiredBranchKey: key,
      scrollEventCallback: null,
    });

    // Override allowDynamicVisibility taking into consideration the length of
    // the branch itself. Iterate for a limited number of elements won't be a problem.
    if (
      hasSiblings &&
      scroll.allowDynamicVisibility &&
      this.DOMGen.branches[key]!.length <=
        DnDStoreImp.MAX_NUM_OF_SIBLINGS_BEFORE_DYNAMIC_VISIBILITY
    ) {
      scroll.allowDynamicVisibility = false;
    }

    this.siblingsScrollElement[key] = scroll;

    if (scroll.allowDynamicVisibility) {
      this.updateBranchVisibility(key, true);
      scroll.scrollEventCallback = this.updateBranchVisibility;
    } else {
      this.updateBranchVisibility(key, false);
    }
  }

  onLoadListeners() {
    Object.keys(this.DOMGen.branches).forEach((branchKey) => {
      this.initSiblingsScrollAndVisibilityIfNecessary(branchKey);
    });
  }

  private assignSiblingsBoundariesAndAlignment(SK: string, elemOffset: Rect) {
    const elmRight = elemOffset.left + elemOffset.width;

    if (!this.siblingsBoundaries[SK]) {
      this.siblingsBoundaries[SK] = {
        top: elemOffset.top,
        maxLeft: elemOffset.left,
        minRight: elmRight,
        bottom: elemOffset.height,
      };

      return;
    }

    const $ = this.siblingsBoundaries[SK];

    let isHorizontal = false;

    if ($.maxLeft < elemOffset.left) {
      $.maxLeft = elemOffset.left;

      isHorizontal = true;
      this.siblingsAlignment[SK] = "Horizontal";
    }

    if ($.minRight > elmRight) {
      $.minRight = elmRight;
    }

    if ($.top > elemOffset.top) {
      $.top = elemOffset.top;
    } else {
      $.bottom = elemOffset.top + elemOffset.height;
    }

    if (!isHorizontal) {
      this.siblingsAlignment[SK] = "Vertical";
    }
  }

  /**
   *  Register DnD element.
   *
   * @param element -
   */
  register(element: RegisterInput) {
    const hasRef = !!element.ref;

    if (!hasRef && !element.id) {
      throw new Error(
        `DFlex: A valid unique id Or/and HTML element is required.`
      );
    }

    /**
     * If element already exist in the store, then the reattach the reference.
     */
    const id = element.id || element.ref!.id;

    if (!id) {
      throw new Error(`DFlex: A valid and unique id is required.`);
    }

    if (!this.isDOM) {
      this.isDOM = canUseDOM();

      if (!this.isDOM) return;
    }

    if (!this.isInitialized) {
      this.init();
      this.isInitialized = true;
    }

    if (this.registry[id]) {
      if (hasRef || this.registry[id].isInitialized) {
        this.registry[id].attach(hasRef ? element.ref : null);

        if (this.registry[id].isVisible) {
          // Preserves last changes.
          this.registry[id].transformElm();
        }
      }

      return;
    }

    const coreInput = {
      id,
      parentID: element.parentID,
      depth: element.depth || 0,
      ref: element.ref,
      isInitialized: hasRef,
      isPaused: true,
      scrollX: 0,
      scrollY: 0,
    };

    super.register(coreInput);
  }

  getInitialELmRectById(id: string) {
    return this.registry[id].offset;
  }

  getELmTranslateById(id: string) {
    const { translate } = this.registry[id];

    return { translateX: translate!.x || 0, translateY: translate!.y || 0 };
  }

  getElmSiblingsById(id: string) {
    const element = this.registry[id];

    if (!element) return null;

    const {
      keys: { SK },
    } = element;

    const siblings = this.getElmBranchByKey(SK);

    return siblings;
  }

  getElmSiblingsListById(id: string) {
    const siblings = this.getElmSiblingsById(id);

    return Array.isArray(siblings) && siblings.length > 0 ? siblings : null;
  }

  /**
   * Gets element connections instance for a given id.
   *
   * @param id -
   */
  getElmTreeById(id: string): ElmTree {
    const element = this.registry[id];

    const {
      keys: { SK, PK },
      order: { parent: pi },
    } = element;

    /**
     * getting connected branches
     */
    const siblings = this.getElmBranchByKey(SK);
    const parents = this.getElmBranchByKey(PK);

    /**
     * getting parent instance
     */
    let parent = null;
    if (parents !== undefined) {
      const parentsID = Array.isArray(parents) ? parents[pi] : parents;
      parent = this.registry[parentsID as string];
    }

    return {
      element,
      parent,

      branches: {
        siblings,
        parents,
      },
    };
  }

  private clearBranchesScroll() {
    Object.keys(this.DOMGen.branches).forEach((key) => {
      if (this.siblingsScrollElement[key]) {
        this.siblingsScrollElement[key].destroy();
      }
    });

    this.siblingsScrollElement = {};
  }

  /**
   * Unregister DnD element.
   *
   * Note: This will remove the element registry and the branch array. But,
   * in case all the branches will be removed.
   * This means, if, in rare cases when the user removes one element and keeps
   * the rest this methods going to generate a bug. It's going to remove an
   * element without updating the indexes inside registry instances.
   *
   * @param id -
   *
   */
  unregister(id: string) {
    const {
      keys: { SK },
      order: { self },
    } = this.registry[id];

    this.DOMGen.removeElementIDFromBranch(SK, self);

    super.unregister(id);

    // Nothing left?
    // Reset the branch instances.
    if (this.DOMGen.branches[SK] === null) {
      this.clearBranchesScroll();

      // @ts-expect-error It will be initiated again on the next register.
      this.siblingsBoundaries[SK] = null;
    }
  }

  dispose() {
    if (!this.isInitialized) return null;

    this.isInitialized = false;

    window.removeEventListener("load", this.onLoadListeners);

    return null;
  }

  destroy() {
    this.dispose();

    this.clearBranchesScroll();

    // Destroys all registered instances.
    super.destroy();
  }
}

export default (function createStoreInstance() {
  const store = new DnDStoreImp();

  return store;
})();
