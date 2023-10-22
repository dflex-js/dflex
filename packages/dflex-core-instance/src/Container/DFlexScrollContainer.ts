/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
import {
  AxesPoint,
  Axis,
  Dimensions,
  Direction,
  BoxRect,
  PointBool,
  Threshold,
  getDimensionTypeByAxis,
  eventDebounce,
  BoxNum,
  BoxBool,
  getStartingPointByAxis,
  getEndingPointByAxis,
  featureFlags,
  noop,
} from "@dflex/utils";

import type { ThresholdPercentages, AbstractBox } from "@dflex/utils";
import getScrollContainerProperties from "./DFlexScrollContainerProperties";

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

function hasOverFlow(
  scrollRect: Dimensions,
  scrollContainerRect: Dimensions,
  axis: Axis,
  checkHalf: boolean = false,
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

const LISTENER_DATASET_KEY_PREFIX = "scroll";
const INNER_KEY_PREFIX = "scroll_inner";
const OUTER_KEY_PREFIX = "scroll_outer";

class DFlexScrollContainer {
  private _thresholdInViewport: {
    inner: ScrollThreshold;
    outer: ScrollThreshold;
  };

  private _SK: string;

  private _scrollEventCallback: ScrollEventCallback;

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
   * Determines if the length of the branch exceeds the threshold for being
   * considered a candidate for dynamic visibility.
   */
  private _isCandidateForDynamicVisibility: boolean;

  /**
   * The parent element that is owning the scroll.
   */
  private _containerDOM: HTMLElement;

  private _isDocumentContainer: boolean;

  private _listenerDatasetKey: string;

  static getType(): string {
    return "scroll:container";
  }

  constructor(
    firstELmDOM: HTMLElement,
    SK: string,
    branchLength: number,
    scrollEventCallback: ScrollEventCallback,
  );

  constructor(
    firstELmDOM: null,
    SK: null,
    branchLength: null,
    scrollEventCallback: null,
  );

  constructor(
    firstELmDOM: HTMLElement | null,
    SK: string | null,
    branchLength: number | null,
    scrollEventCallback: ScrollEventCallback | null,
  ) {
    // Callbacks.
    if (SK && scrollEventCallback) {
      this._SK = SK;
      this._scrollEventCallback = scrollEventCallback;
    } else {
      this._SK = "none";
      this._scrollEventCallback = noop;
    }

    /**
     * Inner threshold: Determines the trigger for auto scroll when scrollable
     * overflow exists. Set to null if there is no overflow.
     *
     * Outer threshold: Defines the visibility criteria for elements. Set to
     * null if all elements are fully visible.
     */
    this._thresholdInViewport = {
      inner: {
        // The inner threshold for auto scroll when there is overflow
        threshold: null,
        key: `${INNER_KEY_PREFIX}_${SK}`,
      },
      outer: {
        // The outer threshold for element visibility
        threshold: null,
        key: `${OUTER_KEY_PREFIX}_${SK}`,
      },
    };

    this._listenerDatasetKey = `${LISTENER_DATASET_KEY_PREFIX}__${SK}`;

    [this._containerDOM, this._isDocumentContainer, this.hasOverflow] =
      getScrollContainerProperties(firstELmDOM);

    // Rect.
    this.totalScrollRect = new BoxRect(0, 0, 0, 0);
    this.visibleScrollRect = new BoxRect(0, 0, 0, 0);
    this._isCandidateForDynamicVisibility = false;

    this.refreshScrollAndVisibility(branchLength || 0);

    this._attachResizeAndScrollListeners(true);

    if (__DEV__) {
      Object.seal(this);
    }
  }

  hasDynamicVisibility(): boolean {
    return (
      this._isCandidateForDynamicVisibility && this.hasOverflow.isOneTruthy()
    );
  }

  private _initializeOrDestroyThreshold(
    type: "inner" | "outer",
    thresholdValue: ThresholdPercentages | null,
  ): void {
    const instance = this._thresholdInViewport[type];

    // Then it's destroy.
    if (!thresholdValue) {
      if (instance.threshold) {
        instance.threshold.destroy();
        instance.threshold = null;
      }

      return;
    }

    const threshold = new Threshold(thresholdValue);
    instance.threshold = threshold;

    threshold.setMainThreshold(
      instance.key,
      this.visibleScrollRect,
      type === "inner",
    );
  }

  private _updateDOMDataset(
    isAttachListener: boolean,
    hasScrollListener: boolean,
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

  private _handleOverflowUpdate() {
    // No overflow. Reset.
    if (this.hasOverflow.isAllFalsy()) {
      this._initializeOrDestroyThreshold("inner", null);
      this._initializeOrDestroyThreshold("outer", null);

      // Remove tag if there's no overflow.
      this._updateDOMDataset(false, true);

      return;
    }

    // Only tagged if there's overflow.
    this._updateDOMDataset(true, true);

    this._initializeOrDestroyThreshold("inner", null);
    this._initializeOrDestroyThreshold("inner", INNER_THRESHOLD);

    if (this.hasDynamicVisibility()) {
      this._initializeOrDestroyThreshold("outer", null);
      this._initializeOrDestroyThreshold("outer", OUTER_THRESHOLD);
    }
  }

  private _updateOverflow(): void {
    const checkOverflow = (axis: Axis, checkHalf?: boolean) =>
      hasOverFlow(
        this.totalScrollRect,
        this.visibleScrollRect,
        axis,
        checkHalf,
      );

    const hasOverflowX = checkOverflow("x");
    const hasOverflowY = checkOverflow("y");

    this.hasOverflow.setAxes(hasOverflowX, hasOverflowY);

    this._handleOverflowUpdate();
  }

  private _hasChangedScrollDimension(axis: Axis, prevValue: number): boolean {
    const liveValue =
      this._containerDOM[axis === "x" ? "scrollWidth" : "scrollHeight"];

    return liveValue !== prevValue;
  }

  hasScrollDimensionChanges(): boolean {
    const { width, height } = this.totalScrollRect;

    return (
      this._hasChangedScrollDimension("y", height) ||
      this._hasChangedScrollDimension("x", width)
    );
  }

  refreshScrollAndVisibility(branchLength: number): void {
    this._updateScrollRect();

    this._isCandidateForDynamicVisibility =
      branchLength > MAX_NUM_OF_SIBLINGS_BEFORE_DYNAMIC_VISIBILITY;

    // If the container is not the document, there is no need to update the overflow status,
    // as the overflow has already been detected during initialization.
    if (this._isDocumentContainer) {
      this._updateOverflow();
    } else {
      // We certain there's overflow.
      this._handleOverflowUpdate();
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
      scrollWidth,
    );

    // Calculate the visible portion of the container
    if (this._isDocumentContainer) {
      // For document container, the visible area is the entire client viewport
      this.visibleScrollRect.setByPointAndDimensions(
        scrollTop,
        scrollLeft,
        clientHeight,
        clientWidth,
      );
    } else {
      const { left, top } = this._containerDOM.getBoundingClientRect();

      this.visibleScrollRect.setByPointAndDimensions(
        top,
        left,
        clientHeight,
        clientWidth,
      );
    }
  }

  private _updateScrollPosition(
    scrollLeft: number,
    scrollTop: number,
    withDOM: boolean,
  ): boolean {
    const shouldUpdate = this.totalScrollRect.hasEqualPosition(
      scrollLeft,
      scrollTop,
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
    this._updateScrollPosition(
      x === -1 ? this.totalScrollRect.left : x,
      y === -1 ? this.totalScrollRect.right : y,
      true,
    );

    this._scrollEventCallback(this._SK);
  }

  private _getNumbersFromPoints(axis: Axis): [number, number, number] {
    const start = getStartingPointByAxis(axis);
    const startPos = this.totalScrollRect[start];

    const end = getEndingPointByAxis(axis);
    const endPos = this.totalScrollRect[end];

    const dimension = getDimensionTypeByAxis(axis);
    const viewportSize = this.visibleScrollRect[dimension];

    return [startPos, endPos, viewportSize];
  }

  calculateDistance(axis: Axis, direction: Direction): number {
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

  hasScrollableArea(axis: Axis, direction: Direction): boolean {
    if (__DEV__) {
      if (!this.hasOverflow[axis]) {
        throw new Error(
          `Cannot call hasScrollableArea when there is no overflow in the ${axis} direction.`,
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

  private _throttledScrollHandler = eventDebounce(() => {
    const { scrollLeft, scrollTop } = this._containerDOM;

    const isUpdated = this._updateScrollPosition(scrollLeft, scrollTop, false);

    if (isUpdated) {
      this._scrollEventCallback(this._SK);
    }
  });

  private _throttledResizeHandler = eventDebounce(() => {
    this._updateScrollRect();
    this._updateOverflow();
  });

  private _attachResizeAndScrollListeners(isAttachListener: boolean): void {
    /**
     * No need to set scroll listener if there is no scroll.
     */

    const eventAction = isAttachListener
      ? "addEventListener"
      : "removeEventListener";

    const container = this._isDocumentContainer ? window : this._containerDOM;

    const options = { passive: true };

    container[eventAction]("resize", this._throttledResizeHandler, options);
    container[eventAction]("scroll", this._throttledScrollHandler, options);
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

  getElmViewportPosition(
    elmTopPos: number,
    elmLeftPos: number,
  ): [number, number] {
    const { top: totalScrollTop, left: totalScrollLeft } = this.totalScrollRect;

    const viewportTop = elmTopPos - totalScrollTop;
    const viewportLeft = elmLeftPos - totalScrollLeft;

    return [viewportTop, viewportLeft];
  }

  isElmOutViewport(absPos: BoxRect | BoxNum): [boolean, BoxBool] {
    let viewportPos: BoxNum;
    let instance: ScrollThreshold;

    if (absPos instanceof BoxRect) {
      const [viewportTop, viewportLeft] = this.getElmViewportPosition(
        absPos.top,
        absPos.left,
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
          "isElmOutViewport: _thresholdInViewport is not initialized. Please call setInnerThreshold() method before using isElmOutViewport().",
        );
      }

      if (!this.hasOverflow) {
        throw new Error(
          "isElmOutViewport: Scrollable element does not have overflow.",
        );
      }

      if (this.hasOverflow.x && this.hasOverflow.y) {
        // eslint-disable-next-line no-console
        console.warn(
          "isElmOutViewport: Scrollable element has overflow in both x and y directions.\nDFlex is not yet fully optimized to handle this scenario, and the results may be inaccurate.",
        );
      }
    }

    const { threshold, key } = instance;

    const isOutThreshold = threshold!.isOutThreshold(
      key,
      viewportPos,
      this.hasOverflow.y ? "y" : "x",
    );

    const preservedBoxResult = threshold!.isOut[key];

    return [isOutThreshold, preservedBoxResult];
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
    this._attachResizeAndScrollListeners(false);
    this._initializeOrDestroyThreshold("inner", null);
    this._initializeOrDestroyThreshold("outer", null);
    this._updateDOMDataset(false, true);

    // @ts-expect-error
    this._scrollEventCallback = undefined;
    // @ts-expect-error
    this._containerDOM = undefined;
  }
}

export default DFlexScrollContainer;
