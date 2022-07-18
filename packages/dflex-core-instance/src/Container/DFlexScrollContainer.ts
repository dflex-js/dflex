/* eslint-disable no-underscore-dangle */
import { getParentElm, Threshold } from "@dflex/utils";
import type { ThresholdPercentages, RectDimensions } from "@dflex/utils";

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

class DFlexScrollContainer {
  private _innerThreshold: Threshold | null;

  private _outerThreshold: Threshold | null;

  private _SK: string;

  private _scrollEventCallback: ScrollEventCallback | null;

  /**
   * scroll container in the viewport. Only in the visible area.
   */
  scrollContainerRect!: RectDimensions;

  /**
   * The entire scroll rect visible and invisible.
   */
  scrollRect!: RectDimensions;

  hasOverflowX: boolean;

  hasOverflowY: boolean;

  /**
   * Some containers are overflown but in small percentages of the container
   * doesn't require adding visible scroll listeners and all the related events
   * and functionality. Current percentage is set to 0.5.
   */
  allowDynamicVisibility: boolean;

  /**
   * The parent element that is owning the scroll.
   */
  scrollContainerDOM!: HTMLElement;

  private _hasThrottledFrame: number | null;

  hasDocumentAsContainer!: boolean;

  private _threshold_inner_key: string;

  private _threshold_outer_key: string;

  private _listenerDataset: string;

  private static _OUTER_THRESHOLD: ThresholdPercentages = {
    horizontal: 25,
    vertical: 25,
  };

  private static _MAX_NUM_OF_SIBLINGS_BEFORE_DYNAMIC_VISIBILITY = 10;

  constructor(
    element: HTMLElement,
    SK: string,
    branchLength: number,
    scrollEventCallback: ScrollEventCallback
  ) {
    this.allowDynamicVisibility = false;
    this.hasOverflowX = false;
    this.hasOverflowY = false;

    this._innerThreshold = null;
    this._outerThreshold = null;
    this._SK = SK;
    this._threshold_inner_key = `scroll_inner_${SK}`;
    this._threshold_outer_key = `scroll_outer_${SK}`;
    this._listenerDataset = `dflexScrollListener-${SK}`;

    this._hasThrottledFrame = null;

    this._scrollEventCallback = null;

    [this.scrollContainerDOM, this.hasDocumentAsContainer] =
      getScrollContainer(element);

    this._initScrollContainerDOM();
    this._setScrollContainerRect(false);

    // Check allowDynamicVisibility after taking into consideration the length of
    // the branch itself.
    if (
      branchLength >
      DFlexScrollContainer._MAX_NUM_OF_SIBLINGS_BEFORE_DYNAMIC_VISIBILITY
    ) {
      this._setOverflow();

      if (this.allowDynamicVisibility) {
        this._scrollEventCallback = scrollEventCallback;

        this._outerThreshold = new Threshold(
          DFlexScrollContainer._OUTER_THRESHOLD
        );

        this._outerThreshold.setMainThreshold(
          this._threshold_outer_key,
          this.scrollContainerRect,
          false
        );
      }
    }

    this._setResizeAndScrollListeners();
  }

  private _initScrollContainerDOM() {
    const { scrollHeight, scrollWidth, scrollLeft, scrollTop } =
      this.scrollContainerDOM;

    this.scrollRect = Object.seal({
      left: scrollLeft,
      top: scrollTop,
      width: scrollWidth,
      height: scrollHeight,
    });
  }

  private _setScrollContainerRect(update = true): void {
    let scrollContainerRect: RectDimensions;

    if (this.hasDocumentAsContainer) {
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
    } else {
      const { height, width, left, top } =
        this.scrollContainerDOM.getBoundingClientRect();

      scrollContainerRect = { height, width, left, top };
    }

    if (update) {
      Object.assign(this.scrollContainerRect, scrollContainerRect);

      return;
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

    if (hasScrollListener && this.allowDynamicVisibility) {
      container[type]("scroll", this.animatedScrollListener, opts);
    }

    const elmHoldDataset = this.hasDocumentAsContainer
      ? document.body
      : this.scrollContainerDOM;

    if (isAttachListener) {
      elmHoldDataset.dataset[
        this._listenerDataset
      ] = `${this.allowDynamicVisibility}`;
    } else {
      delete elmHoldDataset.dataset[this._listenerDataset];
    }
  }

  pauseListeners(pausePlease: boolean): void {
    this._hasThrottledFrame = pausePlease ? 1 : null;
  }

  setInnerThreshold(threshold: ThresholdPercentages) {
    this._innerThreshold = new Threshold(threshold);

    this._innerThreshold.setMainThreshold(
      this._threshold_inner_key,
      this.scrollContainerRect,
      true
    );
  }

  private _isScrollAvailable(isVertical: boolean): boolean {
    if (__DEV__) {
      if (this._innerThreshold === null) {
        throw new Error("Scroll threshold is not set.");
      }
    }

    return this._hasThrottledFrame === null && isVertical
      ? this.hasOverflowY
      : this.hasOverflowX;
  }

  isOutThresholdV(y: number, height: number): boolean {
    return (
      this._isScrollAvailable(true) &&
      this._innerThreshold!.isOutThresholdV(
        this._threshold_inner_key,
        y,
        y + height
      )
    );
  }

  isOutThresholdH(x: number, width: number): boolean {
    return (
      this._isScrollAvailable(false) &&
      this._innerThreshold!.isOutThresholdV(
        this._threshold_inner_key,
        x,
        x + width
      )
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

  isElementVisibleViewportH(currentLeft: number, width: number): boolean {
    const currentTopWithScroll = currentLeft - this.scrollRect.left;

    const isNotVisible = this._outerThreshold!.isOutThresholdH(
      this._threshold_outer_key,
      currentTopWithScroll,
      currentTopWithScroll + width
    );

    return !isNotVisible;
  }

  isElementVisibleViewportV(currentTop: number, hight: number): boolean {
    const currentTopWithScroll = currentTop - this.scrollRect.top;

    const isNotVisible = this._outerThreshold!.isOutThresholdV(
      this._threshold_outer_key,
      currentTopWithScroll,
      currentTopWithScroll + hight
    );

    return !isNotVisible;
  }

  private animatedListener(
    setter: "_setScrollContainerRect" | "_updateScrollCoordinates",
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
    this.animatedListener.call(this, "_setScrollContainerRect", null);
  };

  destroy() {
    if (this._innerThreshold !== null) {
      this._innerThreshold.destroy();
      this._innerThreshold = null;
    }
    this._scrollEventCallback = null;
    this._setResizeAndScrollListeners(false);
    // @ts-expect-error
    this.scrollContainerDOM = null;
  }
}

export default DFlexScrollContainer;
