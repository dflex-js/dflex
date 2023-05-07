/* eslint-disable no-underscore-dangle */
import {
  AxesPoint,
  Axis,
  Dimensions,
  Direction,
  BoxRect,
  getParentElm,
  PointBool,
  Threshold,
  getCachedComputedStyle,
  getDimensionTypeByAxis,
  eventDebounce,
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
  visibleScreen: Dimensions;
};

const OVERFLOW_REGEX = /(auto|scroll|overlay)/;

function isStaticallyPositioned(DOM: Element): boolean {
  const computedStyle = getCachedComputedStyle(DOM);
  const position = computedStyle.getPropertyValue("position");
  return position === "static";
}

function getScrollContainer(baseDOMElm: HTMLElement): [HTMLElement, boolean] {
  let hasDocumentAsContainer = false;

  const { position: baseELmPosition } = getCachedComputedStyle(baseDOMElm);
  const excludeStaticParents = baseELmPosition === "absolute";

  const scrollContainerDOM = getParentElm(baseDOMElm, (parentDOM) => {
    const { overflowX, overflowY } = getCachedComputedStyle(parentDOM);
    const parentRect = parentDOM.getBoundingClientRect();

    if (excludeStaticParents && isStaticallyPositioned(parentDOM)) {
      return false;
    }

    if (
      OVERFLOW_REGEX.test(overflowY) &&
      parentDOM.scrollHeight === Math.round(parentRect.height)
    ) {
      hasDocumentAsContainer = true;
      return true;
    }

    if (
      OVERFLOW_REGEX.test(overflowX) &&
      parentDOM.scrollWidth === Math.round(parentRect.width)
    ) {
      hasDocumentAsContainer = true;
      return true;
    }

    return false;
  });

  if (
    hasDocumentAsContainer ||
    baseELmPosition === "fixed" ||
    !scrollContainerDOM
  ) {
    return [document.documentElement, true];
  }

  return [scrollContainerDOM, false];
}

function hasOverFlow(
  scrollRect: Dimensions,
  scrollContainerRect: Dimensions,
  axis: Axis,
  checkHalf: boolean = false
): boolean {
  const dimension = getDimensionTypeByAxis(axis);
  const threshold = checkHalf ? 0.5 : 1;

  return scrollRect[dimension] / threshold > scrollContainerRect[dimension];
}

const MAX_NUM_OF_SIBLINGS_BEFORE_DYNAMIC_VISIBILITY = 10;

