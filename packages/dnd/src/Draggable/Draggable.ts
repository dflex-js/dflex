/* eslint-disable no-nested-ternary */

import type { MouseCoordinates } from "@dflex/draggable";

import store from "../DnDStore";

import Base from "./Base";
import type { ElmTree, BoundariesOffset } from "../DnDStore";
import type {
  DraggableDnDInterface,
  TempOffset,
  OccupiedOffset,
  Threshold,
  DraggableOpts,
} from "./types";

class Draggable extends Base implements DraggableDnDInterface {
  innerOffsetX: number;

  innerOffsetY: number;

  tempOffset: TempOffset;

  occupiedOffset: OccupiedOffset;

  prevY: number;

  numberOfElementsTransformed: number;

  isMovingDown: boolean;

  isOutHorizontal: boolean;

  axesFilterNeeded: boolean;

  constructor(
    elmTree: ElmTree,
    siblingsBoundaries: BoundariesOffset,
    initCoordinates: MouseCoordinates,
    opts: DraggableOpts
  ) {
    super(elmTree, siblingsBoundaries, initCoordinates, opts);

    const { x, y } = initCoordinates;

    this.innerOffsetX = x - this.draggedElm.currentLeft;
    this.innerOffsetY = y - this.draggedElm.currentTop;

    this.tempOffset = {
      currentLeft: this.draggedElm.currentLeft,
      currentTop: this.draggedElm.currentTop,
    };

    this.occupiedOffset = {
      currentLeft: this.draggedElm.currentLeft,
      currentTop: this.draggedElm.currentTop,
      currentHeight: this.draggedElm.offset.height,
    };

    /**
     * previous X and Y are used to calculate mouse directions.
     */
    this.prevY = y;

    /**
     * It counts number of element that dragged has passed. This counter is
     * crucial to calculate drag's translate and index
     */
    this.numberOfElementsTransformed = 0;

    this.isMovingDown = false;

    this.isOutHorizontal = false;

    const $ = this.opts.restrictions;

    this.axesFilterNeeded =
      this.siblingsList !== null &&
      (!$.allowLeavingFromLeft ||
        !$.allowLeavingFromRight ||
        !$.allowLeavingFromTop ||
        !$.allowLeavingFromBottom);
  }

  getLastElmIndex() {
    return this.siblingsList!.length - 1;
  }

  private isDraggedFirstOrOutside() {
    return this.tempIndex <= 0;
  }

  isDraggedLastELm() {
    return this.tempIndex === this.getLastElmIndex();
  }

  private selfRightAxesFilter(x: number, left: number) {
    return x - this.innerOffsetX <= left + this.draggedElm.offset.width
      ? -this.outerOffsetX
      : x;
  }

  private selfHorizontalAxesFilter(x: number) {
    const { left } = store.siblingsBoundaries[
      store.registry[this.draggedElm.id].keys.sK
    ];

    return this.opts.restrictions.allowLeavingFromLeft
      ? this.selfRightAxesFilter(x, left)
      : x - this.innerOffsetX <= left
      ? -this.outerOffsetX
      : this.selfRightAxesFilter(x, left);
  }

  private containerBottomAxesFilter(y: number, minTop: number) {
    return this.opts.restrictions.allowLeavingFromBottom
      ? y
      : this.tempIndex <= 0 ||
        (this.isDraggedLastELm() && y - this.innerOffsetY >= minTop)
      ? minTop + this.innerOffsetY
      : y;
  }

  private containerVerticalAxesFilter(y: number) {
    const { maxTop, minTop } = store.siblingsBoundaries[
      store.registry[this.draggedElm.id].keys.sK
    ];

    return this.opts.restrictions.allowLeavingFromTop
      ? this.containerBottomAxesFilter(y, minTop)
      : this.isDraggedFirstOrOutside() && y - this.innerOffsetY <= maxTop
      ? maxTop + this.innerOffsetY
      : this.containerBottomAxesFilter(y, minTop);
  }

