/**
 * Copyright (c) Jalal Maskoun.
 *
 * This source code is licensed under the AGPL3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import loopInDOM from "../../utils/loopInDOM";
import Threshold from "../Threshold";
import { ThresholdPercentages } from "../Threshold/types";

import { ScrollInterface } from "./types";

function getScrollFromDocument() {
  return document.scrollingElement || document.documentElement;
}

function hasOverflow(element: Element) {
  const overflowRegex = /(auto|scroll|overlay)/;
  const computedStyle = getComputedStyle(element);

  const overflow =
    computedStyle.getPropertyValue("overflow") +
    computedStyle.getPropertyValue("overflow-y") +
    computedStyle.getPropertyValue("overflow-x");

  return overflowRegex.test(overflow);
}

function isStaticallyPositioned(element: Element) {
  const computedStyle = getComputedStyle(element);
  const position = computedStyle.getPropertyValue("position");
  return position === "static";
}

class Scroll implements ScrollInterface {
  /**
   * Is set by controller when needed. Maybe is not provided, or not enabled.
   */
  threshold: ScrollInterface["threshold"] | null;

  siblingKey: string;

  viewportHeight!: number;

  viewportWidth!: number;

  offsetHeight?: number;

  offsetWidth?: number;

  scrollEventCallback: Function | null;

  scrollX!: number;

  scrollY!: number;

  scrollRect: ScrollInterface["scrollRect"];

  scrollHeight!: number;

  scrollWidth!: number;

  hasOverflowX!: boolean;

  hasOverflowY!: boolean;

  allowDynamicVisibility!: boolean;

  scrollContainer!: Element;

  hasThrottledFrame: number | null;

  hasDocumentAsContainer!: boolean;

  constructor({
    element,
    requiredBranchKey,
    scrollEventCallback,
  }: {
    element: Element;
    requiredBranchKey: string;
    scrollEventCallback: Function | null;
  }) {
    this.threshold = null;
    this.hasThrottledFrame = null;

    this.scrollRect = {
      height: 0,
      width: 0,
      left: 0,
      top: 0,
    };

    this.siblingKey = requiredBranchKey;

    this.scrollContainer = this.getScrollContainer(element);

    this.setScrollRect();
    this.setScrollCoordinates();

    this.setScrollListener();

    this.scrollEventCallback = scrollEventCallback;
  }

  private getScrollContainer(element: Element | null) {
    this.hasDocumentAsContainer = false;

    if (!element) {
      this.hasDocumentAsContainer = true;
      return getScrollFromDocument();
    }

    const computedStyle = getComputedStyle(element);

    const position = computedStyle.getPropertyValue("position");

    const excludeStaticParents = position === "absolute";

    const scrollContainer = loopInDOM(element, (parent) => {
      if (excludeStaticParents && isStaticallyPositioned(parent)) {
        return false;
      }
      return hasOverflow(parent);
    });

    if (position === "fixed" || !scrollContainer) {
      this.hasDocumentAsContainer = true;
      return getScrollFromDocument();
    }

    return scrollContainer;
  }

  private setScrollRect() {
    const { scrollHeight, scrollWidth } = this.scrollContainer;

    this.scrollHeight = scrollHeight;
    this.scrollWidth = scrollWidth;

    if (this.hasDocumentAsContainer) {
      const viewportHeight = Math.max(
        this.scrollContainer.clientHeight || 0,
        window.innerHeight || 0
      );

      const viewportWidth = Math.max(
        this.scrollContainer.clientWidth || 0,
        window.innerWidth || 0
      );

      this.scrollRect = {
        height: viewportHeight,
        width: viewportWidth,
        left: 0,
        top: 0,
      };
    } else {
      const { height, width, left, top } =
        this.scrollContainer.getBoundingClientRect();

      this.scrollRect = { height, width, left, top };
    }

    this.hasOverflowY = this.scrollRect.height < scrollHeight;

    this.hasOverflowX = this.scrollRect.width < scrollWidth;

    /**
     * Deciding when to active visibility and pausing for element branch. We
     * don't want to active a method with a listeners because just two elements
     * are not visible.
     */
    this.allowDynamicVisibility = false;

    if (this.hasOverflowY && scrollHeight / 2 >= this.scrollRect.height) {
      this.allowDynamicVisibility = true;

      return;
    }

    if (this.hasOverflowX && scrollWidth / 2 >= this.scrollRect.width) {
      this.allowDynamicVisibility = true;
    }
  }

  private setScrollListener(attach = true) {
    /**
     * No need to set scroll listener if there is no scroll.
     */
    const hasScrollListener = this.hasOverflowX || this.hasOverflowY;

    const type = attach ? "addEventListener" : "removeEventListener";

    const container = this.hasDocumentAsContainer
      ? window
      : this.scrollContainer;

    const opts = { passive: true };

    if (hasScrollListener) {
      container[type]("scroll", this.animatedScrollListener, opts);
    }

    container[type]("resize", this.animatedResizeListener, opts);
  }

  setThresholdMatrix(threshold: ThresholdPercentages) {
    this.threshold = new Threshold(threshold);

    this.threshold.updateElementThresholdMatrix(this.scrollRect, true, true);
  }

  private setScrollCoordinates() {
    const scrollY = Math.round(
      this.scrollContainer.scrollTop || window.pageYOffset
    );

    const scrollX = Math.round(
      this.scrollContainer.scrollLeft || window.pageXOffset
    );

    const isUpdated = scrollY !== this.scrollY || scrollX !== this.scrollX;

    this.scrollY = scrollY;
    this.scrollX = scrollX;

    return isUpdated;
  }

  isElementVisibleViewportX(currentLeft: number): boolean {
    return (
      currentLeft >= this.scrollX &&
      currentLeft <= this.scrollRect.width + this.scrollX
    );
  }

  isElementVisibleViewportY(currentTop: number): boolean {
    return (
      currentTop >= this.scrollY &&
      currentTop <= this.scrollRect.height + this.scrollY
    );
  }

  private animatedListener(
    setter: "setScrollRect" | "setScrollCoordinates",
    cb: Function | null
  ) {
    if (this.hasThrottledFrame !== null) return;

    this.hasThrottledFrame = window.requestAnimationFrame(() => {
      const isUpdated = this[setter]();

      if (isUpdated && cb) {
        cb(this.siblingKey);
      }
      this.hasThrottledFrame = null;
    });
  }

  private animatedScrollListener = () => {
    this.animatedListener.call(
      this,
      "setScrollCoordinates",
      this.scrollEventCallback
    );
  };

  private animatedResizeListener = () => {
    this.animatedListener.call(this, "setScrollRect", null);
  };

  destroy() {
    this.setScrollListener(false);
    // @ts-expect-error
    this.scrollContainer = null;
  }
}

export default Scroll;
