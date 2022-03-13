import { Threshold } from "@dflex/utils";
import type { ThresholdPercentages } from "@dflex/utils";

import loopInDOM from "../../utils/loopInDOM";

import { ScrollInput, ScrollInterface } from "./types";

const OVERFLOW_REGEX = /(auto|scroll|overlay)/;
const MAX_LOOP_ELEMENTS_TO_WARN = 16;

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

  scrollEventCallback: ScrollInterface["scrollEventCallback"];

  scrollX!: number;

  scrollY!: number;

  scrollRect: ScrollInterface["scrollRect"];

  scrollHeight!: number;

  scrollWidth!: number;

  hasOverflowX!: boolean;

  hasOverflowY!: boolean;

  allowDynamicVisibility!: boolean;

  scrollContainerRef!: HTMLElement;

  hasThrottledFrame: number | null;

  hasDocumentAsContainer!: boolean;

  constructor({
    element,
    requiredBranchKey,
    scrollEventCallback,
  }: ScrollInput) {
    this.threshold = null;
    this.hasThrottledFrame = null;

    this.scrollRect = {
      height: 0,
      width: 0,
      left: 0,
      top: 0,
    };

    this.siblingKey = requiredBranchKey;

    this.scrollContainerRef = this.getScrollContainer(element);

    this.setScrollRect();
    this.setScrollCoordinates();

    this.setScrollListener();

    this.scrollEventCallback = scrollEventCallback;
  }

  private getScrollContainer(element: HTMLElement | null) {
    let i = 0;

    this.hasDocumentAsContainer = false;

    if (!element) {
      this.hasDocumentAsContainer = true;

      return document.documentElement;
    }

    const computedStyle = getComputedStyle(element);

    const position = computedStyle.getPropertyValue("position");

    const excludeStaticParents = position === "absolute";

    const scrollContainer = loopInDOM(element, (parent) => {
      i += 1;

      if (
        i === MAX_LOOP_ELEMENTS_TO_WARN &&
        process.env.NODE_ENV !== "production"
      ) {
        // eslint-disable-next-line no-console
        console.warn(
          `DFlex detects performance issues during defining a scroll container.
Please provide scroll container by ref/id when registering the element or turn off auto-scroll from the options.`
        );
      }

      if (excludeStaticParents && isStaticallyPositioned(parent)) {
        return false;
      }

      const parentComputedStyle = getComputedStyle(parent);

      const parentRect = parent.getBoundingClientRect();

      const overflowY = parentComputedStyle.getPropertyValue("overflow-y");

      if (OVERFLOW_REGEX.test(overflowY)) {
        if (parent.scrollHeight === Math.round(parentRect.height)) {
          this.hasDocumentAsContainer = true;
        }

        return true;
      }

      const overflowX = parentComputedStyle.getPropertyValue("overflow-x");

      if (OVERFLOW_REGEX.test(overflowX)) {
        if (parent.scrollWidth === Math.round(parentRect.width)) {
          this.hasDocumentAsContainer = true;
        }

        return true;
      }

      return false;
    });

    if (
      this.hasDocumentAsContainer ||
      position === "fixed" ||
      !scrollContainer
    ) {
      this.hasDocumentAsContainer = true;

      return document.documentElement;
    }

    return scrollContainer;
  }

  private setScrollRect() {
    const { scrollHeight, scrollWidth } = this.scrollContainerRef;

    this.scrollHeight = scrollHeight;
    this.scrollWidth = scrollWidth;

    if (this.hasDocumentAsContainer) {
      const viewportHeight = Math.max(
        this.scrollContainerRef.clientHeight || 0,
        window.innerHeight || 0
      );

      const viewportWidth = Math.max(
        this.scrollContainerRef.clientWidth || 0,
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
        this.scrollContainerRef.getBoundingClientRect();

      this.scrollRect = { height, width, left, top };
    }

    this.hasOverflowY = this.scrollHeight > this.scrollRect.height;
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

  private setScrollListener(isAttachListener = true) {
    /**
     * No need to set scroll listener if there is no scroll.
     */
    const hasScrollListener = this.hasOverflowX || this.hasOverflowY;

    const type = isAttachListener ? "addEventListener" : "removeEventListener";

    const container = this.hasDocumentAsContainer
      ? window
      : this.scrollContainerRef;

    const opts = { passive: true };

    container[type]("resize", this.animatedResizeListener, opts);

    if (hasScrollListener) {
      container[type]("scroll", this.animatedScrollListener, opts);

      let elm: HTMLElement = this.scrollContainerRef;

      if (this.hasDocumentAsContainer) {
        // Find the first div in the document body.
        for (let i = 0; i < document.body.childNodes.length; i += 1) {
          if (
            document.body.childNodes[i].ELEMENT_NODE === 1 &&
            document.body.childNodes[i].nodeName === "DIV"
          ) {
            // @ts-expect-error
            elm = document.body.childNodes[i];

            break;
          }
        }
      }

      if (elm) {
        if (isAttachListener) {
          elm.dataset[
            `dflexScrollListener-${this.siblingKey}`
          ] = `${this.allowDynamicVisibility}`;

          return;
        }

        delete elm.dataset.dflexScrollListener;

        return;
      }

      if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line no-console
        console.warn(
          `DFlex: Failed to add scroll listener dataset. Unable to detect the first valid div inside document.body`
        );
      }
    }
  }

  setThresholdMatrix(threshold: ThresholdPercentages) {
    this.threshold = new Threshold(threshold);

    this.threshold.setThreshold(this.siblingKey, this.scrollRect, true, true);
  }

  private setScrollCoordinates() {
    const scrollY = Math.round(
      this.scrollContainerRef.scrollTop || window.pageYOffset
    );

    const scrollX = Math.round(
      this.scrollContainerRef.scrollLeft || window.pageXOffset
    );

    const isUpdated = scrollY !== this.scrollY || scrollX !== this.scrollX;

    this.scrollY = scrollY;
    this.scrollX = scrollX;

    return isUpdated;
  }

  getMaximumScrollContainerLeft() {
    const { left, width } = this.scrollRect;

    return left + width + this.scrollX;
  }

  getMaximumScrollContainerTop() {
    const { top, height } = this.scrollRect;

    return top + height + this.scrollY;
  }

  isElementVisibleViewportX(currentLeft: number): boolean {
    return (
      currentLeft >= this.scrollX &&
      currentLeft <= this.getMaximumScrollContainerLeft()
    );
  }

  isElementVisibleViewportY(currentTop: number): boolean {
    return (
      currentTop >= this.scrollY &&
      currentTop <= this.getMaximumScrollContainerTop()
    );
  }

  private animatedListener(
    setter: "setScrollRect" | "setScrollCoordinates",
    cb: ScrollInput["scrollEventCallback"]
  ) {
    if (this.hasThrottledFrame !== null) return;

    this.hasThrottledFrame = window.requestAnimationFrame(() => {
      const isUpdated = this[setter]();

      if (isUpdated && cb) {
        cb(this.siblingKey, true);
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
    this.scrollContainerRef = null;
  }
}

export default Scroll;
