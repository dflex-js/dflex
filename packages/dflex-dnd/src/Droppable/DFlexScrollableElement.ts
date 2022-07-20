import { Axis, PointNum, RectDimensions, Direction } from "@dflex/utils";
import type { DFlexScrollContainer } from "@dflex/core-instance";
import DFlexPositionUpdater from "./DFlexPositionUpdater";

import type DraggableInteractive from "../Draggable";
import { store } from "../LayoutManager";

class DFlexScrollableElement extends DFlexPositionUpdater {
  private _scrollAnimatedFrame: number | null;

  protected readonly initialScrollPosition: PointNum;

  protected currentScrollAxes: PointNum;

  protected isRegularDragging: boolean;

  private _lastScrollSpeed: number;

  constructor(draggable: DraggableInteractive) {
    super(draggable);

    this._scrollAnimatedFrame = null;

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

  isScrollingIdle(): boolean {
    return this._scrollAnimatedFrame === null;
  }

  private _scroll(
    scroll: DFlexScrollContainer,
    draggedOffset: RectDimensions,
    axis: Axis,
    x: number,
    y: number,
    direction: 1 | -1
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
    const { draggedElm } = this.draggable;

    const {
      keys: { SK },
      initialOffset,
    } = draggedElm;

    const scroll = store.scrolls.get(SK)!;

    const isOutV = scroll.isOutThresholdV(y, initialOffset.height);
    const isOutH = scroll.isOutThresholdH(x, initialOffset.width);

    // If it's out with the a sudden change of the direction, then the user
    // decided to change the behavior but they still in the threshold. It's okay
    // user, we got you.
    const shouldHaltUntilNextTask =
      (isOutV && directionChangedV) || (isOutH && directionChangedH);

    if (shouldHaltUntilNextTask) {
      this._lastScrollSpeed = this.draggable.scroll.initialSpeed;

      // Pause until next task.
      this._scrollAnimatedFrame = 1;

      setTimeout(() => {
        this._scrollAnimatedFrame = null;
      }, 0);

      return;
    }

    if (isOutV || isOutH) {
      // Prevent store from implementing any animation response.
      scroll.pauseListeners(true);

      // Allow the draggable to be dragged outside the restriction area.
      this.draggable.isViewportRestricted = false;

      this._scrollAnimatedFrame = requestAnimationFrame(() => {
        // scroll goes here.

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

        // Reset animation flags.
        this._scrollAnimatedFrame = null;
        scroll.pauseListeners(false);

        // Increase scroll speed.
        this._lastScrollSpeed += this.draggable.scroll.initialSpeed;
      });

      return;
    }

    if (!this.isRegularDragging) {
      /**
       * Scroll turns the flag off. But regular dragging will be resumed
       * when the drag is outside the auto scrolling area.
       */
      this.isRegularDragging = true;

      /**
       * Reset scrollSpeed.
       */
      this._lastScrollSpeed = this.draggable.scroll.initialSpeed;
    }
  }
}

export default DFlexScrollableElement;
