/**
 * Copyright (c) Jalal Maskoun.
 *
 * This source code is licensed under the AGPL3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Store from "@dflex/store";
import CoreInstance, { Rect } from "@dflex/core-instance";

import type { ElmTree, DnDStoreInterface, RegisterInput } from "./types";

import Scroll from "../Plugins/Scroll";
import Tracker from "../Plugins/Tracker";

import canUseDOM from "../utils/canUseDOM";

function throwIfElementIsNotConnected(elm: Element, id: string) {
  if (!elm.isConnected) {
    throw new Error(
      `DFlex: elements in the branch are not valid. Trying to validate element with an id:${id} but failed.
Did you forget to call store.unregister(${id})?`
    );
  }
}

class DnDStoreImp extends Store<CoreInstance> implements DnDStoreInterface {
  tracker: DnDStoreInterface["tracker"];

  siblingsBoundaries: DnDStoreInterface["siblingsBoundaries"];

  siblingsScrollElement: DnDStoreInterface["siblingsScrollElement"];

  private isDOM: boolean;

  private isInitialized: boolean;

  private elmIndicator!: {
    currentKy: string;
    prevKy: string;
    exceptionToNextElm: boolean;
  };

  constructor() {
    super();

    this.siblingsBoundaries = {};
    this.siblingsScrollElement = {};

    this.tracker = new Tracker();

    this.initELmIndicator();

    this.isInitialized = false;
    this.isDOM = false;

    this.onLoadListeners = this.onLoadListeners.bind(this);
    this.updateBranchVisibility = this.updateBranchVisibility.bind(this);
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
        if (this.registry[elmID].isPaused) {
          this.registry[elmID].resume(scroll.scrollX, scroll.scrollY);
        }

        this.assignSiblingsBoundaries(
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
            i > prevIndex
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

        prevIndex = i;
      }
    });
  }

  initSiblingsScrollAndVisibilityIfNecessary(key: string) {
    const hasSiblings = Array.isArray(this.DOMGen.branches[key]);

    const firstElemID = hasSiblings
      ? this.DOMGen.branches[key]![0]
      : (this.DOMGen.branches[key] as string);

    // Avoid multiple calls that runs function multiple times. This happens
    // when there's a delay in firing load event and clicking on the element.
    // It's fine.
    if (this.siblingsScrollElement[key]) {
      if (!this.registry[firstElemID].isPaused) {
        throwIfElementIsNotConnected(
          this.registry[firstElemID].ref!,
          firstElemID
        );
      }

      /**
       * When does it happen?
       * When the branch is cleared but the scroll element is still there.
       * (bug/fixed but could it appear in the future?)
       *
       * When there's a duplication.
       * Meaning: You register the branch, continue with another one but DOM Gen
       * still thinking you are working on the same branch. This issue generates
       * key. To work around this, we need to clear the scroll element if it's
       * not live.
       *
       * When the developer forgets to unregister the branch.
       *
       * All these cases are not considered a bug. A problem, but not a bug.
       */
      if (this.siblingsScrollElement[key].scrollContainer.isConnected) {
        return;
      }

      delete this.siblingsScrollElement[key];
    }

    if (!this.registry[firstElemID].isPaused) {
      throwIfElementIsNotConnected(
        this.registry[firstElemID].ref!,
        firstElemID
      );
    }

    this.registry[firstElemID].resume(0, 0);
    throwIfElementIsNotConnected(this.registry[firstElemID].ref!, firstElemID);
    this.registry[firstElemID].isPaused = true;

    const scroll = new Scroll({
      element: this.registry[firstElemID].ref!,
      requiredBranchKey: key,
      scrollEventCallback: null,
    });

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

  private assignSiblingsBoundaries(SK: string, elemOffset: Rect) {
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

    if ($.maxLeft < elemOffset.left) {
      $.maxLeft = elemOffset.left;
    }

    if ($.minRight > elmRight) {
      $.minRight = elmRight;
    }

    if ($.top > elemOffset.top) {
      $.top = elemOffset.top;
    } else {
      $.bottom = elemOffset.top + elemOffset.height;
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
      if (this.registry[id].isInitialized) {
        this.registry[id].attach(element.ref || null);
      }

      if (this.registry[id].isVisible) {
        // Preserves last changes.
        this.registry[id].transformElm();
      }

      return;
    }

    const coreInput = {
      id,
      depth: element.depth || 0,
      ref: element.ref || null,
      isInitialized: hasRef,
      isPaused: true,
    };

    super.register(coreInput, CoreInstance);
  }

  getELmOffsetById(id: string) {
    return this.registry[id].offset;
  }

  getELmTranslateById(id: string) {
    const { translateX, translateY } = this.registry[id];

    return { translateX: translateX || 0, translateY: translateY || 0 };
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
