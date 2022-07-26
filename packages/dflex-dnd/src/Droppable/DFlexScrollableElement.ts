import { Axis, PointNum, RectDimensions, Direction, Point } from "@dflex/utils";
import type { DFlexScrollContainer } from "@dflex/core-instance";
import DFlexPositionUpdater from "./DFlexPositionUpdater";

import type DraggableInteractive from "../Draggable";
import { store } from "../LayoutManager";

class DFlexScrollableElement extends DFlexPositionUpdater {
  private _prevMousePosition: PointNum;

  private _prevMouseDirection: Point<Direction>;

  private _scrollAnimatedFrame: number | null;

  private _timeout?: ReturnType<typeof setTimeout>;

  private _isScrollThrottled: boolean;

  private _lastScrollSpeed: number;

  protected readonly initialScrollPosition: PointNum;

  protected currentScrollAxes: PointNum;

  private static THROTTLE_FRAME_RATE_MS = 0;

  private static easeOutCubic(t: number) {
    // eslint-disable-next-line no-plusplus
    return --t * t * t + 1;
  }

  constructor(draggable: DraggableInteractive) {
    super(draggable);

    this._prevMousePosition = new PointNum(0, 0);
    this._prevMouseDirection = new Point<Direction>(-1, -1);

    this._scrollAnimatedFrame = null;
    this._isScrollThrottled = false;

    this._clearScrollAnimatedFrame = this._clearScrollAnimatedFrame.bind(this);

    const {
      scrollRect: { left, top },
    } = store.scrolls.get(this.draggable.migration.latest().SK)!;

    this.initialScrollPosition = new PointNum(left, top);

    this._lastScrollSpeed = 0;

    /*
     * The reason for using this instance instead of calling the store
     * instance/listeners:
     * - There's a delay. Change of scrollY/X is not updated immediately. You
     *   have to wait for the next frame, as it's throttled and then get the value.
     * - The store instance is not available if there's no overflow.
     * - Guarantee same position for dragging. In scrolling/overflow case, or
     *   regular scrolling.
     */
    this.currentScrollAxes = new PointNum(left, top);
  }

  isScrolling(): boolean {
    return this._scrollAnimatedFrame !== null;
  }

  private _clearScrollAnimatedFrame(): void {
    this._scrollAnimatedFrame = null;

    this._isScrollThrottled = false;

    console.log("scrollAnimatedFrame is cleared...");
  }

  protected cancelAndThrottleScrolling(scroll: DFlexScrollContainer): void {
    console.log("Throttling...");

    if (this._scrollAnimatedFrame !== null) {
      cancelAnimationFrame(this._scrollAnimatedFrame!);

      scroll.pauseListeners(false);
    }

    /**
     * Reset scrollSpeed.
     */
    this._lastScrollSpeed = this.draggable.scroll.initialSpeed;

    this._isScrollThrottled = true;

    clearTimeout(this._timeout);

    setTimeout(
      this._clearScrollAnimatedFrame,
      DFlexScrollableElement.THROTTLE_FRAME_RATE_MS
    );
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
      this.currentScrollAxes[axis] + direction * this._lastScrollSpeed;

    if (axis === "y") {
      const nextDraggedTop =
        nextScrollPosition + y + this.draggable.innerOffset[axis];

      const nextDraggedBottom = nextDraggedTop + draggedOffset.height;

      const { scrollRect, scrollContainerRect } = scroll;

      // If it's increasing, it's going to be out of the scroll container..
      if (direction === 1) {
        if (nextDraggedBottom > scrollRect.height) {
          nextScrollPosition = scrollRect.height - scrollContainerRect.height;
          console.log(
            "file: DFlexScrollableElement.ts ~ line 128 ~ nextScrollPosition",
            nextScrollPosition
          );
        }
      } else {
        console.log(
          `nextDraggedTop ${nextDraggedTop}`,
          `height ${scrollRect.height}`
        );

        if (Math.abs(nextDraggedTop) > scrollRect.height) {
          nextScrollPosition = 0;
          debugger;
        }
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
      } else if (Math.abs(nextDraggedLeft) < 0) {
        nextScrollPosition = 0;
      }
    }

    this.currentScrollAxes[axis] = nextScrollPosition;
  }

