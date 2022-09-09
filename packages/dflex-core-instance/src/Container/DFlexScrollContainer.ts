/* eslint-disable no-underscore-dangle */
import {
  AxesPoint,
  Axis,
  Dimensions,
  Direction,
  BoxNum,
  BoxRect,
  getParentElm,
  PointBool,
  Threshold,
} from "@dflex/utils";

import type { ThresholdPercentages, AbstractBox } from "@dflex/utils";

// eslint-disable-next-line no-unused-vars
type ScrollEventCallback = (SK: string) => void;

export type DFlexSerializedScroll = {
  type: string;
  version: 3;
  key: string;
  hasOverFlow: AxesPoint<boolean>;
  hasDocumentAsContainer: boolean;
  scrollRect: AbstractBox;
  scrollContainerRect: AbstractBox;
  invisibleDistance: AbstractBox;
  visibleScreen: Dimensions;
};

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
  scrollRect: Dimensions,
  scrollContainerRect: Dimensions,
  direction: "x" | "y"
): boolean {
  const dir = widthOrHeight(direction);

  return scrollRect[dir] > scrollContainerRect[dir];
}

function hasMoreThanHalfOverFlow(
  scrollRect: Dimensions,
  scrollContainerRect: Dimensions,
  direction: "x" | "y"
): boolean {
  const dir = widthOrHeight(direction);

  return scrollRect[dir] / 2 > scrollContainerRect[dir];
}

class DFlexScrollContainer {
  private _innerThresholdInViewport: Threshold | null;

  private _outerThresholdInViewport: Threshold | null;

  private _threshold_inner_key: string;

  private _threshold_outer_key: string;

  private _SK: string;

  private _scrollEventCallback: ScrollEventCallback | null;

  /**
   * scroll container in the viewport. Only in the visible area.
   */
  scrollContainerRect: BoxRect;

  /**
   * The entire scroll rect visible and invisible.
   */
  scrollRect: BoxRect;

  invisibleDistance: BoxNum;

  hasOverflow: PointBool;

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

  private _listenerDataset: string;

  private static _OUTER_THRESHOLD: ThresholdPercentages = {
    horizontal: 25,
    vertical: 25,
  };

  private static _MAX_NUM_OF_SIBLINGS_BEFORE_DYNAMIC_VISIBILITY = 10;

  static getType(): string {
    return "scroll:container";
  }

  constructor(
    element: HTMLElement,
    SK: string,
    branchLength: number,
    hasToScrollToZero: boolean,
    scrollEventCallback: ScrollEventCallback
  ) {
    this.hasOverflow = new PointBool(false, false);
    this.invisibleDistance = new BoxNum(0, 0, 0, 0);
    this.scrollRect = new BoxRect(0, 0, 0, 0);
    this.scrollContainerRect = new BoxRect(0, 0, 0, 0);

    this.allowDynamicVisibility = false;
    this._innerThresholdInViewport = null;
    this._outerThresholdInViewport = null;
    this._SK = SK;
    this._threshold_inner_key = `scroll_inner_${SK}`;
    this._threshold_outer_key = `scroll_outer_${SK}`;
    this._listenerDataset = `dflexScrollListener-${SK}`;

    this._hasThrottledFrame = null;

    this._scrollEventCallback = null;

    [this.scrollContainerDOM, this.hasDocumentAsContainer] =
      getScrollContainer(element);

    this._setScrollRect();

    const { scrollLeft, scrollTop } = this.scrollContainerDOM;

    this._updateInvisibleDistance(scrollLeft, scrollTop, false);

    this._setOverflow();

    // Check allowDynamicVisibility after taking into consideration the length of
    // the branch itself.
    if (
      branchLength >
      DFlexScrollContainer._MAX_NUM_OF_SIBLINGS_BEFORE_DYNAMIC_VISIBILITY
    ) {
      if (this.allowDynamicVisibility) {
        this._scrollEventCallback = scrollEventCallback;

        this._outerThresholdInViewport = new Threshold(
          DFlexScrollContainer._OUTER_THRESHOLD
        );

        this._outerThresholdInViewport.setMainThreshold(
          this._threshold_outer_key,
          this.scrollContainerRect,
          false
        );
      }
    }

    this._setResizeAndScrollListeners();

    if (
      hasToScrollToZero &&
      (this.scrollRect.top > 0 || this.scrollRect.left > 0)
    ) {
      // Scroll without callback.
      this.scrollTo(0, 0, false);
    }
  }

