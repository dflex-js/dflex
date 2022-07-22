import { Axis, PointNum, RectDimensions, Direction } from "@dflex/utils";
import type { DFlexScrollContainer } from "@dflex/core-instance";
import DFlexPositionUpdater from "./DFlexPositionUpdater";

import type DraggableInteractive from "../Draggable";
import { store } from "../LayoutManager";

const THROTTLE_FRAME_RATE_MS = 60;
const EXECUTION_FRAME_RATE_MS = 2000;

class DFlexScrollableElement extends DFlexPositionUpdater {
  private _scrollAnimatedFrame: number | null;

  private _timeout: ReturnType<typeof setTimeout> | null = null;

  private _isScrollThrottled: boolean;

  protected readonly initialScrollPosition: PointNum;

  protected currentScrollAxes: PointNum;

  protected isRegularDragging: boolean;

  private _lastScrollSpeed: number;

  constructor(draggable: DraggableInteractive) {
    super(draggable);

    this._scrollAnimatedFrame = null;
    this._timeout = null;
    this._isScrollThrottled = false;

    this._clearScrollAnimatedFrame = this._clearScrollAnimatedFrame.bind(this);

    const {
      scrollRect: { left, top },
    } = store.scrolls.get(this.draggable.migration.latest().SK)!;

    this.initialScrollPosition = new PointNum(left, top);

    this._lastScrollSpeed = this.draggable.scroll.initialSpeed;

    /*
     * The reason for using this instance instead of calling the store
     * instance/listeners:
     * - There's a delay. Change of scrollY/X is not updated immediately. You
     *   have to wait for the next frame, as it's throttled and then get the value.
     * - The store instance is not available if there's no overflow.
     * - Guarantee same position for dragging. In scrolling/overflow case, or
     *   regular scrolling.
     */
    this.currentScrollAxes = new PointNum(
      this.initialScrollPosition.x,
      this.initialScrollPosition.y
    );

    /**
     * This is true until there's a scrolling. Then, the scroll will handle the
     * scroll with dragging to ensure both are executed in the same frame.
     */
    this.isRegularDragging = true;
  }

  isScrollThrottled(): boolean {
    return this._isScrollThrottled;
  }

  private _clearScrollAnimatedFrame(): void {
    this._scrollAnimatedFrame = null;

    this._isScrollThrottled = false;

    console.log("scrollAnimatedFrame is cleared...");
  }

  private _cancelAndThrottleScrolling() {
    console.log("Throttling...");

    if (this._scrollAnimatedFrame !== null) {
      cancelAnimationFrame(this._scrollAnimatedFrame!);
    }

    /**
     * Reset scrollSpeed.
     */
    this._lastScrollSpeed = this.draggable.scroll.initialSpeed;

    /**
     * Scroll turns the flag off. But regular dragging will be resumed
     * when the drag is outside the auto scrolling area.
     */
    this.isRegularDragging = true;

    this._isScrollThrottled = true;

    if (this._timeout !== null) {
      clearTimeout(this._timeout);
    }

    setTimeout(this._clearScrollAnimatedFrame, THROTTLE_FRAME_RATE_MS);
  }

  private _scroll(
    scroll: DFlexScrollContainer,
    draggedOffset: RectDimensions,
    axis: Axis,
    x: number,
    y: number,
    direction: Direction
  ): void {
    let nextScrollPosition =
      this.currentScrollAxes[axis] +
      direction * this._lastScrollSpeed -
      this.initialScrollPosition[axis];

    if (axis === "y") {
      const nextDraggedTop =
        nextScrollPosition + y + this.draggable.innerOffset[axis];

      const nextDraggedBottom = nextDraggedTop + draggedOffset.height;

      const { scrollRect, scrollContainerRect } = scroll;

      // If it's increasing, it's going to be out of the scroll container..
      if (direction === 1) {
        if (nextDraggedBottom > scrollRect.height) {
          nextScrollPosition = scrollRect.height - scrollContainerRect.height;
        }
      } else if (nextDraggedTop < 0) {
        nextScrollPosition = 0;
      }
    } else {
      const nextDraggedLeft =
        nextScrollPosition + x + this.draggable.innerOffset[axis];

      const nextDraggedRight = nextDraggedLeft + draggedOffset.width;

      const { scrollRect, scrollContainerRect } = scroll;

      // If it's increasing, it's going to be out of the scroll container..
      if (direction === 1) {
        if (nextDraggedRight > scrollRect.width) {
          nextScrollPosition = scrollRect.width - scrollContainerRect.width;
        }
      } else if (nextDraggedLeft < 0) {
        nextScrollPosition = 0;
      }
    }

    this.currentScrollAxes[axis] = nextScrollPosition;
  }

