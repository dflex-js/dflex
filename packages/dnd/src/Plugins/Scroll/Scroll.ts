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

  scrollContainer!: Element;

  hasThrottledFrame: number | null;

  hasDocumentAsContainer: boolean;

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

    this.setScrollContainer(element);

    this.setScrollCoordinates();
    this.setViewportAndUpdateScrollContainer();

    this.scrollEventCallback = scrollEventCallback;
    this.hasDocumentAsContainer = false;
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
    const { scrollHeight } = this.scrollContainer;

    this.scrollHeight = scrollHeight;

    if (this.hasDocumentAsContainer) {
      this.scrollRect = {
        height: this.viewportHeight,
        width: this.viewportWidth,
        left: 0,
        top: 0,
      };

      return;
    }

    const { height, width, left, top } =
      this.scrollContainer.getBoundingClientRect();

    this.scrollRect = { height, width, left, top };
  }

  private setScrollListener(attach = true) {
    const type = attach ? "addEventListener" : "removeEventListener";

    const opts = { passive: true };

    if (this.hasDocumentAsContainer) {
      window[type]("scroll", this.animatedScrollListener, opts);
      window[type]("resize", this.animatedResizeListener, opts);

      return;
    }

    this.scrollContainer[type]("scroll", this.animatedScrollListener, opts);
    this.scrollContainer[type]("resize", this.animatedResizeListener, opts);
  }

  setScrollContainer(element: Element) {
    this.scrollContainer = this.getScrollContainer(element);
    this.setScrollRect();
    this.setScrollListener();
  }

  setThresholdMatrix(threshold?: ThresholdPercentages) {
    if (threshold) this.threshold = new Threshold(threshold);

    // @ts-expect-error
    this.threshold!.updateElementThresholdMatrix(this.offset, true, true);
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

  private setViewportAndUpdateScrollContainer() {
    const viewportHeight = Math.max(
      this.scrollContainer.clientHeight || 0,
      window.innerHeight || 0
    );

    const viewportWidth = Math.max(
      this.scrollContainer.clientWidth || 0,
      window.innerWidth || 0
    );

    const isUpdated =
      viewportHeight !== this.viewportHeight ||
      viewportWidth !== this.viewportWidth;

    this.viewportHeight = viewportHeight;
    this.viewportWidth = viewportWidth;

    // Don't update if it's not initialized.
    if (isUpdated && this.scrollContainer && this.threshold) {
      this.setThresholdMatrix();
    }

    return isUpdated;
  }

  isElementVisibleViewportX(currentLeft: number): boolean {
    return (
      currentLeft >= this.scrollX &&
      currentLeft <= this.viewportWidth + this.scrollX
    );
  }

  isElementVisibleViewportY(currentTop: number): boolean {
    return (
      currentTop >= this.scrollY &&
      currentTop <= this.viewportHeight + this.scrollY
    );
  }

  private animatedListener(
    setter: "setViewportAndUpdateScrollContainer" | "setScrollCoordinates",
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
    this.animatedListener.call(
      this,
      "setViewportAndUpdateScrollContainer",
      null
    );
  };

  destroy() {
    this.setScrollListener(false);
    // @ts-expect-error
    this.scrollContainer = null;
  }
}

export default Scroll;
