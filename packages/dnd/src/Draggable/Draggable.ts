/**
 * Copyright (c) Jalal Maskoun.
 *
 * This source code is licensed under the AGPL3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { MouseCoordinates } from "@dflex/draggable";

import store from "../DnDStore";

import Base from "./Base";

import type {
  DraggableDnDInterface,
  TempOffset,
  Threshold,
  TempTranslate,
  Restrictions,
} from "./types";

import type { FinalDndOpts } from "../types";

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

  private restrictions: Restrictions;

  constructor(
    id: string,
    initCoordinates: MouseCoordinates,
    opts: FinalDndOpts
  ) {
    const { restrictions, ...rest } = opts;

    super(id, initCoordinates, rest);

    const { x, y } = initCoordinates;

    this.innerOffsetX = x - this.draggedElm.currentLeft!;
    this.innerOffsetY = y - this.draggedElm.currentTop!;

    this.tempOffset = {
      currentLeft: this.draggedElm.currentLeft!,
      currentTop: this.draggedElm.currentTop!,
    };

    this.occupiedOffset = {
      currentLeft: this.draggedElm.currentLeft!,
      currentTop: this.draggedElm.currentTop!,
    };

    this.occupiedTranslate = {
      translateX: this.draggedElm.translateX!,
      translateY: this.draggedElm.translateY!,
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

    this.restrictions = restrictions;

    const siblings = store.getElmSiblingsListById(this.draggedElm.id);

    this.axesFilterNeeded =
      siblings !== null &&
      (!restrictions.allowLeavingFromLeft ||
        !restrictions.allowLeavingFromRight ||
        !restrictions.allowLeavingFromTop ||
        !restrictions.allowLeavingFromBottom);
  }

  private getLastElmIndex() {
    const siblings = store.getElmSiblingsListById(this.draggedElm.id);

    return siblings!.length - 1;
  }

  private isFirstOrOutside() {
    const siblings = store.getElmSiblingsListById(this.draggedElm.id);

    return siblings !== null && this.tempIndex <= 0;
  }

  private isLastELm() {
    return this.tempIndex === this.getLastElmIndex();
  }

  private axesRightFilter(x: number, minRight: number) {
    return x - this.innerOffsetX + this.draggedElm.offset!.width >= minRight
      ? -this.outerOffsetX
      : x;
  }

  private axesLeftFilter(x: number, maxLeft: number) {
    return x - this.innerOffsetX <= maxLeft ? -this.outerOffsetX : x;
  }

  private containerHorizontalAxesFilter(x: number) {
    const { maxLeft, minRight } =
      store.siblingsBoundaries[store.registry[this.draggedElm.id].keys.sK];

    const fx = this.restrictions.allowLeavingFromLeft
      ? this.restrictions.allowLeavingFromRight
        ? x
        : this.axesRightFilter(x, minRight)
      : this.axesLeftFilter(x, maxLeft);

    return this.restrictions.allowLeavingFromRight
      ? fx
      : this.axesRightFilter(fx, minRight);
  }

  private axesBottomFilter(y: number, bottom: number) {
    return (this.tempIndex < 0 || this.isLastELm()) &&
      y - this.innerOffsetY + this.draggedElm.offset!.height >= bottom
      ? bottom + this.innerOffsetY - this.draggedElm.offset!.height
      : y;
  }

  private axesTopFilter(y: number, maxTop: number) {
    return this.tempIndex <= 0 && y - this.innerOffsetY <= maxTop
      ? maxTop + this.innerOffsetY
      : y;
  }

  private containerVerticalAxesFilter(y: number) {
    const { top, bottom } =
      store.siblingsBoundaries[store.registry[this.draggedElm.id].keys.sK];

    const fy = this.restrictions.allowLeavingFromTop
      ? this.restrictions.allowLeavingFromBottom
        ? y
        : this.axesBottomFilter(y, bottom)
      : this.axesTopFilter(y, top);

    return this.restrictions.allowLeavingFromBottom
      ? fy
      : this.axesBottomFilter(fy, bottom);
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
      filteredX = this.containerHorizontalAxesFilter(x);
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
    const { sK } = store.registry[this.draggedElm.id].keys;

    return (
      this.isLastELm() &&
      this.isMovingDown &&
      this.isOutContainerV(this.thresholds.siblings[sK])
    );
  }

  isNotSettled() {
    const siblings = store.getElmSiblingsListById(this.draggedElm.id);
    const { sK } = store.registry[this.draggedElm.id].keys;

    return (
      siblings !== null &&
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

  setDraggedPosition(isFallback: boolean) {
    const siblings = store.getElmSiblingsListById(this.draggedElm.id);

    /**
     * In this case, the use clicked without making any move.
     */
    if (
      isFallback ||
      siblings === null ||
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

      if (this.hasMoved()) {
        this.draggedElm.transformElm();
        this.draggedElm.updateDataset(this.draggedElm.order.self);

        /**
         * There's a rare case where dragged leaves and returns to the same
         * position. In this case, undo won't be triggered so that we have to do
         * it manually here. Otherwise, undoing will handle repositioning. I
         * don't like it but it is what it is.
         */
        if (
          siblings &&
          siblings[this.draggedElm.order.self] !== this.draggedElm.id
        ) {
          this.draggedElm.assignNewPosition(
            siblings,
            this.draggedElm.order.self
          );
        }
      }

      return;
    }

    this.draggedElm.currentTop = this.occupiedOffset.currentTop;
    this.draggedElm.currentLeft = this.occupiedOffset.currentLeft;

    this.draggedElm.translateX = this.occupiedTranslate.translateX;
    this.draggedElm.translateY = this.occupiedTranslate.translateY;

    this.draggedElm.transformElm();

    if (siblings) {
      this.draggedElm.assignNewPosition(siblings, this.tempIndex);
    }

    this.draggedElm.order.self = this.tempIndex;
  }

  endDragging(isFallback: boolean) {
    this.setDragged(false);

    this.setDraggedPosition(isFallback);
  }
}

export default Draggable;
