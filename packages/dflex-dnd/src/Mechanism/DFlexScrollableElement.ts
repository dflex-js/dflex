import { Axis, PointNum, Direction, Point, featureFlags } from "@dflex/utils";
import DFlexPositionUpdater from "./DFlexPositionUpdater";

import type DraggableInteractive from "../Draggable";
import { store } from "../LayoutManager";

import scrollTransition, {
  ScrollTransitionAbort,
} from "./DFlexScrollTransition";

function easeInOutCubic(t: number): number {
  if (t < 0.5) {
    return 4 * t ** 3;
  }
  return 1 - (-2 * t + 2) ** 3 / 2;
}

const SCROLL_THROTTLE_FACTOR = 8.5;

function calculateScrollThrottleMS(width: number, height: number): number {
  const scrollThrottleMS: number = Math.round(
    width > height
      ? width / SCROLL_THROTTLE_FACTOR
      : height / SCROLL_THROTTLE_FACTOR
  );

  return scrollThrottleMS;
}

class DFlexScrollableElement extends DFlexPositionUpdater {
  private _prevMousePosition!: PointNum;

  private _prevMouseDirection!: Point<Direction>;

  cancelScrolling: ScrollTransitionAbort | null;

  private _scrollThrottleTimeout?: ReturnType<typeof setTimeout>;

  private _scrollThrottleMS!: number;

  protected readonly initialScrollPosition!: PointNum;

  constructor(draggable: DraggableInteractive) {
    super(draggable);

    const { SK } = store.migration.latest();

    this.cancelScrolling = null;

    this.initialScrollPosition = new PointNum(0, 0);

    this._scrollThrottleTimeout = undefined;

    // If no scroll don't initialize.
    if (!store.scrolls.has(SK)) {
      return;
    }

    this._prevMousePosition = new PointNum(0, 0);
    this._prevMouseDirection = new Point<Direction>(-1, -1);

    const {
      totalScrollRect: { left, top },
      visibleScrollRect: { width, height },
    } = store.scrolls.get(SK)!;

    this._scrollThrottleMS = calculateScrollThrottleMS(width, height);

    this.initialScrollPosition.setAxes(left, top);
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
      !this._scrollThrottleTimeout && this.cancelScrolling !== null;

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

  private _scrollManager(
    draggedDirH: Direction,
    draggedDirV: Direction,
    directionChangedH: boolean,
    directionChangedV: boolean,
    SK: string
  ): void {
    const scroll = store.scrolls.get(SK)!;

    // IS scrollAnimatedFrame is already running?
    if (this.cancelScrolling) {
      const hasSuddenChangeInDirection: boolean =
        directionChangedV || directionChangedH;

      // When the direction changes, we need to cancel the animation and add
      // a little delay because we already at the threshold area.
      if (hasSuddenChangeInDirection) {
        this.cancelScrolling();
      }

      return;
    }

    const viewportPos = this.draggable.getViewportCurrentPos();

    const [isOut, preservedBoxResult] = scroll.isElmOutViewport(viewportPos);

    if (!isOut) {
      if (__DEV__) {
        if (featureFlags.enableScrollDebugger) {
          // eslint-disable-next-line no-console
          console.log("Scroll initially is inside threshold.");
        }
      }

      return;
    }

    const isOutV = preservedBoxResult.isTruthyOnSide("y", draggedDirV);
    const isOutH = preservedBoxResult.isTruthyOnSide("x", draggedDirH);

    if (!(isOutV || isOutH)) {
      if (__DEV__) {
        if (featureFlags.enableScrollDebugger) {
          // eslint-disable-next-line no-console
          console.warn(
            "Scroll is initially outside the threshold, but the desired direction is inside. Scroll: ",
            preservedBoxResult,
            { draggedDirV, draggedDirH }
          );
        }
      }

      return;
    }

    // is out but is out from the top and scroll there is not zero so throttle.

    let axis: Axis = "y";
    let direction: Direction = draggedDirV;

    if (isOutH) {
      axis = "x";
      direction = draggedDirV;
    }

    if (__DEV__) {
      if (featureFlags.enableScrollDebugger && isOut) {
        // eslint-disable-next-line no-console
        console.log(
          `Out of the scroll threshold (${axis}).`,
          preservedBoxResult,
          { draggedDirV, draggedDirH }
        );
      }
    }

    preservedBoxResult.setFalsy();

    const canScroll: boolean = scroll.hasScrollableArea(axis, direction);

    if (!canScroll) {
      // If there's not scrollable area, we don't need to scroll.

      if (__DEV__) {
        if (this.cancelScrolling) {
          throw new Error(
            "Scrolling should not occur if there is no scrollable area.\n" +
              "The `DFlexScrollTransition` function calculates the distance to the end of the scroll, " +
              "and this error indicates an incorrect distance calculation.\n" +
              "Please ensure that there is a valid scrollable area before attempting to scroll."
          );
        }
      }

      this._throttleScrolling();

      return;
    }

    const onComplete = () => {
      scroll.pauseListeners(false);
      this.cancelScrolling = null;

      if (featureFlags.enableScrollDebugger) {
        // eslint-disable-next-line no-console
        console.log("Scroll to the end is completed.");
      }
    };

    const onAbort = () => {
      scroll.pauseListeners(false);
      this.cancelScrolling = null;

      if (featureFlags.enableScrollDebugger) {
        // eslint-disable-next-line no-console
        console.log("Scroll is aborted.");
      }
    };

    scroll.pauseListeners(true);

    this.cancelScrolling = scrollTransition(
      scroll,
      axis,
      direction,
      null,
      easeInOutCubic,
      onComplete,
      __DEV__ ? onAbort : onComplete
    );
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
