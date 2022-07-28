/* eslint-disable no-underscore-dangle */
import {
  AxesPoint,
  Axis,
  Dimensions,
  Direction,
  FourDirections,
  getParentElm,
  PointBool,
  Threshold,
} from "@dflex/utils";
import type { ThresholdPercentages, RectDimensions } from "@dflex/utils";

// eslint-disable-next-line no-unused-vars
type ScrollEventCallback = (SK: string) => void;

type OutputInvisibleDistance = {
  up: number;
  bottom: number;
  left: number;
  right: number;
};

export type SerializedScrollContainer = {
  type: string;
  version: 3;
  key: string;
  hasOverFlow: AxesPoint<boolean>;
  hasDocumentAsContainer: boolean;
  scrollRect: RectDimensions;
  scrollContainerRect: RectDimensions;
  invisibleDistance: OutputInvisibleDistance;
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

  private _threshold_inner_key: string;

  private _threshold_outer_key: string;

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

  hasOverflow: PointBool;

  invisibleDistance: FourDirections<number>;

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
    scrollEventCallback: ScrollEventCallback
  ) {
    this.allowDynamicVisibility = false;
    this.hasOverflow = new PointBool(false, false);
    this.invisibleDistance = new FourDirections(0, 0, 0, 0);

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

    this._setScrollRect();

    const { scrollLeft, scrollTop } = this.scrollContainerDOM;

    this._updateInvisibleDistance(scrollLeft, scrollTop, false);

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

  private _setScrollRect(): void {
    const { scrollHeight, scrollWidth, scrollLeft, scrollTop } =
      this.scrollContainerDOM;

    this.scrollRect = Object.seal({
      left: scrollLeft,
      top: scrollTop,
      width: scrollWidth,
      height: scrollHeight,
    });

    let scrollContainerRect: RectDimensions;

    const { clientHeight, clientWidth } = this.scrollContainerDOM;

    scrollContainerRect = {
      height: clientHeight,
      width: clientWidth,
      left: 0,
      top: 0,
    };

    if (!this.hasDocumentAsContainer) {
      const { left, top } = this.scrollContainerDOM.getBoundingClientRect();

      scrollContainerRect = {
        height: clientHeight,
        width: clientWidth,
        left,
        top,
      };
    }

    this.scrollContainerRect = Object.seal(scrollContainerRect);
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
    this.scrollRect.top = scrollTop!;
    this.scrollRect.left = scrollLeft!;

    const invisibleYTop = this.scrollRect.height - scrollTop;
    const invisibleXLeft = this.scrollRect.width - scrollLeft;

    this.invisibleDistance.setAll(
      scrollTop,
      invisibleXLeft - this.scrollContainerRect.width,
      invisibleYTop - this.scrollContainerRect.height,
      scrollLeft
    );

    console.log(
      "file: DFlexScrollContainer.ts ~ line 331 ~ this.invisibleDistance",
      this.invisibleDistance
    );

    if (triggerScrollEventCallback && this._scrollEventCallback !== null) {
      this._scrollEventCallback(this._SK);
    }
  }

  scrollTo(x: number, y: number): void {
    this._updateInvisibleDistance(x, y, true);

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
    console.log(
      "file: DFlexScrollContainer.ts ~ line 361 ~ val",
      axis,
      direction,
      val
    );

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
    const hasScrollListener =
      this.hasOverflow.isOneTruthy() && this.allowDynamicVisibility;

    const type = isAttachListener ? "addEventListener" : "removeEventListener";

    const container = this.hasDocumentAsContainer
      ? window
      : this.scrollContainerDOM;

    const opts = { passive: true };

    container[type]("resize", this.animatedResizeListener, opts);

    if (hasScrollListener) {
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
    if (this._innerThreshold !== null) {
      this._innerThreshold.destroy();
      this._innerThreshold = null;
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

    this._innerThreshold = new Threshold(threshold);

    this._innerThreshold.setMainThreshold(
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
    return (
      this.hasOverflow[axis] &&
      this._innerThreshold!.isOutThresholdByDirection(
        axis,
        direction,
        this._threshold_inner_key,
        startingPos,
        endingPos
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

  isElementVisibleViewport(
    topPos: number,
    leftPos: number,
    height: number,
    width: number
  ): boolean {
    const currentTopWithScroll = leftPos - this.scrollRect.left;
    const currentLeftWithScroll = topPos - this.scrollRect.top;

    const isOutThreshold = this._outerThreshold!.isOutThreshold(
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
    if (this._hasThrottledFrame !== null) return;

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

  getSerializedInstance(): SerializedScrollContainer {
    return {
      type: DFlexScrollContainer.getType(),
      version: 3,
      key: this._SK,
      hasOverFlow: this.hasOverflow.getInstance(),
      hasDocumentAsContainer: this.hasDocumentAsContainer,
      scrollRect: this.scrollRect,
      scrollContainerRect: this.scrollContainerRect,
      invisibleDistance: this.invisibleDistance.getAll(),
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
