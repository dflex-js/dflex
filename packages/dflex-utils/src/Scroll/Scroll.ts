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

  SK: string;

  scrollEventCallback: ScrollEventCallback | null;

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
    this.SK = SK;

    [this.scrollContainerDOM, this.hasDocumentAsContainer] =
      getScrollContainer(element);

    this._setRectsWithOverflow();

    this._setResizeAndScrollListeners();
    this.scrollEventCallback = null;
  }

  private _setRectsWithOverflow(): void {
    const { scrollHeight, scrollWidth, scrollLeft, scrollTop } =
      this.scrollContainerDOM;

    this.scrollRect = {
      left: scrollLeft,
      top: scrollTop,
      width: scrollWidth,
      height: scrollHeight,
    };

    if (!this.hasDocumentAsContainer) {
      const { height, width, left, top } =
        this.scrollContainerDOM.getBoundingClientRect();

      // @ts-ignore
      this.scrollContainerRect = { height, width, left, top };
    } else {
      const viewportHeight = Math.max(
        this.scrollContainerDOM.clientHeight || 0,
        window.innerHeight || 0
      );

      const viewportWidth = Math.max(
        this.scrollContainerDOM.clientWidth || 0,
        window.innerWidth || 0
      );

      // @ts-ignore
      this.scrollContainerRect = {
        height: viewportHeight,
        width: viewportWidth,
        left: 0,
        top: 0,
      };
    }

    this._setOverflow();
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

  private _updateScrollCoordinates(): boolean {
    const { scrollLeft, scrollTop } = this.scrollContainerDOM;

    const isUpdated =
      scrollTop !== this.scrollRect.top || scrollLeft !== this.scrollRect.left;

    if (isUpdated) {
      this.scrollRect.top = scrollTop;
      this.scrollRect.left = scrollLeft;

      return true;
    }

    return false;
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

    container[type]("resize", this._animatedResizeListener, opts);

    if (!hasScrollListener) return;

    container[type]("scroll", this._animatedScrollListener, opts);

    if (isAttachListener) {
      this.scrollContainerDOM.dataset[
        `dflexScrollListener-${this.SK}`
      ] = `${this.allowDynamicVisibility}`;

      return;
    }

    delete this.scrollContainerDOM.dataset.dflexScrollListener;
  }

  private _animatedScrollListener = () => {
    if (this._hasThrottledFrame !== null) return;

    this._hasThrottledFrame = window.requestAnimationFrame(() => {
      const isUpdated = this._updateScrollCoordinates();

      if (isUpdated && this.scrollEventCallback) {
        this.scrollEventCallback(this.SK);
      }

      this._hasThrottledFrame = null;
    });
  };

  private _animatedResizeListener = () => {
    if (this._hasThrottledFrame !== null) return;

    this._hasThrottledFrame = window.requestAnimationFrame(() => {
      this._setRectsWithOverflow();
      this._hasThrottledFrame = null;
    });
  };

  pauseListeners(pausePlease: boolean): void {
    this._hasThrottledFrame = pausePlease ? 1 : null;
  }

  setThreshold(threshold: ThresholdPercentages): void {
    this._threshold = new Threshold(threshold);
    this._threshold.setMainThreshold(
      `scroll-${this.SK}`,
      this.scrollContainerRect,
      true
    );
  }

  private _isScrollAvailable(isVertical: boolean): boolean {
    return this._threshold !== null &&
      this._hasThrottledFrame === null &&
      isVertical
      ? this.hasOverflowY
      : this.hasOverflowX;
  }

  isAtBottom(): boolean {
    return this.scrollRect.top === this.scrollRect.height;
  }

  isOutThresholdV(y: number): boolean {
    return (
      this._isScrollAvailable(true) &&
      this._threshold!.isOutThresholdV(`scroll-${this.SK}`, y, y)
    );
  }

  isOutThresholdH(x: number): boolean {
    return (
      this._isScrollAvailable(false) &&
      this._threshold!.isOutThresholdV(`scroll-${this.SK}`, x, x)
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

  destroy(): void {
    this._setResizeAndScrollListeners(false);
    // @ts-expect-error
    this.scrollContainerDOM = null;
  }
}

export default Scroll;
