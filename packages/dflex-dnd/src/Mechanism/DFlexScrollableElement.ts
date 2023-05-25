import { Axis, PointNum, Direction, Point, featureFlags } from "@dflex/utils";
import type { DFlexScrollContainer } from "@dflex/core-instance";
import DFlexPositionUpdater from "./DFlexPositionUpdater";

import type DraggableInteractive from "../Draggable";
import { store } from "../LayoutManager";

// Enforce false state if conditions are met.
function enforceFalseStateIfNotValid(
  isOutByDir: boolean,
  hasOverflow: boolean,
  isTruthyOnSide: boolean
) {
  if (isOutByDir && (!hasOverflow || !isTruthyOnSide)) {
    return false;
  }

  return isOutByDir;
}

function easeOutCubic(t: number) {
  // eslint-disable-next-line no-plusplus
  return --t * t * t + 1;
}

function calculateScrollThrottleMS(width: number, height: number): number {
  const throttleFactor: number = 8.5;

  const scrollThrottleMS: number = Math.round(
    width > height ? width / throttleFactor : height / throttleFactor
  );

  return scrollThrottleMS;
}

class DFlexScrollableElement extends DFlexPositionUpdater {
  private _prevMousePosition!: PointNum;

  private _prevMouseDirection!: Point<Direction>;

  private _scrollAnimatedFrame!: number | null;

  private _scrollThrottleTimeout?: ReturnType<typeof setTimeout>;

  private _scrollThrottleMS!: number;

  private _lastScrollSpeed!: number;

  protected readonly initialScrollPosition!: PointNum;

  protected currentScrollAxes!: PointNum;

  constructor(draggable: DraggableInteractive) {
    super(draggable);

    const { SK } = store.migration.latest();

    this._scrollAnimatedFrame = null;

    this.initialScrollPosition = new PointNum(0, 0);

    this._scrollThrottleTimeout = undefined;

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

    this._prevMousePosition = new PointNum(0, 0);
    this._prevMouseDirection = new Point<Direction>(-1, -1);

    this._lastScrollSpeed = this.draggable.scroll.initialSpeed;

    const {
      totalScrollRect: { left, top },
      visibleScrollRect: { width, height },
    } = store.scrolls.get(SK)!;

    this._scrollThrottleMS = calculateScrollThrottleMS(width, height);

    this.initialScrollPosition.setAxes(left, top);
    this.currentScrollAxes.setAxes(left, top);
  }

  cancelScrolling(scroll: DFlexScrollContainer): void {
    if (__DEV__) {
      if (!this._scrollAnimatedFrame) {
        // eslint-disable-next-line no-console
        console.warn(
          "cancelScrolling: Scroll animated frame is not available."
        );
      }

      if (featureFlags.enableScrollDebugger) {
        // eslint-disable-next-line no-console
        console.log("Scroll is canceled.");
      }
    }

    cancelAnimationFrame(this._scrollAnimatedFrame!);

    this._scrollAnimatedFrame = null;

    // Activate listeners.
    scroll.pauseListeners(false);

    // Reset scrollSpeed.
    this._lastScrollSpeed = this.draggable.scroll.initialSpeed;
  }

  private _throttleScrolling(): void {
    if (__DEV__) {
      if (this._scrollThrottleTimeout !== undefined) {
        // eslint-disable-next-line no-console
        console.log("_throttleScrolling: Scroll is already throttled.");
      }

      if (featureFlags.enableScrollDebugger) {
        // eslint-disable-next-line no-console
        console.log("Scroll is throttled.");
      }
    }

    clearTimeout(this._scrollThrottleTimeout);

    this._scrollThrottleTimeout = setTimeout(() => {
      this._scrollThrottleTimeout = undefined;
    }, this._scrollThrottleMS);
  }