const OUTER_THRESHOLD: ThresholdPercentages = {
  horizontal: 25,
  vertical: 25,
};

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
  visibleScrollRect: BoxRect;

  /**
   * The entire scroll rect visible and invisible.
   */
  totalScrollRect: BoxRect;

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
  private _containerDOM!: HTMLElement;

  private _isDocumentContainer!: boolean;

  private _listenerDatasetKey: string;

  static getType(): string {
    return "scroll:container";
  }

  constructor(
    firstELmDOM: HTMLElement,
    SK: string,
    branchLength: number,
    scrollEventCallback: ScrollEventCallback
  ) {
    this._SK = SK;
    this._threshold_inner_key = `scroll_inner_${SK}`;
    this._threshold_outer_key = `scroll_outer_${SK}`;
    this._listenerDatasetKey = `dflexScrollListener_${SK}`;

    this.hasOverflow = new PointBool(false, false);
    this.totalScrollRect = new BoxRect(0, 0, 0, 0);
    this.visibleScrollRect = new BoxRect(0, 0, 0, 0);
    this.allowDynamicVisibility = false;
    this._innerThresholdInViewport = null;
    this._outerThresholdInViewport = null;
    this._scrollEventCallback = null;

    const [containerDOM, isDocumentContainer] = getScrollContainer(firstELmDOM);
    this._containerDOM = containerDOM;
    this._isDocumentContainer = isDocumentContainer;

    this._updateScrollRect();
    this._updateScrollPosition(
      this._containerDOM.scrollLeft,
      this._containerDOM.scrollTop,
      false
    );
    this._updateOverflowStatus();

    if (
      branchLength > MAX_NUM_OF_SIBLINGS_BEFORE_DYNAMIC_VISIBILITY &&
      this.allowDynamicVisibility
    ) {
      this._scrollEventCallback = scrollEventCallback;
      this._outerThresholdInViewport = new Threshold(OUTER_THRESHOLD);
      this._outerThresholdInViewport.setMainThreshold(
        this._threshold_outer_key,
        this.visibleScrollRect,
        false
      );
    }

    this._attachResizeAndScrollListeners();

    if (this.totalScrollRect.top > 0 || this.totalScrollRect.left > 0) {
      this._updateScrollPosition(0, 0, true);
    }
  }

  private _updateOverflowStatus(): void {
    const checkOverflow = (axis: Axis, checkHalf?: boolean) =>
      hasOverFlow(
        this.totalScrollRect,
        this.visibleScrollRect,
        axis,
        checkHalf
      );

    const hasOverflowX = checkOverflow("x");
    const hasOverflowY = checkOverflow("y");

    this.hasOverflow.setAxes(hasOverflowX, hasOverflowY);
    this.allowDynamicVisibility = false;

    if (hasOverflowY) {
      // Check if the scrollRect dimension for the given axis is more than half of the scrollContainerRect dimension.
      this.allowDynamicVisibility = checkOverflow("y", true);

      return;
    }

    if (hasOverflowX) {
      // Check if the scrollRect dimension for the given axis is more than half of the scrollContainerRect dimension.
      this.allowDynamicVisibility = checkOverflow("x", true);
    }
  }

  /**
   * Updates the scroll-related rectangles based on the container's dimensions and scroll positions.
   * - Updates the overall scroll rectangle representing the entire scrollable content.
   * - Calculates the visible scroll rectangle representing the visible portion of the container.
   *   For document containers, it represents the entire client viewport.
   *   For non-document containers, it takes into account the container's position.
   */
  private _updateScrollRect(): void {
    const {
      scrollHeight, // Total height of the scrollable content
      scrollWidth, // Total width of the scrollable content
      scrollLeft, // Horizontal scroll position
      scrollTop, // Vertical scroll position
      clientHeight, // Height of the visible portion of the container
      clientWidth, // Width of the visible portion of the container
    } = this._containerDOM;

    this.totalScrollRect.setByPointAndDimensions(
      scrollTop,
      scrollLeft,
      scrollHeight,
      scrollWidth
    );

    // Calculate the visible portion of the container
    if (this._isDocumentContainer) {
      // For document container, the visible area is the entire client viewport
      this.visibleScrollRect.setByPointAndDimensions(
        0,
        0,
        clientHeight,
        clientWidth
      );
    } else {
      const { left, top } = this._containerDOM.getBoundingClientRect();

      this.visibleScrollRect.setByPointAndDimensions(
        top,
        left,
        clientHeight,
        clientWidth
      );
    }
  }

  private _updateScrollPosition(
    scrollLeft: number,
    scrollTop: number,
    withDOM: boolean
  ): boolean {
    const shouldUpdate = this.totalScrollRect.hasEqualPosition(
      scrollLeft,
      scrollTop
    );

    if (!shouldUpdate) {
      return false;
    }

    this.totalScrollRect.setPosition(scrollLeft, scrollTop);

    if (withDOM) {
      this._containerDOM.scrollTop = scrollTop;
      this._containerDOM.scrollLeft = scrollLeft;
    }

    return true;
  }

  scrollTo(x: number, y: number): void {
    this._updateScrollPosition(x, y, true);

    if (this._scrollEventCallback) {
      this._scrollEventCallback(this._SK);
    }
  }

  /**
   *
   * @param axis
   * @param direction
   * @returns
   */
  hasScrollableArea(axis: Axis, direction: Direction): boolean {
    if (!this.hasOverflow[axis]) {
      return false;
    }

    const scrollRect =
      axis === "x" ? this.totalScrollRect.width : this.totalScrollRect.height;

    const visibleRect =
      axis === "x"
        ? this.visibleScrollRect.width
        : this.visibleScrollRect.height;

    if (direction === 1) {
      return scrollRect - visibleRect > 0;
    }

    if (direction === -1) {
      return visibleRect > 0;
    }

    return false;
  }

  private _updateDOMDataset(
    isAttachListener: boolean,
    hasScrollListener: boolean
  ): void {
    const datasetKey = this._listenerDatasetKey;
    const datasetValue = hasScrollListener.toString();
    const targetElement = this._isDocumentContainer
      ? document.body
      : this._containerDOM;

    if (isAttachListener) {
      targetElement.dataset[datasetKey] = datasetValue;
    } else {
      delete targetElement.dataset[datasetKey];
    }
  }

  private _throttledScrollHandler = eventDebounce(() => {
    const { scrollLeft, scrollTop } = this._containerDOM;

    const isUpdated = this._updateScrollPosition(scrollLeft, scrollTop, false);

    if (isUpdated && this._scrollEventCallback) {
      this._scrollEventCallback(this._SK);
    }
  });

  private _throttledResizeHandler = eventDebounce(this._updateScrollRect);

  private _attachResizeAndScrollListeners(isAttachListener = true): void {
    /**
     * No need to set scroll listener if there is no scroll.
     */

    const eventAction = isAttachListener
      ? "addEventListener"
      : "removeEventListener";

    const container = this._isDocumentContainer ? window : this._containerDOM;

    const options = { passive: true };

    container[eventAction]("resize", this._throttledResizeHandler, options);

    if (this.hasOverflow.isOneTruthy()) {
      container[eventAction]("scroll", this._throttledScrollHandler, options);

      this._updateDOMDataset(isAttachListener, true);
    } else if (!this._isDocumentContainer) {
      this._updateDOMDataset(isAttachListener, false);
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
   * @param pause
   */
  pauseListeners(pause: boolean): void {
    if (pause) {
      this._throttledScrollHandler.pause();
    } else {
      this._throttledScrollHandler.resume();
    }
  }

  private _clearInnerThreshold(): void {
    if (this._innerThresholdInViewport) {
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
    this._clearInnerThreshold();

    this._innerThresholdInViewport = new Threshold(threshold);

    this._innerThresholdInViewport.setMainThreshold(
      this._threshold_inner_key,
      this.visibleScrollRect,
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
      axis === "y" ? this.totalScrollRect.top : this.totalScrollRect.left;

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
    const { left, width } = this.visibleScrollRect;

    return left + width + this.totalScrollRect.left;
  }

  /**
   * @deprecated - Should be removed when refactoring retractions.
   * @returns
   */
  getMaximumScrollContainerTop() {
    const { top, height } = this.visibleScrollRect;

    return top + height + this.totalScrollRect.top;
  }

  getElmPositionInViewport(topPos: number, leftPos: number): [number, number] {
    const { top, left } = this.totalScrollRect;

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

  private _getVisibleScreen(): Dimensions {
    const { height, width } = this.visibleScrollRect;

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
      hasDocumentAsContainer: this._isDocumentContainer,
      scrollRect: this.totalScrollRect.getBox(),
      scrollContainerRect: this.visibleScrollRect.getBox(),
      visibleScreen: this._getVisibleScreen(),
    };
  }

  /**
   * Clean up the container instances.
   */
  destroy(): void {
    this._clearInnerThreshold();
    this._scrollEventCallback = null;
    this._attachResizeAndScrollListeners(false);
    // @ts-expect-error
    this._containerDOM = null;
  }
}

export default DFlexScrollContainer;
