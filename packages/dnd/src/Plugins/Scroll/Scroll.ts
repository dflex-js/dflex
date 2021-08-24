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

function getScrollContainer(element: Element | null) {
  if (!element) return getScrollFromDocument();

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
    return getScrollFromDocument();
  }

  return scrollContainer;
}

class Scroll implements ScrollInterface {
  /**
   * Is set by controller when needed. Maybe is not provided, or not enabled.
   */
  threshold: ScrollInterface["threshold"] | null;

  siblingKey: string;

  viewportHeight!: number;

  viewportWidth!: number;

  scrollEventCallback: Function | null;

  scrollX!: number;

  scrollY!: number;

  scrollHeight!: number;

  scrollContainer!: Element;

  hasThrottledFrame: number | null;

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

    this.siblingKey = requiredBranchKey;

    this.setScrollContainer(element);

    this.animatedScrollListener = this.animatedScrollListener.bind(this);
    this.animatedResizeListener = this.animatedResizeListener.bind(this);

    this.setScrollCoordinates();
    this.setViewportAndUpdateScrollContainer();

    window.addEventListener("resize", this.animatedResizeListener);
    window.addEventListener("scroll", this.animatedScrollListener);

    this.scrollEventCallback = scrollEventCallback;
  }

  setScrollContainer(element: Element) {
    this.scrollContainer = getScrollContainer(element);
    this.scrollHeight = this.scrollContainer.scrollHeight;
  }

  setThresholdMatrix(threshold?: ThresholdPercentages) {
    if (threshold) this.threshold = new Threshold(threshold);

    this.threshold!.updateElementThresholdMatrix(
      {
        width: this.viewportWidth,
        height: this.viewportHeight,
        top: 0,
        left: 0,
      },
      true,
      true
    );
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

  private animatedScrollListener() {
    this.animatedListener.call(
      this,
      "setScrollCoordinates",
      this.scrollEventCallback
    );
  }

  private animatedResizeListener() {
    this.animatedListener.call(
      this,
      "setViewportAndUpdateScrollContainer",
      null
    );
  }

  destroy() {
    window.removeEventListener("resize", this.animatedResizeListener);
    window.removeEventListener("scroll", this.animatedScrollListener);

    // @ts-expect-error
    this.scrollContainer = null;
  }
}

export default Scroll;
