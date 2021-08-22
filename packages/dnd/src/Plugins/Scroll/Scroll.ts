/**
 * Copyright (c) Jalal Maskoun.
 *
 * This source code is licensed under the AGPL3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ScrollInterface } from "./types";

function getScrollFromDocument() {
  return document.scrollingElement || document.documentElement;
}

class Scroll implements ScrollInterface {
  /**
   * Is set by controller when needed. Maybe is not provided, or not enabled.
   */
  threshold: ScrollInterface["threshold"] | null;

  viewportHeight!: number;

  viewportWidth!: number;

  resizeEventCallback: Function | null;

  scrollX!: number;

  scrollY!: number;

  scrollHeight!: number;

  scrollContainer!: Element;

  hasThrottledFrame: number | null;

  constructor({
    resizeEventCallback,
  }: {
    resizeEventCallback: Function | null;
  }) {
    this.threshold = null;
    this.hasThrottledFrame = null;

    this.setScrollContainer();

    this.animatedScrollListener = this.animatedScrollListener.bind(this);
    this.animatedResizeListener = this.animatedResizeListener.bind(this);

    this.setScrollCoordinates();
    this.setViewportAndUpdateScrollContainer();

    window.addEventListener("resize", this.animatedResizeListener);
    window.addEventListener("scroll", this.animatedScrollListener);

    this.resizeEventCallback = resizeEventCallback;
  }

  setScrollContainer() {
    this.scrollContainer = getScrollFromDocument();
    this.scrollHeight = this.scrollContainer.scrollHeight;
  }

  setThresholdMatrix() {
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

  private animatedListener(
    setter: "setViewportAndUpdateScrollContainer" | "setScrollCoordinates",
    cb: Function | null
  ) {
    if (this.hasThrottledFrame !== null) return;

    this.hasThrottledFrame = window.requestAnimationFrame(() => {
      const isUpdated = this[setter]();

      if (isUpdated && cb) {
        cb();
      }
      this.hasThrottledFrame = null;
    });
  }

  private animatedScrollListener() {
    this.animatedListener.call(
      this,
      "setScrollCoordinates",
      this.resizeEventCallback
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
