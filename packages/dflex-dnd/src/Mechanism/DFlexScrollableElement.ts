import { Axis, PointNum, Direction, Point, featureFlags } from "@dflex/utils";
import type { DFlexScrollContainer } from "@dflex/core-instance";
import DFlexPositionUpdater from "./DFlexPositionUpdater";

import type DraggableInteractive from "../Draggable";
import { store } from "../LayoutManager";

class DFlexScrollableElement extends DFlexPositionUpdater {
  private _prevMousePosition!: PointNum;

  private _prevMouseDirection!: Point<Direction>;

  private _scrollAnimatedFrame!: number | null;

  private _timeout?: ReturnType<typeof setTimeout>;

  private _isScrollThrottled!: boolean;

  private _scrollThrottleMS!: number;

  private _lastScrollSpeed!: number;

  protected readonly initialScrollPosition!: PointNum;

  protected currentScrollAxes!: PointNum;

  private static easeOutCubic(t: number) {
    // eslint-disable-next-line no-plusplus
    return --t * t * t + 1;
  }

  constructor(draggable: DraggableInteractive) {
    super(draggable);

    const { SK } = store.migration.latest();

    this._scrollAnimatedFrame = null;

    this.initialScrollPosition = new PointNum(0, 0);

    /*
     * The reason for using this instance instead of calling the store
     * instance/listeners:
     * - There's a delay. Change of scrollY/X is not updated immediately. You
     *   have to wait for the next frame, as it's throttled and then get the value.
     * - The store instance is not available if there's no overflow.
     * - Guarantee same position for dragging. In scrolling/overflow case, or
     *   regular scrolling.
     */
    this.currentScrollAxes = new PointNum(0, 0);

    // If no scroll don't initialize.
    if (!store.scrolls.has(SK)) {
      return;
    }

    this._isScrollThrottled = false;
    this._prevMousePosition = new PointNum(0, 0);
    this._prevMouseDirection = new Point<Direction>(-1, -1);

    this._lastScrollSpeed = this.draggable.scroll.initialSpeed;

    this._clearScrollAnimatedFrame = this._clearScrollAnimatedFrame.bind(this);

    const {
      totalScrollRect: { left, top },
      visibleScrollRect: { width, height },
    } = store.scrolls.get(SK)!;

    this._scrollThrottleMS = Math.round(
      width > height ? width / 8.5 : height / 8.5
    );

    this.initialScrollPosition.setAxes(left, top);
    this.currentScrollAxes.setAxes(left, top);
  }

  isScrolling(): boolean {
    // Depending on scroll animated creates latency in the dragger. Cause it
    // clears by cancelAnimationFrame. So, we need to check throttled flag.
    return !this._isScrollThrottled && this._scrollAnimatedFrame !== null;
  }

  private _clearScrollAnimatedFrame(): void {
    this._scrollAnimatedFrame = null;

    this._isScrollThrottled = false;
  }

  protected cancelAndThrottleScrolling(scroll: DFlexScrollContainer): void {
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

    setTimeout(this._clearScrollAnimatedFrame, this._scrollThrottleMS);
  }

  private _scroll(axis: Axis, direction: Direction): void {
    const nextScrollPosition =
      this.currentScrollAxes[axis] + direction * this._lastScrollSpeed;

    this.currentScrollAxes[axis] = nextScrollPosition;
  }

