import { Threshold } from "../Threshold";
import type { ThresholdPercentages } from "../Threshold";
import type { RectDimensions } from "../types";
import { getParentElm } from "../dom";

// eslint-disable-next-line no-unused-vars
type ScrollEventCallback = (SK: string) => void;

const OVERFLOW_REGEX = /(auto|scroll|overlay)/;

function isStaticallyPositioned(DOM: Element): boolean {
  const computedStyle = getComputedStyle(DOM);
  const position = computedStyle.getPropertyValue("position");
  return position === "static";
}

function getScrollContainer(baseDOMElm: HTMLElement): [HTMLElement, boolean] {
  let hasDocumentAsContainer = false;

  const baseComputedStyle = getComputedStyle(baseDOMElm);
  const baseELmPosition = baseComputedStyle.getPropertyValue("position");
  const excludeStaticParents = baseELmPosition === "absolute";

  const scrollContainerDOM = getParentElm(baseDOMElm, (parentDOM) => {
    if (excludeStaticParents && isStaticallyPositioned(parentDOM)) {
      return false;
    }

    const parentComputedStyle = getComputedStyle(parentDOM);

    const parentRect = parentDOM.getBoundingClientRect();

    const overflowY = parentComputedStyle.getPropertyValue("overflow-y");

    if (OVERFLOW_REGEX.test(overflowY)) {
      if (parentDOM.scrollHeight === Math.round(parentRect.height)) {
        hasDocumentAsContainer = true;
      }

      return true;
    }

    const overflowX = parentComputedStyle.getPropertyValue("overflow-x");

    if (OVERFLOW_REGEX.test(overflowX)) {
      if (parentDOM.scrollWidth === Math.round(parentRect.width)) {
        hasDocumentAsContainer = true;
      }

      return true;
    }

    return false;
  });

  if (
    hasDocumentAsContainer ||
    baseELmPosition === "fixed" ||
    !scrollContainerDOM
  ) {
    hasDocumentAsContainer = true;

    return [document.documentElement, true];
  }

  return [scrollContainerDOM, hasDocumentAsContainer];
}

function widthOrHeight(direction: "x" | "y"): "width" | "height" {
  return direction === "x" ? "width" : "height";
}

function hasOverFlow(
  scrollRect: RectDimensions,
  scrollContainerRect: RectDimensions,
  direction: "x" | "y"
): boolean {
  const dir = widthOrHeight(direction);

  return scrollRect[dir] > scrollContainerRect[dir];
}

function hasMoreThanHalfOverFlow(
  scrollRect: RectDimensions,
  scrollContainerRect: RectDimensions,
  direction: "x" | "y"
): boolean {
  const dir = widthOrHeight(direction);

  return scrollRect[dir] / 2 > scrollContainerRect[dir];
}

class Scroll {
  private _threshold: Threshold | null;

  private _SK: string;

  private _scrollEventCallback: ScrollEventCallback | null;

  scrollContainerRect!: RectDimensions;

  scrollRect!: RectDimensions;

  hasOverflowX!: boolean;

  hasOverflowY!: boolean;

  allowDynamicVisibility!: boolean;

  scrollContainerDOM!: HTMLElement;

  private _hasThrottledFrame: number | null;

  hasDocumentAsContainer!: boolean;

  constructor(element: HTMLElement, SK: string) {
    this._threshold = null;
    this._hasThrottledFrame = null;
    this._SK = SK;
    this._scrollEventCallback = null;

    [this.scrollContainerDOM, this.hasDocumentAsContainer] =
      getScrollContainer(element);

    this._setScrollRects();
    this._setOverflow();

    this._setResizeAndScrollListeners();
  }

  private _setScrollRects(): void {
    const { scrollHeight, scrollWidth, scrollLeft, scrollTop } =
      this.scrollContainerDOM;

    this.scrollRect = Object.seal({
      left: scrollLeft,
      top: scrollTop,
      width: scrollWidth,
      height: scrollHeight,
    });

    let scrollContainerRect;

    if (!this.hasDocumentAsContainer) {
      const { height, width, left, top } =
        this.scrollContainerDOM.getBoundingClientRect();

      scrollContainerRect = { height, width, left, top };
    } else {
      const viewportHeight = Math.max(
        this.scrollContainerDOM.clientHeight || 0,
        window.innerHeight || 0
      );

      const viewportWidth = Math.max(
        this.scrollContainerDOM.clientWidth || 0,
        window.innerWidth || 0
      );

      scrollContainerRect = {
        height: viewportHeight,
        width: viewportWidth,
        left: 0,
        top: 0,
      };
    }

    this.scrollContainerRect = Object.seal(scrollContainerRect);
  }