  private _setScrollRect(): void {
    const { scrollHeight, scrollWidth, scrollLeft, scrollTop } =
      this.scrollContainerDOM;

    this.scrollRect.setByPointAndDimensions(
      scrollTop,
      scrollLeft,
      scrollHeight,
      scrollWidth
    );

    const { clientHeight, clientWidth } = this.scrollContainerDOM;

    this.scrollContainerRect.setByPointAndDimensions(
      0,
      0,
      clientHeight,
      clientWidth
    );

    if (!this.hasDocumentAsContainer) {
      const { left, top } = this.scrollContainerDOM.getBoundingClientRect();

      this.scrollContainerRect.setByPointAndDimensions(
        top,
        left,
        clientHeight,
        clientWidth
      );
    }
  }

  private _setOverflow(): void {
    this.hasOverflow.setAxes(
      hasOverFlow(this.scrollRect, this.scrollContainerRect, "x"),
      hasOverFlow(this.scrollRect, this.scrollContainerRect, "y")
    );

    this.allowDynamicVisibility = false;

    if (
      this.hasOverflow.y &&
      hasMoreThanHalfOverFlow(this.scrollRect, this.scrollContainerRect, "y")
    ) {
      this.allowDynamicVisibility = true;

      return;
    }

    if (
      this.hasOverflow.x &&
      hasMoreThanHalfOverFlow(this.scrollRect, this.scrollContainerRect, "x")
    ) {
      this.allowDynamicVisibility = true;
    }
  }

  private _updateScrollCoordinates(): boolean {
    const { scrollLeft, scrollTop } = this.scrollContainerDOM;

    const isUpdated =
      scrollTop !== this.scrollRect.top || scrollLeft !== this.scrollRect.left;

    if (!isUpdated) {
      return false;
    }

    this._updateInvisibleDistance(scrollLeft, scrollTop, false);

    return isUpdated;
  }

  /**
   * When the scroll container is scrolling, the invisible distance is updated
   * with synthetic values instead of DOM listener values.
   *
   * One way binding, because when the scroll container is scrolled then the
   * is not dragging anymore.
   *
   * @param scrollLeft
   * @param scrollTop
   */
  private _updateInvisibleDistance(
    scrollLeft: number,
    scrollTop: number,
    triggerScrollEventCallback: boolean
  ): void {
    this.scrollRect.top = scrollTop;
    this.scrollRect.left = scrollLeft;

    const invisibleYTop = this.scrollRect.height - scrollTop;
    const invisibleXLeft = this.scrollRect.width - scrollLeft;

    this.invisibleDistance.setBox(
      scrollTop,
      invisibleXLeft - this.scrollContainerRect.width,
      invisibleYTop - this.scrollContainerRect.height,
      scrollLeft
    );

    if (triggerScrollEventCallback && this._scrollEventCallback !== null) {
      this._scrollEventCallback(this._SK);
    }
  }

  scrollTo(x: number, y: number, triggerScrollEventCallback: boolean): void {
    this._updateInvisibleDistance(x, y, triggerScrollEventCallback);

    this.scrollContainerDOM.scrollTop = y;
    this.scrollContainerDOM.scrollLeft = x;
  }

  /**
   *
   * @param axis
   * @param direction
   * @returns
   */
  hasInvisibleSpace(axis: Axis, direction: Direction): boolean {
    const val = this.invisibleDistance.getOne(axis, direction);

    // TODO: replace zero with container plus dragged distance boundaries.
    return val > 0;
  }

  private _tagDOMString(
    isAttachListener: boolean,
    hasScrollListener: boolean
  ): void {
    const elmHoldDataset = this.hasDocumentAsContainer
      ? document.body
      : this.scrollContainerDOM;

    if (isAttachListener) {
      elmHoldDataset.dataset[this._listenerDataset] = `${hasScrollListener}`;
    } else {
      delete elmHoldDataset.dataset[this._listenerDataset];
    }
  }

  private _setResizeAndScrollListeners(isAttachListener = true): void {
    /**
     * No need to set scroll listener if there is no scroll.
     */

    const type = isAttachListener ? "addEventListener" : "removeEventListener";

    const container = this.hasDocumentAsContainer
      ? window
      : this.scrollContainerDOM;

    const opts = { passive: true };

    container[type]("resize", this.animatedResizeListener, opts);

    if (this.hasOverflow.isOneTruthy()) {
      container[type]("scroll", this.animatedScrollListener, opts);

      this._tagDOMString(isAttachListener, true);

      return;
    }

    if (!this.hasDocumentAsContainer) {
      this._tagDOMString(isAttachListener, false);
    }
  }

