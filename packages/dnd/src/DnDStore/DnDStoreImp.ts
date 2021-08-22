/**
 * Copyright (c) Jalal Maskoun.
 *
 * This source code is licensed under the AGPL3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Store from "@dflex/store";
import CoreInstance, { Rect } from "@dflex/core-instance";

import type {
  ElmTree,
  BoundariesOffset,
  DnDStoreInterface,
  RegisterInput,
  Overflow,
} from "./types";

import Scroll, { ScrollInterface } from "../Plugins/Scroll";
import Tracker, { TrackerInterface } from "../Plugins/Tracker";
import Threshold, { ThresholdInterface } from "../Plugins/Threshold";

import canUseDOM from "../utils/canUseDOM";

class DnDStoreImp extends Store<CoreInstance> implements DnDStoreInterface {
  tracker: TrackerInterface;

  siblingsBoundaries: { [siblingKey: string]: BoundariesOffset };

  siblingsOverflow: { [siblingKey: string]: Overflow };

  private isDOM: boolean;

  private isInitialized: boolean;

  private isPauseRegistration: boolean;

  private hasVisibleElements: boolean;

  scroll!: ScrollInterface;

  private elmIndicator!: {
    currentKy: string;
    prevKy: string;
    exceptionToNextElm: boolean;
  };

  constructor() {
    super();

    this.siblingsBoundaries = {};
    this.siblingsOverflow = {};

    this.tracker = new Tracker();

    this.initELmIndicator();

    this.isInitialized = false;
    this.isDOM = false;
    this.hasVisibleElements = false;
    this.isPauseRegistration = false;
  }

  private init() {
    this.scroll = new Scroll({
      resizeEventCallback: this.updateRegisteredLayoutIndicators.bind(this),
    });

    window.onbeforeunload = this.destroy();

    this.isInitialized = true;
  }

  initScrollContainer(
    scrollThreshold: ThresholdInterface["thresholdPercentages"]
  ) {
    this.scroll.threshold = new Threshold(scrollThreshold);
    this.scroll.setThresholdMatrix();
  }

  private initELmIndicator() {
    this.elmIndicator = {
      currentKy: "",
      prevKy: "",
      exceptionToNextElm: false,
    };
  }

  private isElementVisibleViewportX(currentLeft: number): boolean {
    return (
      currentLeft >= this.scroll.scrollX &&
      currentLeft <= this.scroll.viewportWidth + this.scroll.scrollX
    );
  }

  private isElementVisibleViewportY(currentTop: number): boolean {
    return (
      currentTop >= this.scroll.scrollY &&
      currentTop <= this.scroll.viewportHeight + this.scroll.scrollY
    );
  }

  private updateRegisteredLayoutIndicators() {
    this.initELmIndicator();

    Object.keys(this.DOMGen.branches).forEach((branchKey) => {
      // Ignore non array branches.
      if (Array.isArray(this.DOMGen.branches[branchKey])) {
        let prevIndex = 0;

        (this.DOMGen.branches[branchKey] as string[]).forEach((elmID, i) => {
          if (elmID.length > 0) {
            if (this.registry[elmID].isPaused) {
              this.registry[elmID].resume(
                this.scroll.scrollX,
                this.scroll.scrollY
              );
            }

            let isVisible =
              this.isElementVisibleViewportY(
                this.registry[elmID].currentTop!
              ) &&
              this.isElementVisibleViewportX(this.registry[elmID].currentLeft!);

            if (
              !isVisible &&
              !this.elmIndicator.exceptionToNextElm &&
              i > prevIndex
            ) {
              this.elmIndicator.exceptionToNextElm = true;

              // Override the result.
              isVisible = true;

              this.assignSiblingsBoundaries(
                this.registry[elmID].keys.SK,
                this.registry[elmID].offset!
              );
            } else if (isVisible) {
              this.assignSiblingsBoundaries(
                this.registry[elmID].keys.SK,
                this.registry[elmID].offset!
              );

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
    if (!element.ref && !element.id) {
      throw new Error(
        `DFlex: A valid unique id Or/and HTML element is required.`
      );
    }

    /**
     * If element already exist in the store, then the reattach the reference.
     */
    const id = element.id || element.ref?.id;

    if (!id) {
      throw new Error(`DFlex: A valid and unique id is required.`);
    }

    if (!this.isDOM) {
      this.isDOM = canUseDOM();

      if (!this.isDOM) return;
    }

    if (!this.isInitialized) {
      this.init();
      this.isPauseRegistration = false;
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

    const isPaused = this.isPauseRegistration && this.hasVisibleElements;

    const coreInput = {
      id,
      depth: element.depth || 0,
      ref: element.ref || null,
      scrollX: this.scroll.scrollX,
      scrollY: this.scroll.scrollY,
      isInitialized: true,
      isPaused,
    };

    super.register(coreInput, CoreInstance);

    if (isPaused) return;

    const {
      currentTop,
      currentLeft,
      offset,
      keys: { SK, PK },
    } = this.registry[id];

    this.assignSiblingsBoundaries(SK, offset!);

    const isVisibleY = this.isElementVisibleViewportY(currentTop!);
    const isVisibleX = this.isElementVisibleViewportX(currentLeft!);

    // same branch
    this.elmIndicator.currentKy = `${SK}${PK}`;

    if (isVisibleY && isVisibleX) {
      this.hasVisibleElements = true;

      if (!this.siblingsOverflow[this.registry[id].keys.SK]) {
        // If we don't do this, and the list is not overflowing, then the object
        // will be undefined.
        this.siblingsOverflow[this.registry[id].keys.SK] = {
          x: false,
          y: false,
        };
      }
    } else if (
      !this.elmIndicator.exceptionToNextElm &&
      this.elmIndicator.currentKy === this.elmIndicator.prevKy
    ) {
      this.elmIndicator.exceptionToNextElm = true;

      // Stop registering the element process.
      this.isPauseRegistration = true;

      // Override the actual value.
      this.registry[id].changeVisibility(true);

      this.siblingsOverflow[this.registry[id].keys.SK] = {
        x: !isVisibleX,
        y: !isVisibleY,
      };
    }

    this.elmIndicator.prevKy = this.elmIndicator.currentKy;
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

  destroy() {
    if (!this.isInitialized) return null;

    this.scroll.destroy();

    this.isInitialized = false;

    // Destroys all registered instances.
    super.destroy();

    return null;
  }
}

export default (function createStoreInstance() {
  const store = new DnDStoreImp();

  return store;
})();
