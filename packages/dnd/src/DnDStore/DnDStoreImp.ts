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

class DnDStoreImp extends Store<CoreInstance> implements DnDStoreInterface {
  tracker: DnDStoreInterface["tracker"];

  siblingsBoundaries: DnDStoreInterface["siblingsBoundaries"];

  siblingsOverflow: DnDStoreInterface["siblingsOverflow"];

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
    this.siblingsOverflow = {};
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

  loadElementsFormKeyBranch(key: string) {
    const hasSiblings = Array.isArray(this.DOMGen.branches[key]);

    const firstElemID = hasSiblings
      ? this.DOMGen.branches[key][0]
      : (this.DOMGen.branches[key] as string);

    this.registry[firstElemID].resume(0, 0);
    this.registry[firstElemID].isPaused = true;

    const scroll = new Scroll({
      element: this.registry[firstElemID].ref!,
      requiredBranchKey: key,
      scrollEventCallback: hasSiblings ? this.updateBranchVisibility : null,
    });

    this.siblingsScrollElement[key] = scroll;

    if (hasSiblings) this.updateBranchVisibility(key);
  }

  onLoadListeners() {
    Object.keys(this.DOMGen.branches).forEach((branchKey) => {
      this.loadElementsFormKeyBranch(branchKey);
    });
  }

  private initELmIndicator() {
    this.elmIndicator = {
      currentKy: "",
      prevKy: "",
      exceptionToNextElm: false,
    };
  }

  private updateBranchVisibility(requiredBranchKey: string) {
    this.initELmIndicator();

    Object.keys(this.DOMGen.branches).forEach((branchKey) => {
      // Just the targeted branch.
      if (requiredBranchKey === branchKey) {
        // Init overflow state with no-overflow.
        if (!this.siblingsOverflow[requiredBranchKey]) {
          this.siblingsOverflow[requiredBranchKey] = {
            x: false,
            y: false,
          };
        }

        let prevIndex = 0;

        const scroll = this.siblingsScrollElement[branchKey];

        (this.DOMGen.branches[branchKey] as string[]).forEach((elmID, i) => {
          if (elmID.length > 0) {
            if (this.registry[elmID].isPaused) {
              this.registry[elmID].resume(scroll.scrollX, scroll.scrollY);
            }

            this.assignSiblingsBoundaries(
              this.registry[elmID].keys.SK,
              this.registry[elmID].offset!
            );

            const isVisibleY = scroll.isElementVisibleViewportY(
              this.registry[elmID].currentTop!
            );

            const isVisibleX = scroll.isElementVisibleViewportX(
              this.registry[elmID].currentLeft!
            );

            let isVisible = isVisibleY && isVisibleX;

            if (
              !isVisible &&
              !this.elmIndicator.exceptionToNextElm &&
              i > prevIndex
            ) {
              // Detect overflow
              this.siblingsOverflow[branchKey] = {
                x: !isVisibleX,
                y: !isVisibleY,
              };

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

            this.registry[elmID].changeVisibility(isVisible);

            prevIndex = i;
          }
        });
      }
    });
  }

  private assignSiblingsBoundaries(siblingsK: string, elemOffset: Rect) {
    const elmRight = elemOffset.left + elemOffset.width;

    if (!this.siblingsBoundaries[siblingsK]) {
      this.siblingsBoundaries[siblingsK] = {
        top: elemOffset.top,
        maxLeft: elemOffset.left,
        minRight: elmRight,
        bottom: elemOffset.height,
      };

      return;
    }

    const $ = this.siblingsBoundaries[siblingsK];

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
      parent = this.registry[parentsID];
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

  dispose() {
    if (!this.isInitialized) return null;

    this.isInitialized = false;

    window.removeEventListener("load", this.onLoadListeners);

    return null;
  }

  destroy() {
    this.dispose();

    // Destroys all registered instances.
    super.destroy();
  }
}

export default (function createStoreInstance() {
  const store = new DnDStoreImp();

  return store;
})();
