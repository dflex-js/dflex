/**
 * Copyright (c) Jalal Maskoun.
 *
 * This source code is licensed under the AGPL3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Store from "@dflex/store";
import CoreInstance from "@dflex/core-instance";

import type { Offset } from "@dflex/core-instance";
import type { ElmInstance } from "@dflex/store";
import type { ElmTree, BoundariesOffset, DnDStoreInterface } from "./types";

import Tracker from "./Tracker";
// import Environment from "../Environment";

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

  siblingsBoundaries: { [k: string]: BoundariesOffset };

  viewportHeight!: number;

  viewportWidth!: number;

  scrollY!: number;

  scrollX!: number;

  private throttle: boolean;

  private elmIndicator!: {
    currentKy: string;
    prevKy: string;
    exceptionToNextElm: boolean;
  };

  constructor() {
    super();

    this.siblingsBoundaries = {};
    this.tracker = new Tracker();

    this.initELmIndicator();

    this.animatedScroll = this.animatedScroll.bind(this);
    this.setViewport = this.setViewport.bind(this);

    if (canUseDOM()) {
      this.init();
    }

    this.setViewport();
    this.setScrollXY();

    this.throttle = false;
  }

  private init() {
    window.addEventListener("resize", this.setViewport);
    window.addEventListener("scroll", this.animatedScroll);
    window.onbeforeunload = this.cleanup;
  }

  private setViewport() {
    console.log("file: DnDStoreImp.ts ~ line 79 ~ setViewport");

    this.viewportHeight = Math.max(
      document.documentElement.clientHeight || 0,
      window.innerHeight || 0
    );

    this.viewportWidth = Math.max(
      document.documentElement.clientWidth || 0,
      window.innerWidth || 0
    );
  }

  private setScrollXY() {
    this.scrollY = Math.round(
      document.documentElement.scrollTop || window.pageYOffset
    );
    this.scrollX = Math.round(
      document.documentElement.scrollLeft || window.pageXOffset
    );
  }

  private initELmIndicator() {
    this.elmIndicator = {
      currentKy: "",

      prevKy: "",

      exceptionToNextElm: false,
    };
  }

  private isElementHiddenInViewport(
    currentTop: number,
    currentLeft: number
  ): boolean {
    return (
      currentTop < this.scrollY ||
      currentTop >= this.viewportHeight + this.scrollY ||
      currentLeft < this.scrollX ||
      currentLeft >= this.viewportWidth + this.scrollX
    );
  }

  private updateRegisteredLayoutIndicators() {
    this.initELmIndicator();

    Object.keys(this.DOMGen.branches).forEach((branchKey) => {
      console.log("updateRegisteredLayoutIndicators", branchKey);

      // Ignore non array branches.
      if (Array.isArray(this.DOMGen.branches[branchKey])) {
        let prevIndex = 0;
        console.log("updateRegisteredLayoutIndicators", branchKey);

        (this.DOMGen.branches[branchKey] as string[]).forEach((elmID, i) => {
          if (elmID.length > 0) {
            const { currentTop, currentLeft } = this.registry[elmID];

            let isVisible = !this.isElementHiddenInViewport(
              currentTop,
              currentLeft
            );

            if (
              !isVisible &&
              !this.elmIndicator.exceptionToNextElm &&
              i > prevIndex
            ) {
              this.elmIndicator.exceptionToNextElm = true;
              isVisible = true;
            } else if (isVisible && this.elmIndicator.exceptionToNextElm) {
              // In this case, we are moving from hidden to visible.
              // Eg: 1, 2 are hidden the rest of the list is visible.
              // But, there's a possibility that the rest of the branch elements
              // are hidden.
              // Eg: 1, 2: hidden 3, 4, 5, 6, 7:visible 8, 9, 10: hidden.
              this.initELmIndicator();
            }
            this.registry[elmID].visibilityHasChanged(isVisible);
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
   * Reattach element reference.
   * This happens when element is unmounted from the screen and mounted again.
   *
   * @param id -
   * @param elmRef -
   */
  reattachElmRef(id: string, elmRef: HTMLElement) {
    this.registry[id].ref = elmRef;

    // Preserves last changes.
    this.registry[id].transformElm();
  }

  /**
   *  Register DnD element.
   *
   * @param element -
   */
  register(element: ElmInstance) {
    if (!canUseDOM()) {
      console.log("ignore register");

      return;
    }

    /**
     * If element already exist in the store, then the reattach the reference.
     */
    const id = element.id || element.ref.id;

    if (this.registry[id]) {
      if (element.ref) {
        if (this.registry[id].ref.isEqualNode(element.ref)) {
          this.reattachElmRef(id, element.ref);
        } else {
          throw new Error(
            `DFlex: Element with id:${id} is already registered. Please, provide DFlex with a unique id.`
          );
        }
      }

      return;
    }

    super.register(element, CoreInstance);

    const {
      currentTop,
      currentLeft,
      offset,
      keys: { sK, pK },
    } = this.registry[id];

    this.assignSiblingsBoundaries(sK, offset);

    let isVisible = !this.isElementHiddenInViewport(currentTop, currentLeft);

    // same branch
    this.elmIndicator.currentKy = `${sK}${pK}`;

    if (
      !isVisible &&
      !this.elmIndicator.exceptionToNextElm &&
      this.elmIndicator.currentKy === this.elmIndicator.prevKy
    ) {
      this.elmIndicator.exceptionToNextElm = true;
      isVisible = true;
    }

    this.registry[id].isVisible = isVisible;

    this.elmIndicator.prevKy = this.elmIndicator.currentKy;
  }

  getELmOffsetById(id: string) {
    return this.getElmById(id).offset;
  }

  getELmTranslateById(id: string) {
    const { translateX, translateY } = this.getElmById(id);

    return { translateX, translateY };
  }

  getElmSiblingsById(id: string) {
    const element = this.getElmById(id);

    const {
      keys: { sK },
    } = element;

    const siblings = this.getElmBranchByKey(sK);

    return siblings;
  }

  /**
   * Gets element connections instance for a given id.
   *
   * @param id -
   */
  getElmTreeById(id: string): ElmTree {
    const element = this.getElmById(id);

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
      parent = this.getElmById(parentsID);
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

  private animatedScroll() {
    this.setScrollXY();

    if (!this.throttle) {
      window.requestAnimationFrame(() => {
        this.updateRegisteredLayoutIndicators();
        this.throttle = false;
      });

      this.throttle = true;
    }
  }

  cleanup() {
    window.removeEventListener("scroll", this.animatedScroll);
    window.removeEventListener("resize", this.setViewport);
  }
}

export default (function createStoreInstance() {
  const store = new DnDStoreImp();

  return store;
})();
