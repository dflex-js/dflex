/**
 * Copyright (c) Jalal Maskoun.
 *
 * This source code is licensed under the AGPL3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Store from "@dflex/store";
import CoreInstance from "@dflex/core-instance";

import type { Offset } from "@dflex/core-instance";

import type {
  ElmTree,
  BoundariesOffset,
  DnDStoreInterface,
  RegisterInput,
  ScrollThreshold,
  Overflow,
} from "./types";

import type { ThresholdPercentages } from "../Draggable";

import Tracker from "./Tracker";

// function noop() {}

// const handlers = ["onDragOver", "onDragLeave"];

function canUseDOM() {
  return (
    typeof window !== "undefined" &&
    typeof window.document !== "undefined" &&
    typeof window.document.createElement !== "undefined"
  );
}

class DnDStoreImp extends Store<CoreInstance> implements DnDStoreInterface {
  tracker: Tracker;

  siblingsBoundaries: { [siblingKey: string]: BoundariesOffset };

  siblingsOverflow: { [siblingKey: string]: Overflow };

  private isDOM: boolean;

  private isInitialized: boolean;

  private isPauseRegistration: boolean;

  viewportHeight!: number;

  viewportWidth!: number;

  scrollY!: number;

  scrollX!: number;

  hasThrottledFrame: number | null;

  private elmIndicator!: {
    currentKy: string;
    prevKy: string;
    exceptionToNextElm: boolean;
  };

  private scrollThresholdInputOpt!: ThresholdPercentages;

  scrollThreshold!: ScrollThreshold;

  documentScrollingElement!: Element;

  constructor() {
    super();

    this.siblingsBoundaries = {};
    this.siblingsOverflow = {};

    this.tracker = new Tracker();

    this.initELmIndicator();

    this.animatedScroll = this.animatedScroll.bind(this);
    this.animatedResize = this.animatedResize.bind(this);

    this.isInitialized = false;
    this.isDOM = false;
    this.isPauseRegistration = false;
    this.hasThrottledFrame = null;
  }

  private init() {
    this.setViewport();
    this.setScrollXY();

    window.addEventListener("resize", this.animatedResize);
    window.addEventListener("scroll", this.animatedScroll);

    window.onbeforeunload = this.dispose();

    this.isInitialized = true;
  }

  private updateViewportThreshold() {
    this.scrollThreshold.maxX = Math.round(
      (this.scrollThresholdInputOpt.horizontal * this.viewportWidth) / 100
    );

    this.scrollThreshold.minX = Math.round(
      100 - this.scrollThresholdInputOpt.horizontal
    );

    this.scrollThreshold.maxY = Math.round(
      (this.scrollThresholdInputOpt.vertical * this.viewportHeight) / 100
    );

    this.scrollThreshold.minY = Math.round(
      100 - this.scrollThresholdInputOpt.vertical
    );
  }

  private setViewport() {
    const viewportHeight = Math.max(
      document.documentElement.clientHeight || 0,
      window.innerHeight || 0
    );

    const viewportWidth = Math.max(
      document.documentElement.clientWidth || 0,
      window.innerWidth || 0
    );

    const isUpdated =
      viewportHeight !== this.viewportHeight ||
      viewportWidth !== this.viewportWidth;

    this.viewportHeight = viewportHeight;
    this.viewportWidth = viewportWidth;

    // Don't update if it's not initialized.
    if (isUpdated && this.scrollThreshold) {
      this.updateViewportThreshold();
    }

    return isUpdated;
  }

  private setScrollXY() {
    const scrollY = Math.round(
      document.documentElement.scrollTop || window.pageYOffset
    );

    const scrollX = Math.round(
      document.documentElement.scrollLeft || window.pageXOffset
    );

    const isUpdated = scrollY !== this.scrollY || scrollX !== this.scrollX;

    this.scrollY = scrollY;
    this.scrollX = scrollX;

    return isUpdated;
  }

  seScrollViewportThreshold(scrollThresholdInputOpt: ThresholdPercentages) {
    this.scrollThresholdInputOpt = scrollThresholdInputOpt;

    this.scrollThreshold = { minX: 0, maxX: 0, maxY: 0, minY: 0 };

    this.updateViewportThreshold();

    this.documentScrollingElement =
      document.scrollingElement || document.documentElement;
  }

  private initELmIndicator() {
    this.elmIndicator = {
      currentKy: "",
      prevKy: "",
      exceptionToNextElm: false,
    };
  }

  private isElementVisibleInHorizontalViewport(currentLeft: number): boolean {
    return (
      currentLeft >= this.scrollX &&
      currentLeft <= this.viewportWidth + this.scrollX
    );
  }

  private isElementVisibleInVerticalViewport(currentTop: number): boolean {
    return (
      currentTop >= this.scrollY &&
      currentTop <= this.viewportHeight + this.scrollY
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
              this.registry[elmID].resume(this.scrollX, this.scrollY);
            }

            let isVisible =
              this.isElementVisibleInVerticalViewport(
                this.registry[elmID].currentTop!
              ) &&
              this.isElementVisibleInHorizontalViewport(
                this.registry[elmID].currentLeft!
              );

            if (
              !isVisible &&
              !this.elmIndicator.exceptionToNextElm &&
              i > prevIndex
            ) {
              this.elmIndicator.exceptionToNextElm = true;

              // Override the result.
              isVisible = true;

              this.assignSiblingsBoundaries(
                this.registry[elmID].keys.sK,
                this.registry[elmID].offset!
              );
            } else if (isVisible) {
              this.assignSiblingsBoundaries(
                this.registry[elmID].keys.sK,
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

  private assignSiblingsBoundaries(siblingsK: string, elemOffset: Offset) {
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

    const coreInput = {
      id,
      depth: element.depth || 0,
      ref: element.ref || null,
      scrollX: this.scrollX,
      scrollY: this.scrollY,
      isInitialized: true,
      isPaused: this.isPauseRegistration,
    };

    super.register(coreInput, CoreInstance);

    if (this.isPauseRegistration) return;

    const {
      currentTop,
      currentLeft,
      offset,
      keys: { sK, pK },
    } = this.registry[id];

    this.assignSiblingsBoundaries(sK, offset!);

    const isVisibleY = this.isElementVisibleInVerticalViewport(currentTop!);
    const isVisibleX = this.isElementVisibleInHorizontalViewport(currentLeft!);

    // same branch
    this.elmIndicator.currentKy = `${sK}${pK}`;

    if (
      (!isVisibleY || !isVisibleX) &&
      !this.elmIndicator.exceptionToNextElm &&
      this.elmIndicator.currentKy === this.elmIndicator.prevKy
    ) {
      this.elmIndicator.exceptionToNextElm = true;

      // Stop registering the element process.
      this.isPauseRegistration = true;

      // Override the actual value.
      this.registry[id].changeVisibility(true);

      this.siblingsOverflow[this.registry[id].keys.sK] = {
        x: !isVisibleX,
        y: !isVisibleY,
      };
    } else if (!this.siblingsOverflow[this.registry[id].keys.sK]) {
      // If we don't do this, and the list is not overflowing, then the object
      // will be undefined.
      this.siblingsOverflow[this.registry[id].keys.sK] = {
        x: false,
        y: false,
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
      keys: { sK },
    } = element;

    const siblings = this.getElmBranchByKey(sK);

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
      keys: { sK, pK },
      order: { parent: pi },
    } = element;

    /**
     * getting connected branches
     */
    const siblings = this.getElmBranchByKey(sK);
    const parents = this.getElmBranchByKey(pK);

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

  private animatedListener(
    setter: "setViewport" | "setScrollXY",
    response: "updateRegisteredLayoutIndicators" | null
  ) {
    const isUpdated = this[setter]();

    if (isUpdated && !this.hasThrottledFrame && response) {
      this.hasThrottledFrame = window.requestAnimationFrame(() => {
        this[response]();
        this.hasThrottledFrame = null;
      });

      // this.hasThrottledFrame = true;
    }
  }

  private animatedScroll() {
    this.animatedListener.call(
      this,
      "setScrollXY",
      "updateRegisteredLayoutIndicators"
    );
  }

  private animatedResize() {
    this.animatedListener.call(this, "setViewport", null);
  }

  private dispose() {
    if (!this.isInitialized) return null;

    window.removeEventListener("resize", this.animatedResize);
    window.removeEventListener("scroll", this.animatedScroll);

    this.isInitialized = false;

    return null;
  }

  destroy() {
    this.dispose();
    super.destroy();
  }
}

export default (function createStoreInstance() {
  const store = new DnDStoreImp();

  return store;
})();