  protected scrollManager(
    x: number,
    y: number,
    directionH: Direction,
    directionV: Direction,
    directionChangedH: boolean,
    directionChangedV: boolean
  ): void {
    console.log("scrollManager");
    const { draggedElm } = this.draggable;

    const {
      keys: { SK },
      initialOffset,
    } = draggedElm;

    const hasSuddenChangeInDirection: boolean =
      directionChangedV || directionChangedH;

    if (hasSuddenChangeInDirection && this._scrollAnimatedFrame !== null) {
      this._cancelAndThrottleScrolling();

      return;
    }

    const scroll = store.scrolls.get(SK)!;

    const isOutV = scroll.isOutThresholdV(y, initialOffset.height, directionV);
    const isOutH = scroll.isOutThresholdH(x, initialOffset.width, directionH);

    const isOut = isOutV || isOutH;

    if (!isOut) {
      console.log("isOut is false...", isOutV, isOutH);

      return;
    }

    const canScroll = (): boolean =>
      (isOutV && scroll.hasInvisibleSpace("y", directionV)) ||
      (isOutH && scroll.hasInvisibleSpace("x", directionH));

    if (!canScroll()) {
      this._cancelAndThrottleScrolling();

      return;
    }

    if (this._scrollAnimatedFrame !== null) {
      console.log(
        "scrollAnimatedFrame is already running...",
        this._scrollAnimatedFrame
      );

      return;
    }

    let startingTime: number;
    let prevTimestamp: number;

    const scrollAnimatedFrame = (timestamp: number) => {
      console.log("scrollAnimatedFrame...");
      scroll.pauseListeners(true);

      // Allow the draggable to be dragged outside the restriction area.
      this.draggable.isViewportRestricted = false;

      if (startingTime === undefined) {
        startingTime = timestamp;
      }

      const elapsed = timestamp - startingTime;

      if (prevTimestamp !== timestamp) {
        if (isOutV) {
          this._scroll(scroll, initialOffset, "y", x, y, directionV);
        }

        if (isOutH) {
          this._scroll(scroll, initialOffset, "x", x, y, directionH);
        }

        scroll.scrollContainerDOM.scrollTop = this.currentScrollAxes.y;
        scroll.scrollContainerDOM.scrollLeft = this.currentScrollAxes.x;

        this.draggable.dragAt(
          x + this.currentScrollAxes.x - this.initialScrollPosition.x,
          y + this.currentScrollAxes.y - this.initialScrollPosition.y
        );

        scroll.updateInvisibleDistance(
          this.currentScrollAxes.x,
          this.currentScrollAxes.y
        );

        // Increase scroll speed.
        // this._lastScrollSpeed += this.draggable.scroll.initialSpeed;
      }

      // Stop the animation after 2 seconds
      if (elapsed < EXECUTION_FRAME_RATE_MS || canScroll()) {
        prevTimestamp = timestamp;

        console.log("Another cycle...");
        this._scrollAnimatedFrame = requestAnimationFrame(scrollAnimatedFrame);

        return;
      }

      console.log("scrollAnimatedFrame is done...");

      if (this._timeout !== null) {
        clearTimeout(this._timeout);
      }

      this._timeout = setTimeout(
        this._clearScrollAnimatedFrame,
        THROTTLE_FRAME_RATE_MS
      );

      scroll.pauseListeners(false);
    };

    console.log("scrollAnimatedFrame is started...");
    this._scrollAnimatedFrame = requestAnimationFrame(scrollAnimatedFrame);
  }
}

export default DFlexScrollableElement;
