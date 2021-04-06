/* eslint-disable no-nested-ternary */

import type { MouseCoordinates } from "@dflex/draggable";

import store from "../DnDStore";

import Base from "./Base";
import type { ElmTree, BoundariesOffset } from "../DnDStore";
import type {
  DraggableDnDInterface,
  TempOffset,
  Threshold,
  TempTranslate,
  DraggableOpts,
} from "./types";

class Draggable extends Base implements DraggableDnDInterface {
  private innerOffsetX: number;

  private innerOffsetY: number;

  tempOffset: TempOffset;

  occupiedOffset: TempOffset;

  occupiedTranslate: TempTranslate;

  prevY: number;

  numberOfElementsTransformed: number;

  isMovingDown: boolean;

  isOutPositionHorizontally: boolean;

  isOutSiblingsHorizontally: boolean;

  private axesFilterNeeded: boolean;

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
    };

    this.occupiedTranslate = {
      translateX: this.draggedElm.translateX,
      translateY: this.draggedElm.translateY,
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

    this.isOutPositionHorizontally = false;
    this.isOutSiblingsHorizontally = false;

    const $ = this.opts.restrictions;

    this.axesFilterNeeded =
      this.siblingsList !== null &&
      (!$.allowLeavingFromLeft ||
        !$.allowLeavingFromRight ||
        !$.allowLeavingFromTop ||
        !$.allowLeavingFromBottom);
  }

  private getLastElmIndex() {
    return this.siblingsList!.length - 1;
  }

  private isFirstOrOutside() {
    return this.siblingsList !== null && this.tempIndex <= 0;
  }

  private isLastELm() {
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
        (this.isLastELm() && y - this.innerOffsetY >= minTop)
      ? minTop + this.innerOffsetY
      : y;
  }

  private containerVerticalAxesFilter(y: number) {
    const { maxTop, minTop } = store.siblingsBoundaries[
      store.registry[this.draggedElm.id].keys.sK
    ];

    return this.opts.restrictions.allowLeavingFromTop
      ? this.containerBottomAxesFilter(y, minTop)
      : this.isFirstOrOutside() && y - this.innerOffsetY <= maxTop
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

  private isOutThresholdH($: Threshold) {
    return (
      this.tempOffset.currentLeft < $.maxLeft ||
      this.tempOffset.currentLeft > $.maxRight
    );
  }

  private isOutPositionV($: Threshold) {
    return this.isMovingDown
      ? this.tempOffset.currentTop > $.maxBottom
      : this.tempOffset.currentTop < $.maxTop;
  }

  private isOutContainerV($: Threshold) {
    /**
     * Are you last element and outside the container? Or are you coming from top
     * and outside the container?
     */
    return (
      (this.isLastELm() && this.tempOffset.currentTop > $.maxBottom) ||
      (this.tempIndex < 0 && this.tempOffset.currentTop < $.maxTop)
    );
  }

  private isOutPosition($: Threshold) {
    this.isOutPositionHorizontally = false;

    if (this.isOutThresholdH($)) {
      this.isOutPositionHorizontally = true;

      return true;
    }

    if (this.isOutPositionV($)) {
      return true;
    }

    return false;
  }

  private isOutContainer($: Threshold) {
    this.isOutSiblingsHorizontally = false;

    if (this.isOutContainerV($)) {
      this.isOutSiblingsHorizontally = true;

      return true;
    }

    if (this.isOutThresholdH($)) {
      return true;
    }

    return false;
  }

  /**
   * Checks if dragged it out of its position or parent.
   *
   * @param siblingsK -
   */
  isOutThreshold(siblingsK?: string) {
    const { siblings, dragged } = this.thresholds;

    return siblingsK
      ? this.isOutContainer(siblings[siblingsK])
      : this.isOutPosition(dragged);
  }

  /**
   * Checks if dragged is the first child and going up.
   */
  isLeavingFromTop() {
    return (
      this.isFirstOrOutside() &&
      !this.isOutSiblingsHorizontally &&
      !this.isMovingDown
    );
  }

  /**
   * Checks if dragged is the last child and going down.
   */
  isLeavingFromBottom() {
    const { sK } = store.getElmById(this.draggedElm.id).keys;

    return (
      this.isLastELm() &&
      this.isMovingDown &&
      this.isOutContainerV(this.thresholds.siblings[sK])
    );
  }

  isNotSettled() {
    const { sK } = store.getElmById(this.draggedElm.id).keys;

    return (
      this.siblingsList !== null &&
      !this.isLeavingFromBottom() &&
      (this.isOutThreshold() || this.isOutThreshold(sK))
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

  hasMoved() {
    return (
      this.draggedElm.translateX !== this.tempTranslate.x ||
      this.draggedElm.translateY !== this.tempTranslate.y
    );
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
      this.numberOfElementsTransformed === 0 ||
      this.isNotSettled()
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

      if (this.hasMoved()) {
        this.draggedElm.transformElm();

        if (this.siblingsList) {
          this.draggedElm.assignNewPosition(
            this.siblingsList,
            this.draggedElm.order.self
          );
        }
      }
      return;
    }

    this.draggedElm.currentTop = this.occupiedOffset.currentTop;
    console.log(
      "file: Draggable.ts ~ line 310 ~ this.draggedElm.currentTop",
      this.draggedElm.currentTop
    );
    this.draggedElm.currentLeft = this.occupiedOffset.currentLeft;

    this.draggedElm.translateX = this.occupiedTranslate.translateX;
    this.draggedElm.translateY = this.occupiedTranslate.translateY;
    console.log(
      "file: Draggable.ts ~ line 347 ~ this.draggedElm.translateY",
      this.draggedElm.translateY
    );

    this.draggedElm.transformElm();

    console.log("tempIndex", this.tempIndex);

    if (this.siblingsList) {
      this.draggedElm.assignNewPosition(this.siblingsList, this.tempIndex);
    }

    this.draggedElm.order.self = this.tempIndex;
    console.log(
      "file: Draggable.ts ~ line 313 ~ this.draggedElm.order",
      this.tempIndex,
      this.draggedElm.order
    );

    // const draggedDirection =
    // this.tempIndex < this.draggedElm.order.self ? -1 : 1;

    // this.numberOfElementsTransformed = Math.abs(
    //   this.numberOfElementsTransformed
    // );

    // /**
    //  * Move to new droppable position.
    //  *
    //  * We already have translate value in for dragged in goX/goY but it is
    //  * related to mouse dragging. Instead, we want to translate to droppable
    //  * element that is replaced by dragged.
    //  */
    // this.draggedElm.setYPosition(
    //   this.siblingsList,
    //   draggedDirection,
    //   this.numberOfElementsTransformed * topDifference,
    //   this.operationID,
    //   this.numberOfElementsTransformed,
    //   false
    // );
  }

  /**
   * @param topDifference -
   */
  endDragging(topDifference: number) {
    this.setDragged(false);

    this.setDraggedPosition(topDifference);

    // store.getElmSiblingsById()
  }
}

export default Draggable;