  private _setOverflow(): void {
    this.hasOverflowY = hasOverFlow(
      this.scrollRect,
      this.scrollContainerRect,
      "y"
    );

    this.hasOverflowX = hasOverFlow(
      this.scrollRect,
      this.scrollContainerRect,
      "x"
    );

    /**
     * Deciding when to active visibility and pausing for element branch. We
     * don't want to active a method with a listeners because just two elements
     * are not visible.
     */
    this.allowDynamicVisibility = false;

    if (
      this.hasOverflowY &&
      hasMoreThanHalfOverFlow(this.scrollRect, this.scrollContainerRect, "y")
    ) {
      this.allowDynamicVisibility = true;

      return;
    }

    if (
      this.hasOverflowX &&
      hasMoreThanHalfOverFlow(this.scrollRect, this.scrollContainerRect, "x")
    ) {
      this.allowDynamicVisibility = true;
    }
  }

  private _updateScrollCoordinates() {
    const { scrollLeft, scrollTop } = this.scrollContainerDOM;

    const isUpdated =
      scrollTop !== this.scrollRect.top || scrollLeft !== this.scrollRect.left;

    this.scrollRect.top = scrollTop;
    this.scrollRect.left = scrollLeft;

    return isUpdated;
  }

  private _setResizeAndScrollListeners(isAttachListener = true): void {
    /**
     * No need to set scroll listener if there is no scroll.
     */
    const hasScrollListener = this.hasOverflowX || this.hasOverflowY;

    const type = isAttachListener ? "addEventListener" : "removeEventListener";

    const container = this.hasDocumentAsContainer
      ? window
      : this.scrollContainerDOM;

    const opts = { passive: true };

    container[type]("resize", this.animatedResizeListener, opts);

    if (!hasScrollListener) return;

    container[type]("scroll", this.animatedScrollListener, opts);

    if (isAttachListener) {
      this.scrollContainerDOM.dataset[
        `dflexScrollListener-${this._SK}`
      ] = `${this.allowDynamicVisibility}`;

      return;
    }

    delete this.scrollContainerDOM.dataset.dflexScrollListener;
  }

  pauseListeners(pausePlease: boolean): void {
    this._hasThrottledFrame = pausePlease ? 1 : null;
  }

  setThreshold(threshold: ThresholdPercentages) {
    this._threshold = new Threshold(threshold);
    this._threshold.setMainThreshold(
      `scroll-${this._SK}`,
      this.scrollContainerRect,
      true
    );
  }

  setScrollEventCallback(cb: ScrollEventCallback): void {
    this._scrollEventCallback = cb;
  }

  private _isScrollAvailable(isVertical: boolean): boolean {
    if (__DEV__) {
      if (this._threshold === null) {
        throw new Error("Scroll threshold is not set.");
      }
    }

    return this._hasThrottledFrame === null && isVertical
      ? this.hasOverflowY
      : this.hasOverflowX;
  }

  isOutThresholdV(y: number): boolean {
    return (
      this._isScrollAvailable(true) &&
      this._threshold!.isOutThresholdV(`scroll-${this._SK}`, y, y)
    );
  }

  isOutThresholdH(x: number): boolean {
    return (
      this._isScrollAvailable(false) &&
      this._threshold!.isOutThresholdV(`scroll-${this._SK}`, x, x)
    );
  }

  getMaximumScrollContainerLeft() {
    const { left, width } = this.scrollContainerRect;

    return left + width + this.scrollRect.left;
  }

  getMaximumScrollContainerTop() {
    const { top, height } = this.scrollContainerRect;

    return top + height + this.scrollRect.top;
  }

  isElementVisibleViewportX(currentLeft: number): boolean {
    return (
      currentLeft >= this.scrollRect.left &&
      currentLeft <= this.getMaximumScrollContainerLeft()
    );
  }

  isElementVisibleViewportY(currentTop: number): boolean {
    return (
      currentTop >= this.scrollRect.top &&
      currentTop <= this.getMaximumScrollContainerTop()
    );
  }

  private animatedListener(
    setter: "_setScrollRects" | "_updateScrollCoordinates",
    cb: ScrollEventCallback | null
  ) {
    if (this._hasThrottledFrame !== null) return;

    this._hasThrottledFrame = window.requestAnimationFrame(() => {
      const isUpdated = this[setter]();

      if (isUpdated && cb) {
        cb(this._SK);
      }
      this._hasThrottledFrame = null;
    });
  }

  private animatedScrollListener = () => {
    this.animatedListener.call(
      this,
      "_updateScrollCoordinates",
      this._scrollEventCallback
    );
  };

  private animatedResizeListener = () => {
    this.animatedListener.call(this, "_setScrollRects", null);
  };

  destroy() {
    if (this._threshold !== null) {
      this._threshold.destroy();
      this._threshold = null;
    }
    this._scrollEventCallback = null;
    this._setResizeAndScrollListeners(false);
    // @ts-expect-error
    this.scrollContainerDOM = null;
  }
}

export default Scroll;