  hasActiveScrolling(): boolean {
    // It's not throttled and it has animated frame.
    const isActive =
      !this._scrollThrottleTimeout && this._scrollAnimatedFrame !== null;

    if (__DEV__) {
      if (featureFlags.enableScrollDebugger) {
        if (isActive) {
          // eslint-disable-next-line no-console
          console.log("Scroll is in progress.");
        }
      }
    }

    return isActive;
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
        this.cancelScrolling(scroll);
        this._throttleScrolling();
      }

      return;
    }

    const absPos = this.draggable.getAbsoluteCurrentPosition();

    const { rect } = this.draggable.draggedElm;

    const [isOutInitial, preservedBoxResult] = scroll.isElmOutViewport(
      absPos.top,
      absPos.left,
      rect.height,
      rect.width,
      true
    );

    if (!isOutInitial) {
      return;
    }

    const isOutV = enforceFalseStateIfNotValid(
      preservedBoxResult.isTruthyByAxis("y"),
      scroll.hasOverflow.y,
      preservedBoxResult.isTruthyOnSide("y", draggedDirV)
    );

    const isOutH = enforceFalseStateIfNotValid(
      preservedBoxResult.isTruthyByAxis("x"),
      scroll.hasOverflow.x,
      preservedBoxResult.isTruthyOnSide("x", draggedDirH)
    );

    // Override the final result after overriding the subs.
    const isOut = isOutV || isOutH;

    preservedBoxResult.setFalsy();

    if (!isOut) {
      return;
    }

    if (__DEV__) {
      if (isOutH && isOutV) {
        throw new Error(
          "_scrollManager: Invalid scroll direction Cannot scroll both horizontally and vertically simultaneously"
        );
      }
    }

    let scrollingAxis: Axis = "y";
    let scrollingDirection: Direction = draggedDirV;
    let EXECUTION_FRAME_RATE_MS = 0;

    if (isOutH) {
      scrollingAxis = "x";
      scrollingDirection = draggedDirV;
      EXECUTION_FRAME_RATE_MS = Math.round(scroll.totalScrollRect.width / 2);
    } else {
      EXECUTION_FRAME_RATE_MS = Math.round(scroll.totalScrollRect.height / 2);
    }

    if (__DEV__) {
      if (featureFlags.enableScrollDebugger && isOut) {
        // eslint-disable-next-line no-console
        console.log(`Out of the scroll threshold (${scrollingAxis}).`);
      }
    }

    const canScroll: boolean = scroll.hasScrollableArea(
      scrollingAxis,
      scrollingDirection
    );

    if (!canScroll) {
      // If there's not scrollable area, we don't need to scroll.
      if (this._scrollAnimatedFrame !== null) {
        this.cancelScrolling(scroll);
      }

      this._throttleScrolling();

      return;
    }

    let startingTime: number;
    let prevTimestamp: number;

    const scrollAnimatedFrame = (timestamp: number) => {
      scroll.pauseListeners(true);

      // extract starts here..

      if (startingTime === undefined) {
        startingTime = timestamp;
      }

      const elapsed = timestamp - startingTime;

      if (prevTimestamp !== timestamp) {
        this._scroll(scrollingAxis, scrollingDirection);

        const acc = easeOutCubic(elapsed / EXECUTION_FRAME_RATE_MS);

        // Increase scroll speed.
        this._lastScrollSpeed += Math.round(acc);

        scroll.scrollTo(this.currentScrollAxes.x, this.currentScrollAxes.y);
      }

      // Stop the animation after 2 seconds
      if (elapsed < EXECUTION_FRAME_RATE_MS) {
        prevTimestamp = timestamp;

        if (canScroll) {
          this._scrollAnimatedFrame =
            requestAnimationFrame(scrollAnimatedFrame);
        }

        return;
      }

      // extract ends here..

      this._throttleScrolling();

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

    if (__DEV__) {
      if (featureFlags.enableScrollDebugger) {
        if (this._scrollThrottleTimeout) {
          // eslint-disable-next-line no-console
          console.log(`Scroll is throttled: ${this._scrollThrottleTimeout}`);
        }
      }
    }

    if (!this._scrollThrottleTimeout) {
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
