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
  getDimensionTypeByAxis,
  eventDebounce,
  BoxNum,
  getElmPos,
  getElmOverflow,
  BoxBool,
  getStartingPointByAxis,
  getEndingPointByAxis,
  featureFlags,
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

function getScrollContainer(baseDOMElm: HTMLElement): [HTMLElement, boolean] {
  let hasDocumentAsContainer = false;

  const baseELmPosition = getElmPos(baseDOMElm);

  const excludeStaticParents = baseELmPosition === "absolute";

  const scrollContainerDOM = getParentElm(baseDOMElm, (parentDOM) => {
    const overflowX = getElmOverflow(baseDOMElm, "overflow-x");
    const overflowY = getElmOverflow(baseDOMElm, "overflow-y");

    const parentRect = parentDOM.getBoundingClientRect();

    if (excludeStaticParents && getElmPos(parentDOM) === "static") {
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

// Note: (maybe TODO) It can be customized by the user later.
const INNER_THRESHOLD: ThresholdPercentages = {
  horizontal: 10,
  vertical: 10,
};

type ScrollThreshold = {
  threshold: Threshold | null;
  key: string;
};

const LISTENER_DATASET_KEY_PREFIX = "dflexScrollListener";
const INNER_KEY_PREFIX = "scroll_inner";
const OUTER_KEY_PREFIX = "scroll_outer";

class DFlexScrollContainer {
  private _thresholdInViewport: {
    inner: ScrollThreshold;
    outer: ScrollThreshold;
  };

  private _SK: string;

  private _scrollEventCallback: ScrollEventCallback | null;

  /**
   * scroll container in the viewport. Only in the visible area.
   */
  _visibleScrollRect: BoxRect;

  /**
   * The entire scroll rect visible and invisible.
   */
  _totalScrollRect: BoxRect;

  _hasOverflow: PointBool;

  /**
   * Some containers are overflown but in small percentages of the container
   * doesn't require adding visible scroll listeners and all the related events
   * and functionality. Current percentage is set to 0.5.
   */
  _allowDynamicVisibility: boolean;

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

    this._thresholdInViewport = {
      inner: {
        threshold: null,
        key: `${INNER_KEY_PREFIX}_${SK}`,
      },
      outer: {
        threshold: null,
        key: `${OUTER_KEY_PREFIX}_${SK}`,
      },
    };

    this._listenerDatasetKey = `${LISTENER_DATASET_KEY_PREFIX}_${SK}`;

    this._hasOverflow = new PointBool(false, false);
    this._totalScrollRect = new BoxRect(0, 0, 0, 0);
    this._visibleScrollRect = new BoxRect(0, 0, 0, 0);
    this._allowDynamicVisibility = false;
    this._scrollEventCallback = null;

    const [containerDOM, isDocumentContainer] = getScrollContainer(firstELmDOM);
    this._containerDOM = containerDOM;
    this._isDocumentContainer = isDocumentContainer;

    this._updateScrollRect();

    this._updateOverflowStatus();

    if (
      branchLength > MAX_NUM_OF_SIBLINGS_BEFORE_DYNAMIC_VISIBILITY &&
      this._allowDynamicVisibility
    ) {
      this._scrollEventCallback = scrollEventCallback;

      this._initializeThreshold("outer", OUTER_THRESHOLD);
    }

    this._attachResizeAndScrollListeners();

    if (this._totalScrollRect.top > 0 || this._totalScrollRect.left > 0) {
      this._updateScrollPosition(0, 0, true);
    }

    if (__DEV__) {
      Object.seal(this);
    }
  }

  private _initializeThreshold(
    type: "inner" | "outer",
    thresholdValue: ThresholdPercentages
  ): void {
    const threshold = new Threshold(thresholdValue);
    const instance = this._thresholdInViewport[type];
    instance.threshold = threshold;
    threshold.setMainThreshold(
      instance.key,
      this._visibleScrollRect,
      type === "inner"
    );
  }

  private _updateOverflowStatus(): void {
    const checkOverflow = (axis: Axis, checkHalf?: boolean) =>
      hasOverFlow(
        this._totalScrollRect,
        this._visibleScrollRect,
        axis,
        checkHalf
      );

    const hasOverflowX = checkOverflow("x");
    const hasOverflowY = checkOverflow("y");

    this._hasOverflow.setAxes(hasOverflowX, hasOverflowY);
    this._allowDynamicVisibility = false;

    if (hasOverflowY) {
      // Check if the scrollRect dimension for the given axis is more than half of the scrollContainerRect dimension.
      this._allowDynamicVisibility = checkOverflow("y", true);

      return;
    }

    if (hasOverflowX) {
      // Check if the scrollRect dimension for the given axis is more than half of the scrollContainerRect dimension.
      this._allowDynamicVisibility = checkOverflow("x", true);
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

    this._totalScrollRect.setByPointAndDimensions(
      scrollTop,
      scrollLeft,
      scrollHeight,
      scrollWidth
    );

    // Calculate the visible portion of the container
    if (this._isDocumentContainer) {
      // For document container, the visible area is the entire client viewport
      this._visibleScrollRect.setByPointAndDimensions(
        scrollTop,
        scrollLeft,
        clientHeight,
        clientWidth
      );
    } else {
      const { left, top } = this._containerDOM.getBoundingClientRect();

      this._visibleScrollRect.setByPointAndDimensions(
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
    const shouldUpdate = this._totalScrollRect.hasEqualPosition(
      scrollLeft,
      scrollTop
    );

    if (!shouldUpdate) {
      return false;
    }

    this._totalScrollRect.setPosition(scrollLeft, scrollTop);

    if (withDOM) {
      this._containerDOM.scrollTop = scrollTop;
      this._containerDOM.scrollLeft = scrollLeft;
    }

    return true;
  }

  _scrollTo(x: number, y: number): void {
    this._updateScrollPosition(
      x === -1 ? this._containerDOM.scrollLeft : x,
      y === -1 ? this._containerDOM.scrollTop : y,
      true
    );

    if (this._scrollEventCallback) {
      this._scrollEventCallback(this._SK);
    }
  }

  private _getNumbersFromPoints(axis: Axis): [number, number, number] {
    const start = getStartingPointByAxis(axis);
    const startPos = this._totalScrollRect[start];

    const end = getEndingPointByAxis(axis);
    const endPos = this._totalScrollRect[end];

    const dimension = getDimensionTypeByAxis(axis);
    const viewportSize = this._visibleScrollRect[dimension];

    return [startPos, endPos, viewportSize];
  }

  _calculateDistance(axis: Axis, direction: Direction): number {
    const [startPos, endPos, viewportSize] = this._getNumbersFromPoints(axis);

    const scrollableArea =
      direction === 1 ? endPos - (startPos + viewportSize) : startPos;

    if (__DEV__) {
      if (featureFlags.enableScrollDebugger) {
        // eslint-disable-next-line no-console
        console.log("calculateDistance", scrollableArea);
      }
    }

    return scrollableArea;
  }

  _hasScrollableArea(axis: Axis, direction: Direction): boolean {
    if (__DEV__) {
      if (!this._hasOverflow[axis]) {
        throw new Error(
          `Cannot call hasScrollableArea when there is no overflow in the ${axis} direction.`
        );
      }
    }

    const [startPos, endPos, viewportSize] = this._getNumbersFromPoints(axis);

    const hasScrollableArea =
      direction === 1 ? startPos + viewportSize < endPos : startPos > 0;

    if (__DEV__) {
      if (featureFlags.enableScrollDebugger) {
        // eslint-disable-next-line no-console
        console.log("hasScrollableArea", hasScrollableArea);
      }
    }

    return hasScrollableArea;
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

  private _throttledResizeHandler = eventDebounce(() => {
    this._updateScrollRect();
    this._updateOverflowStatus();

    // If it's not initialized yet. Leave it as it is.
    if (this._thresholdInViewport.outer) {
      this._initializeThreshold("outer", OUTER_THRESHOLD);

      if (this._thresholdInViewport.inner) {
        this._initializeThreshold("inner", INNER_THRESHOLD);
      }
    }
  });

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

    if (this._hasOverflow.isOneTruthy()) {
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
  _pauseListeners(pause: boolean): void {
    if (pause) {
      this._throttledScrollHandler.pause();
    } else {
      this._throttledScrollHandler.resume();
    }
  }

  private _clearInnerThreshold(): void {
    if (this._thresholdInViewport.inner.threshold) {
      this._thresholdInViewport.inner.threshold.destroy();
      this._thresholdInViewport.inner.threshold = null;
    }
  }

  /**
   * Cerate and set inner threshold for the scroll container that is responsible
   * for checking if dragged element is out of the scroll container or not.
   *
   * Note: this method is called when dragged is triggered so it gives the user
   * more flexibility to choose the threshold in relation to the dragged element.
   *
   */
  _setInnerThreshold() {
    if (__DEV__) {
      if (!this._thresholdInViewport.outer.threshold) {
        throw new Error(
          "setInnerThreshold: Cannot set inner threshold when the outer threshold is not set."
        );
      }
    }

    // If it's already exist. It means one of the siblings has been triggered
    // previously and there's not need to initialize it again.
    if (this._thresholdInViewport.inner.threshold) {
      return;
    }

    this._initializeThreshold("inner", INNER_THRESHOLD);
  }

  /**
   * @deprecated - Should be removed when refactoring retractions.
   * @returns
   */
  _getMaximumScrollContainerLeft() {
    const { left, width } = this._visibleScrollRect;

    return left + width + this._totalScrollRect.left;
  }

  /**
   * @deprecated - Should be removed when refactoring retractions.
   * @returns
   */
  _getMaximumScrollContainerTop() {
    const { top, height } = this._visibleScrollRect;

    return top + height + this._totalScrollRect.top;
  }

  _getElmViewportPosition(
    elmTopPos: number,
    elmLeftPos: number
  ): [number, number] {
    const { top: totalScrollTop, left: totalScrollLeft } =
      this._totalScrollRect;

    const viewportTop = elmTopPos - totalScrollTop;
    const viewportLeft = elmLeftPos - totalScrollLeft;

    return [viewportTop, viewportLeft];
  }

  _isElmOutViewport(absPos: BoxRect | BoxNum): [boolean, BoxBool] {
    let viewportPos: BoxNum;
    let instance: ScrollThreshold;

    if (absPos instanceof BoxRect) {
      const [viewportTop, viewportLeft] = this._getElmViewportPosition(
        absPos.top,
        absPos.left
      );

      const top = viewportTop;
      const right = viewportLeft + absPos.width;
      const bottom = viewportTop + absPos.height;
      const left = viewportLeft;

      viewportPos = new BoxNum(top, right, bottom, left);
      instance = this._thresholdInViewport.outer;
    } else {
      viewportPos = absPos;
      instance = this._thresholdInViewport.inner;
    }

    if (__DEV__) {
      if (!instance) {
        throw new Error(
          "isElmOutViewport: _thresholdInViewport is not initialized. Please call setInnerThreshold() method before using isElmOutViewport()."
        );
      }

      if (!this._hasOverflow) {
        throw new Error(
          "isElmOutViewport: Scrollable element does not have overflow."
        );
      }

      if (this._hasOverflow.x && this._hasOverflow.y) {
        // eslint-disable-next-line no-console
        console.warn(
          "isElmOutViewport: Scrollable element has overflow in both x and y directions.\nDFlex is not yet fully optimized to handle this scenario, and the results may be inaccurate."
        );
      }
    }

    const { threshold, key } = instance;

    const isOutThreshold = threshold!.isOutThreshold(
      key,
      viewportPos,
      this._hasOverflow.y ? "y" : "x"
    );

    const preservedBoxResult = threshold!.isOut[key];

    return [isOutThreshold, preservedBoxResult];
  }

  private _getVisibleScreen(): Dimensions {
    const { height, width } = this._visibleScrollRect;

    return {
      height,
      width,
    };
  }

  _getSerializedInstance(): DFlexSerializedScroll {
    return {
      type: DFlexScrollContainer.getType(),
      version: 3,
      key: this._SK,
      hasOverFlow: this._hasOverflow.getInstance(),
      hasDocumentAsContainer: this._isDocumentContainer,
      scrollRect: this._totalScrollRect.getBox(),
      scrollContainerRect: this._visibleScrollRect.getBox(),
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