  /**
   * Pausing and resuming the scroll listener. This method should be associated
   * with scrolling animation to prevent the scroll listener from being called
   * while scrolling which is causing latency and performance issues.
   *
   * Note: when listener is off make sure you call `updateInvisibleDistance` to
   * keep the the container in sync with the scrollable instance.
   *
   * @param pausePlease
   */
  pauseListeners(pausePlease: boolean): void {
    this._hasThrottledFrame = pausePlease ? 1 : null;
  }

  private _garbageCollectInnerThreshold() {
    if (this._innerThresholdInViewport !== null) {
      this._innerThresholdInViewport.destroy();
      this._innerThresholdInViewport = null;
    }
  }

  /**
   * Cerate and set inner threshold for the scroll container that is responsible
   * for checking if dragged element is out of the scroll container or not.
   *
   * Note: this method is called when dragged is triggered so it gives the user
   * more flexibility to choose the threshold in relation to the dragged element.
   *
   * @param threshold
   */
  setInnerThreshold(threshold: ThresholdPercentages) {
    this._garbageCollectInnerThreshold();

    this._innerThresholdInViewport = new Threshold(threshold);

    this._innerThresholdInViewport.setMainThreshold(
      this._threshold_inner_key,
      this.scrollContainerRect,
      true
    );
  }

  isOutThreshold(
    axis: Axis,
    direction: Direction,
    startingPos: number,
    endingPos: number
  ): boolean {
    const adjustToViewport =
      axis === "y" ? this.scrollRect.top : this.scrollRect.left;

    return (
      this.hasOverflow[axis] &&
      this._innerThresholdInViewport!.isOutThresholdByDirection(
        axis,
        direction,
        this._threshold_inner_key,
        startingPos - adjustToViewport,
        endingPos - adjustToViewport
      )
    );
  }

  /**
   * @deprecated - Should be removed when refactoring retractions.
   * @returns
   */
  getMaximumScrollContainerLeft() {
    const { left, width } = this.scrollContainerRect;

    return left + width + this.scrollRect.left;
  }

  /**
   * @deprecated - Should be removed when refactoring retractions.
   * @returns
   */
  getMaximumScrollContainerTop() {
    const { top, height } = this.scrollContainerRect;

    return top + height + this.scrollRect.top;
  }

  getElmPositionInViewport(topPos: number, leftPos: number): [number, number] {
    const { top, left } = this.scrollRect;

    return [topPos - top, leftPos - left];
  }

  isElmVisibleViewport(
    topPos: number,
    leftPos: number,
    height: number,
    width: number
  ): boolean {
    const [top, left] = this.getElmPositionInViewport(topPos, leftPos);

    const currentTopWithScroll = top;
    const currentLeftWithScroll = left;

    const isOutThreshold =
      this._outerThresholdInViewport!.isShallowOutThreshold(
        this._threshold_outer_key,
        currentTopWithScroll,
        currentLeftWithScroll + width,
        currentTopWithScroll + height,
        currentLeftWithScroll
      );

    return !isOutThreshold;
  }

  // TODO: Remove string and pass references instead.
  private animatedListener(
    setter: "_setScrollRect" | "_updateScrollCoordinates",
    cb: ScrollEventCallback | null
  ) {
    if (this._hasThrottledFrame !== null) {
      cancelAnimationFrame(this._hasThrottledFrame);
    }

    this._hasThrottledFrame = requestAnimationFrame(() => {
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
    this.animatedListener.call(this, "_setScrollRect", null);
  };

  private _getVisibleScreen(): Dimensions {
    const { height, width } = this.scrollContainerRect;

    return {
      height,
      width,
    };
  }

  getSerializedInstance(): DFlexSerializedScroll {
    return {
      type: DFlexScrollContainer.getType(),
      version: 3,
      key: this._SK,
      hasOverFlow: this.hasOverflow.getInstance(),
      hasDocumentAsContainer: this.hasDocumentAsContainer,
      scrollRect: this.scrollRect.getBox(),
      scrollContainerRect: this.scrollContainerRect.getBox(),
      invisibleDistance: this.invisibleDistance.getBox(),
      visibleScreen: this._getVisibleScreen(),
    };
  }

  /**
   * Clean up the container instances.
   */
  destroy(): void {
    this._garbageCollectInnerThreshold();
    this._scrollEventCallback = null;
    this._setResizeAndScrollListeners(false);
    // @ts-expect-error
    this.scrollContainerDOM = null;
  }
}

export default DFlexScrollContainer;
