/* eslint-disable no-nested-ternary */

import type { MouseCoordinates } from "@dflex/draggable";

import store from "../DnDStore";

import Base from "./Base";
import type { ElmTree, BoundariesOffset } from "../DnDStore";
import type {
  DraggableDnDInterface,
  TempOffset,
  Threshold,
  DraggableOpts,
} from "./types";

class Draggable extends Base implements DraggableDnDInterface {
  innerOffsetX: number;

  innerOffsetY: number;

  tempOffset: TempOffset;

  prevY: number;

  numberOfElementsTransformed: number;

  inc: number;

  isMovingDown: boolean;

  isOutHorizontal: boolean;

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

    this.isMovingDown = false;

    this.isOutHorizontal = false;
  }

  private isSelfRestrictedH(x: number) {
    const { left } = store.boundaries[
      store.registry[this.draggedElm.id].keys.sK
    ];

    if (!this.opts.restrictions.allowLeavingFromLeft) {
      const needPermissionLeft = x - this.innerOffsetX <= left;

      if (needPermissionLeft) return -this.outerOffsetX;
    }

    // if (!this.opts.restrictions.allowLeavingFromRight) {
    //   const needPermissionRight =
    //     x - this.innerOffsetX <= left + this.draggedElm.offset.width;

    //   if (needPermissionRight) return 0;
    // }

    return -1;
  }

  private isRestrictedToContainerV(y: number) {
    const { maxTop, minTop } = store.boundaries[
      store.registry[this.draggedElm.id].keys.sK
    ];

    if (!this.opts.restrictions.allowLeavingFromTop) {
      if (this.tempIndex <= 0) {
        const needPermissionUp = y - this.innerOffsetY <= maxTop;

        if (needPermissionUp) return maxTop + this.innerOffsetY;
      }
    }

    if (!this.opts.restrictions.allowLeavingFromBottom) {
      if (this.siblingsList) {
        const lastIndex = this.siblingsList.length - 1;

        if (this.tempIndex === lastIndex || this.tempIndex === -1) {
          const needPermissionDown = y - this.innerOffsetY >= minTop;

          if (needPermissionDown) return minTop + this.innerOffsetY;
        }
      }
    }

    return -1;
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
    const restrictedY = this.isRestrictedToContainerV(y);

    if (restrictedY > -1) {
      console.log("file: Draggable.ts ~ line 132 ~ restrictedY", restrictedY);
      this.translate(x, restrictedY);
      return;
    }

    // const restrictedX = this.isSelfRestrictedH(x);

    // if (restrictedX > -1) {
    //   this.translate(restrictedX, y);

    //   return;
    // }

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
    return !this.isOutHorizontal && this.tempIndex <= 0 && !this.isMovingDown;
  }

  /**
   * Checks if dragged is the last child and going down.
   */
  isDraggedLeavingFromBottom() {
    return (
      this.siblingsList !== null &&
      !this.isOutHorizontal &&
      this.isMovingDown &&
      this.tempIndex >= this.siblingsList.length - 1
    );
  }

  isSiblingsTransformed() {
    return !this.isDraggedLeavingFromBottom() && this.isDraggedOut();
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