  /**
   * Dragged current-offset is essential to determine dragged position in
   * layout and parent.
   *
   * Is it moved form its translate? Is it out the parent or in
   * another parent? The answer is related to currentOffset.
   *
   * Note: these are the current offset related only to the dragging. When the
   * operation is done, different calculation will be set.
   *
   * @param x -
   * @param y -
   */
  dragAt(x: number, y: number) {
    let filteredY = y;
    let filteredX = x;

    if (this.axesFilterNeeded) {
      filteredY = this.containerVerticalAxesFilter(y);
      filteredX = this.selfHorizontalAxesFilter(x);
    }

    this.translate(filteredX, filteredY);

    /**
     * Every time we got new translate, offset should be updated
     */
    this.tempOffset.currentLeft = filteredX - this.innerOffsetX;
    this.tempOffset.currentTop = filteredY - this.innerOffsetY;
  }

  /**
   *
   * @param $ -
   */
  private isOutH($: Threshold) {
    return (
      this.tempOffset.currentLeft < $.maxLeft ||
      this.tempOffset.currentLeft > $.maxRight
    );
  }

  /**
   *
   * @param $ -
   */
  private isOutV($: Threshold) {
    return this.isMovingDown
      ? this.tempOffset.currentTop > $.maxBottom
      : this.tempOffset.currentTop < $.maxTop;
  }

  /**
   * Checks if dragged it out of its position or parent.
   *
   * @param siblingsK -
   */
  isDraggedOut(siblingsK?: string) {
    const { siblings, dragged } = this.thresholds;

    const $ = siblingsK ? siblings[siblingsK] : dragged;

    if (!$) return false;

    if (this.isOutH($)) {
      this.isOutHorizontal = true;

      return true;
    }

    if (this.isOutV($)) {
      this.isOutHorizontal = false;

      return true;
    }

    this.isOutHorizontal = false;

    return false;
  }

  /**
   * Checks if dragged is the first child and going up.
   */
  isDraggedLeavingFromTop() {
    return (
      this.isDraggedFirstOrOutside() &&
      !this.isOutHorizontal &&
      !this.isMovingDown
    );
  }

  /**
   * Checks if dragged is the last child and going down.
   */
  isDraggedLeavingFromBottom() {
    return (
      this.isDraggedLastELm() && !this.isOutHorizontal && this.isMovingDown
    );
  }

  isSiblingsTransformed() {
    return (
      this.siblingsList !== null &&
      !this.isDraggedLeavingFromBottom() &&
      this.isDraggedOut()
    );
  }

  /**
   * @param y -
   */
  setDraggedMovingDown(y: number) {
    if (this.prevY === y) return;

    this.isMovingDown = y > this.prevY;

    this.prevY = y;
  }

  incNumOfElementsTransformed(effectedElemDirection: number) {
    this.numberOfElementsTransformed += -1 * effectedElemDirection;
  }

  /**
   *
   * @param topDifference -
   */
  setDraggedPosition(topDifference: number) {
    /**
     * In this case, the use clicked without making any move.
     */
    if (
      this.siblingsList === null ||
      this.isSiblingsTransformed() ||
      this.numberOfElementsTransformed === 0
    ) {
      /**
       * If not isDraggedOutPosition, it means dragged is out its position, inside
       * list but didn't reach another element to replace.
       *
       * List's elements is in their position, just undo dragged.
       *
       * Restore dragged position (translateX, translateY) directly. Why? Because,
       * dragged depends on extra instance to float in layout that is not related to element
       * instance.
       */

      this.draggedElm.transformElm();

      if (this.siblingsList) {
        this.draggedElm.assignNewPosition(
          this.siblingsList,
          this.draggedElm.order.self
        );
      }

      return;
    }

    // @ts-expect-error
    this.draggedElm.setCurrentOffset();

    const draggedDirection =
      this.tempIndex < this.draggedElm.order.self ? -1 : 1;

    this.numberOfElementsTransformed = Math.abs(
      this.numberOfElementsTransformed
    );

    /**
     * Move to new droppable position.
     *
     * We already have translate value in for dragged in goX/goY but it is
     * related to mouse dragging. Instead, we want to translate to droppable
     * element that is replaced by dragged.
     */
    this.draggedElm.setYPosition(
      this.siblingsList,
      draggedDirection,
      1 * topDifference,
      this.operationID,
      this.numberOfElementsTransformed,
      false
    );
  }

  /**
   * @param topDifference -
   */
  endDragging(topDifference: number) {
    this.setDragged(false);

    this.setDraggedPosition(topDifference);
  }
}

export default Draggable;