  private _scrollManager(
    draggedDirH: Direction,
    draggedDirV: Direction,
    directionChangedH: boolean,
    directionChangedV: boolean,
    SK: string
  ): void {
    const scroll = store.scrolls.get(SK)!;

    // IS scrollAnimatedFrame is already running?
    if (this._scrollAnimatedFrame !== null) {
      const hasSuddenChangeInDirection: boolean =
        directionChangedV || directionChangedH;

      // When the direction changes, we need to cancel the animation and add
      // a little delay because we already at the threshold area.
      if (hasSuddenChangeInDirection) {
        this.cancelAndThrottleScrolling(scroll);
      }

      return;
    }

    const absPos = this.draggable.getAbsoluteCurrentPosition();

    const { rect } = this.draggable.draggedElm;

    const [isOut, _preservedBoxResult] = scroll.isElmOutViewport(
      absPos.top,
      absPos.left,
      rect.height,
      rect.width,
      true
    );

    let isOutH = _preservedBoxResult.isTruthyByAxis("x");
    let isOutV = _preservedBoxResult.isTruthyByAxis("y");

    // Enforce false state.
    if (
      isOutV &&
      (!scroll.hasOverflow.y ||
        !_preservedBoxResult.isTruthyOnSide("y", draggedDirV))
    ) {
      isOutV = false;
    }

    if (
      isOutH &&
      (!scroll.hasOverflow.x ||
        !_preservedBoxResult.isTruthyOnSide("x", draggedDirH))
    ) {
      isOutH = false;
    }

    _preservedBoxResult.setFalsy();

    if (__DEV__) {
      if (featureFlags.enableScrollDebugger && isOut) {
        const direction = isOutV ? "V" : "H";

        // eslint-disable-next-line no-console
        console.log(`Element is out of the scroll threshold (${direction}).`);
      }
    }

    if (!isOut) {
      return;
    }

    const canScroll = (): boolean =>
      (isOutV && scroll.hasScrollableArea("y", draggedDirV)) ||
      (isOutH && scroll.hasScrollableArea("x", draggedDirH));

    // If there's not scrollable area, we don't need to scroll.
    if (!canScroll()) {
      this.cancelAndThrottleScrolling(scroll);

      return;
    }

    let startingTime: number;
    let prevTimestamp: number;

    const EXECUTION_FRAME_RATE_MS_V = Math.round(
      scroll.totalScrollRect.height / 2
    );
    const EXECUTION_FRAME_RATE_MS_H = Math.round(
      scroll.totalScrollRect.width / 2
    );

    const scrollAnimatedFrame = (timestamp: number) => {
      scroll.pauseListeners(true);

      if (startingTime === undefined) {
        startingTime = timestamp;
      }

      const elapsed = timestamp - startingTime;

      if (prevTimestamp !== timestamp) {
        if (isOutV) {
          this._scroll("y", draggedDirV);
        }

        if (isOutH) {
          this._scroll("x", draggedDirH);
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

        scroll.scrollTo(this.currentScrollAxes.x, this.currentScrollAxes.y);
      }

      // Stop the animation after 2 seconds
      if (elapsed < EXECUTION_FRAME_RATE_MS_V) {
        prevTimestamp = timestamp;

        if (canScroll()) {
          this._scrollAnimatedFrame =
            requestAnimationFrame(scrollAnimatedFrame);
        }

        return;
      }

      clearTimeout(this._timeout);

      this._timeout = setTimeout(
        this._clearScrollAnimatedFrame,
        this._scrollThrottleMS
      );

      scroll.pauseListeners(false);
    };

    this._scrollAnimatedFrame = requestAnimationFrame(scrollAnimatedFrame);
  }

  protected scrollFeed(x: number, y: number, SK: string): void {
    const draggedDirH: Direction = x < this._prevMousePosition.x ? -1 : 1;
    const draggedDirV: Direction = y < this._prevMousePosition.y ? -1 : 1;

    const directionChangedH: boolean =
      draggedDirH !== this._prevMouseDirection.x;

    const directionChangedV: boolean =
      draggedDirV !== this._prevMouseDirection.y;

    if (!this._isScrollThrottled) {
      this._scrollManager(
        draggedDirH,
        draggedDirV,
        directionChangedH,
        directionChangedV,
        SK
      );
    }

    this._prevMousePosition.setAxes(x, y);
    this._prevMouseDirection.setAxes(draggedDirH, draggedDirV);
  }
}

export default DFlexScrollableElement;