  private _scrollManager(
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

    // IS scrollAnimatedFrame is already running?
    if (this._scrollAnimatedFrame !== null) {
      const hasSuddenChangeInDirection: boolean =
        directionChangedV || directionChangedH;

      // When the direction changes, we need to cancel the animation and add
      // a little delay because we already at the threshold area.
      if (hasSuddenChangeInDirection) {
        const scroll = store.scrolls.get(SK)!;

        this.cancelAndThrottleScrolling(scroll);
      }

      console.log(
        "scrollAnimatedFrame is already running...",
        this._scrollAnimatedFrame
      );

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

    // If there's not scrollable area, we don't need to scroll.
    if (!canScroll()) {
      console.log("cant scroll...");
      this.cancelAndThrottleScrolling(scroll);

      return;
    }

    let startingTime: number;
    let prevTimestamp: number;

    const EXECUTION_FRAME_RATE_MS_V = Math.round(scroll.scrollRect.height / 2);
    const EXECUTION_FRAME_RATE_MS_H = Math.round(scroll.scrollRect.width / 2);

    const scrollAnimatedFrame = (timestamp: number) => {
      console.log("scrollAnimatedFrame...");
      scroll.pauseListeners(true);

      if (startingTime === undefined) {
        startingTime = timestamp;
      }

      const elapsed = timestamp - startingTime;
      console.log(
        "file: DFlexScrollableElement.ts ~ line 226 ~ elapsed",
        elapsed
      );

      if (prevTimestamp !== timestamp) {
        if (isOutV) {
          this._scroll(scroll, initialOffset, "y", x, y, directionV);
        }

        if (isOutH) {
          this._scroll(scroll, initialOffset, "x", x, y, directionH);
        }

        const acc = isOutV
          ? DFlexScrollableElement.easeOutCubic(
              elapsed / EXECUTION_FRAME_RATE_MS_V
            )
          : DFlexScrollableElement.easeOutCubic(
              elapsed / EXECUTION_FRAME_RATE_MS_H
            );

        // Increase scroll speed.
        this._lastScrollSpeed += Math.round(acc);

        scroll.updateInvisibleDistance(
          this.currentScrollAxes.x,
          this.currentScrollAxes.y
        );

        this.draggable.dragAt(
          x + this.currentScrollAxes.x - this.initialScrollPosition.x,
          y + this.currentScrollAxes.y - this.initialScrollPosition.y
        );

        scroll.scrollContainerDOM.scrollTop = this.currentScrollAxes.y;
        scroll.scrollContainerDOM.scrollLeft = this.currentScrollAxes.x;
      }

      // Stop the animation after 2 seconds
      if (elapsed < EXECUTION_FRAME_RATE_MS_V) {
        prevTimestamp = timestamp;

        if (canScroll()) {
          console.log("Another cycle...");
          this._scrollAnimatedFrame =
            requestAnimationFrame(scrollAnimatedFrame);
        }

        return;
      }

      console.log("scrollAnimatedFrame is done...");

      clearTimeout(this._timeout);

      this._timeout = setTimeout(
        this._clearScrollAnimatedFrame,
        DFlexScrollableElement.THROTTLE_FRAME_RATE_MS
      );

      scroll.pauseListeners(false);
    };

    console.log("scrollAnimatedFrame is started...");
    this._scrollAnimatedFrame = requestAnimationFrame(scrollAnimatedFrame);
  }

  protected scrollFeed(x: number, y: number): void {
    const directionH: Direction = x < this._prevMousePosition.x ? -1 : 1;

    const directionV: Direction = y < this._prevMousePosition.y ? -1 : 1;

    const directionChangedH: boolean =
      directionH !== this._prevMouseDirection.x;

    const directionChangedV: boolean =
      directionV !== this._prevMouseDirection.y;

    if (!this._isScrollThrottled) {
      this._scrollManager(
        x,
        y,
        directionH,
        directionV,
        directionChangedH,
        directionChangedV
      );
    } else {
      console.log("scroll throttled");
    }

    this._prevMousePosition.setAxes(x, y);
    this._prevMouseDirection.setAxes(directionH, directionV);
  }
}

export default DFlexScrollableElement;
