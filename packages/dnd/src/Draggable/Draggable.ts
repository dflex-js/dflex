/* eslint-disable no-nested-ternary */

import type { MouseCoordinates } from "@dflex/draggable";
import type { Offset } from "@dflex/core-instance";

import Base from "./Base";
import type { ElmTree } from "../DnDStore";
import type { DraggableDnD, TempOffset, Threshold } from "./types";
import type { DndOpts } from "../types";

class Draggable extends Base implements DraggableDnD {
  innerOffsetX: number;

  innerOffsetY: number;

  tempOffset: TempOffset;

  prevY: number;

  numberOfElementsTransformed: number;

  inc: number;

  isMovingDownPrev: boolean;

  isMovingDown: boolean;

  isOutHorizontal: boolean;

  constructor(
    elmTree: ElmTree,
    siblingsK: string,
    siblingsBoundaries: Offset,
    initCoordinates: MouseCoordinates,
    opts: DndOpts
  ) {
    super(elmTree, siblingsK, siblingsBoundaries, initCoordinates, opts);

    const { x, y } = initCoordinates;

    this.innerOffsetX = x - this.draggedElm.currentLeft;
    this.innerOffsetY = y - this.draggedElm.currentTop;

    this.tempOffset = {
      currentLeft: 0,
      currentTop: 0,
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
    this.inc = 1;

    this.isMovingDownPrev = false;
    this.isMovingDown = false;

    this.isOutHorizontal = false;
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
    this.translate(x, y);

    /**
     * Every time we got new translate, offset should be updated
     */
    this.tempOffset.currentLeft = x - this.innerOffsetX;
    this.tempOffset.currentTop = y - this.innerOffsetY;
  }

  /**
   *
   * @param $ -
   */
  isOutH($: Threshold) {
    return (
      this.tempOffset.currentLeft < $.maxLeft ||
      this.tempOffset.currentLeft > $.maxRight
    );
  }

  /**
   *
   * @param $ -
   */
  isOutV($: Threshold) {
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
    return !this.isOutHorizontal && this.tempIndex <= 0 && !this.isMovingDown;
  }

  /**
   * Checks if dragged is the last child and going down.
   */
  isDraggedLeavingFromEnd() {
    return (
      this.siblingsList !== null &&
      !this.isOutHorizontal &&
      this.isMovingDown &&
      this.tempIndex >= this.siblingsList.length - 1
    );
  }

  isSiblingsTransformed() {
    return !this.isDraggedLeavingFromEnd() && this.isDraggedOut();
  }

  /**
   * @param y -
   */
  setDraggedMovingDown(y: number) {
    this.isMovingDown = y > this.prevY;

    // no point assigning the same value.
    if (this.prevY !== y) this.prevY = y;

    this.isMovingDownPrev = this.isMovingDown;
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
      const { translateX, translateY } = this.draggedElm;

      this.draggedStyleRef.transform = `translate(${translateX}px,${translateY}px)`;

      return;
    }

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
      this.numberOfElementsTransformed * topDifference,
      this.dragID,
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
