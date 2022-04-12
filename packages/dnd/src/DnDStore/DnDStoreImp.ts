import Store from "@dflex/store";

import { Tracker, Scroll } from "@dflex/utils";
import type { RectDimensions, ITracker, IScroll } from "@dflex/utils";

import { Container, Depth } from "@dflex/core-instance";
import type { IContainer, IDepth } from "@dflex/core-instance";

import type { ElmTree, DnDStoreInterface, RegisterInput } from "./types";

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
  containers: { [siblingKey: string]: IContainer };

  depths: IDepth;

  tracker: ITracker;

  layoutState: DnDStoreInterface["layoutState"];

  events: Events;

  #genID: ITracker;

  #isDOM: boolean;

  #isInitialized: boolean;

  #elmIndicator!: {
    currentKy: string;
    prevKy: string;
    exceptionToNextElm: boolean;
  };

  static MAX_NUM_OF_SIBLINGS_BEFORE_DYNAMIC_VISIBILITY = 10;

  static #PREFIX_ID = "dflex-id";

  constructor() {
    super();

    this.containers = {};

    this.depths = new Depth();

    this.layoutState = "pending";

    // @ts-expect-error Should be initialized when calling DnD instance.
    this.events = null;

    this.tracker = new Tracker();
    this.#genID = new Tracker(DnDStoreImp.#PREFIX_ID);

    this.#initELmIndicator();

    this.#isInitialized = false;
    this.#isDOM = false;

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

  #init() {
    window.addEventListener("load", this.onLoadListeners);

    window.onbeforeunload = this.dispose();
  }

  #initELmIndicator() {
    this.#elmIndicator = {
      currentKy: "",
      prevKy: "",
      exceptionToNextElm: false,
    };
  }

  updateElementVisibility(
    elmID: string,
    scroll: IScroll,
    allowDynamicVisibility: boolean,
    permitExceptionToOverride: boolean
  ) {
    let isVisible = true;
    let isVisibleY = true;
    let isVisibleX = true;

    if (allowDynamicVisibility) {
      isVisibleY = scroll.isElementVisibleViewportY(
        this.registry[elmID].currentPosition.y
      );

      isVisibleX = scroll.isElementVisibleViewportX(
        this.registry[elmID].currentPosition.x
      );

      isVisible = isVisibleY && isVisibleX;

      if (
        !isVisible &&
        !this.#elmIndicator.exceptionToNextElm &&
        permitExceptionToOverride
      ) {
        this.#elmIndicator.exceptionToNextElm = true;

        // Override the result.
        isVisible = true;
      } else if (isVisible) {
        if (this.#elmIndicator.exceptionToNextElm) {
          // In this case, we are moving from hidden to visible.
          // Eg: 1, 2 are hidden the rest of the list is visible.
          // But, there's a possibility that the rest of the branch elements
          // are hidden.
          // Eg: 1, 2: hidden 3, 4, 5, 6, 7:visible 8, 9, 10: hidden.
          this.#initELmIndicator();
        }
      }
    }

    this.registry[elmID].changeVisibility(isVisible);
  }

  private updateBranchVisibility(SK: string, allowDynamicVisibility: boolean) {
    const branch = this.DOMGen.branches[SK];

    const { scroll } = this.containers[SK];

    if (!scroll || !branch) {
      if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line no-console
        console.error(
          `Scroll and/or Sibling branch is not found:\n\n`,
          `In branch with key: ${SK}\n`,
          `Branch: ${branch}\n`
        );
      }
      return;
    }

    this.#initELmIndicator();

    let prevIndex = 0;

    branch.forEach((elmID, i) => {
      if (elmID.length > 0) {
        const permitExceptionToOverride = i > prevIndex;

        if (this.registry[elmID].isPaused) {
          this.registry[elmID].resume(scroll.scrollX, scroll.scrollY);
        }

        // Using element grid zero to know if the element has been initiated inside
        // container or not.
        if (this.registry[elmID].grid.x === 0) {
          const { depth, offset, grid } = this.registry[elmID];

          this.containers[SK].setGrid(grid, offset);
          this.containers[SK].setBoundaries(offset);

          this.depths.add(SK, depth);
        }

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
    const branch = this.DOMGen.branches[branchKey];

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
          this.DOMGen.register(this.#genID.newTravel(), (depth as number) + 1);

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

  initSiblings(SK: string) {
    if (!this.containers[SK]) {
      this.containers[SK] = new Container();
    }

    const branch = this.DOMGen.branches[SK];

    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.info(`Initializing Siblings: ${SK} - ${branch}\n`);
    }

    const firstElemID = branch[0];
    const lastElemID = branch[branch.length - 1];
    const hasSiblings = branch.length > 1;

    if (!this.registry[firstElemID].isInitialized) {
      this.registry[firstElemID].resume(0, 0);
      this.registry[firstElemID].isPaused = true;
    }

    const isHeadNotConnected = !this.registry[firstElemID].isConnected();

    let isNotConnected = isHeadNotConnected;

    if (hasSiblings) {
      if (!this.registry[lastElemID].isInitialized) {
        this.registry[lastElemID].resume(0, 0);
        this.registry[lastElemID].isPaused = true;
      }

      const isTailNotConnected = !this.registry[lastElemID!].isConnected();

      isNotConnected = isTailNotConnected || isHeadNotConnected;
    }

    if (isNotConnected) {
      if (process.env.NODE_ENV !== "production") {
        throwElementIsNotConnected(firstElemID);
      }

      if (this.containers[SK].scroll) {
        this.containers[SK].scroll.destroy();
        // @ts-expect-error
        this.containers[SK].scroll = null;
      }

      const newKey = this.cleanupDisconnectedElements(SK);

      this.initSiblings(newKey);

      return;
    }

    if (this.containers[SK].scroll) {
      return;
    }

    const scroll = new Scroll({
      element: this.registry[firstElemID].ref!,
      requiredBranchKey: SK,
      scrollEventCallback: null,
    });

    // Override allowDynamicVisibility taking into consideration the length of
    // the branch itself. Iterate for a limited number of elements won't be a problem.
    if (
      hasSiblings &&
      scroll.allowDynamicVisibility &&
      this.DOMGen.branches[SK]!.length <=
        DnDStoreImp.MAX_NUM_OF_SIBLINGS_BEFORE_DYNAMIC_VISIBILITY
    ) {
      scroll.allowDynamicVisibility = false;
    }

    this.containers[SK].scroll = scroll;

    if (scroll.allowDynamicVisibility) {
      this.updateBranchVisibility(SK, true);
      scroll.scrollEventCallback = this.updateBranchVisibility;
    } else {
      this.updateBranchVisibility(SK, false);
    }
  }

  onLoadListeners() {
    Object.keys(this.DOMGen.branches).forEach((branchKey) => {
      this.initSiblings(branchKey);
    });
  }

  handleElmMigration(
    newSK: string,
    oldSK: string,
    insertionOffset: RectDimensions
  ) {
    this.containers[newSK].setBoundaries(insertionOffset);

    this.DOMGen.branches[oldSK].forEach((elmID) => {
      if (elmID.length > 0) {
        this.containers[oldSK].setBoundaries(this.registry[elmID].getOffset());
      }
    });
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
    let { id } = element;

    if (!id) {
      id = `${this.#genID.newTravel()}`;

      // eslint-disable-next-line no-param-reassign
      element.ref!.id = id;
    }

    if (!this.#isDOM) {
      this.#isDOM = canUseDOM();

      if (!this.#isDOM) return;
    }

    if (!this.#isInitialized) {
      this.#init();
      this.#isInitialized = true;
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

  /**
   * Gets element connections instance for a given id.
   *
   * @param id -
   */
  getElmTreeById(id: string): ElmTree {
    const element = this.registry[id];

    const {
      keys: { SK, PK },
      order,
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
      const parentsID = parents[order.parent];
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
    Object.keys(this.DOMGen.branches).forEach((SK) => {
      if (this.containers[SK].scroll) {
        this.containers[SK].scroll.destroy();
      }
    });
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
    if (!this.#isInitialized) return null;

    this.#isInitialized = false;

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
