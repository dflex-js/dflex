/* eslint-disable no-nested-ternary */
import { DRAGGED_ELM } from "@dflex/draggable/constants.json";
import Base from "./Base";

class Draggable extends Base {
  constructor(elementInstance, clickCoordinates) {
    super(elementInstance, clickCoordinates);

    const { x, y } = clickCoordinates;

    this.innerOffsetX = x - this[DRAGGED_ELM].currentLeft;
    this.innerOffsetY = y - this[DRAGGED_ELM].currentTop;

    this.tempOffset = {
      currentLeft: 0,
      currentTop: 0,
    };

    /**
     * previous X and Y are used to calculate mouse directions.
     */
    this.prevX = x;
    this.prevY = y;

    /**
     * It counts number of element that dragged has passed. This counter is
     * crucial to calculate drag's translate and index
     */
    this.numberOfElementsTransformed = 0;
    this.inc = 1;

    this.isMovingDownPrev = null;
    this.isMovingDown = false;
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
   * @memberof Draggable
   */
  dragAt(x, y) {
    this.translate(x, y);

    /**
     * Every time we got new translate, offset should be updated
     */
    this.tempOffset.currentLeft = x - this.innerOffsetX;
    this.tempOffset.currentTop = y - this.innerOffsetY;
  }

  isOutH($) {
    return (
      this.tempOffset.currentLeft < $.maxLeft ||
      this.tempOffset.currentLeft > $.maxRight
    );
  }

  isOutV($) {
    return (
      this.tempOffset.currentTop < $.maxTop ||
      this.tempOffset.currentTop > $.maxBottom
    );
  }

  /**
   * Checks if dragged it out of its position or parent.
   *
   * @param {this|this.parentThreshold[currentIndex]} $
   * @returns {boolean} isOut
   * @memberof Draggable
   */
  isDraggedOut(id) {
    const { parents, dragged } = this.thresholds;

    const $ = id ? parents[id] : dragged;

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
   *
   * @returns {boolean}
   * @memberof Draggable
   */
  isDraggedLeavingFromTop() {
    return this.tempIndex <= 0 && !this.isMovingDown;
  }

  /**
   * Checks if dragged is the last child and going down.
   *
   * @returns {boolean}
   * @memberof Draggable
   */
  isDraggedLeavingFromEnd() {
    return this.tempIndex >= this.siblingsList.length - 1 && this.isMovingDown;
  }

  isDraggedVerticallyInsideList() {
    return (
      !this.isOutHorizontal &&
      !this.isSingleton &&
      !this.isDraggedLeavingFromTop() &&
      !this.isDraggedLeavingFromEnd()
    );
  }

  toggleElementsTransformedInc() {
    this.inc *= -1;
  }

  resetElementsTransformedInc() {
    this.inc = 1;
  }

  setDraggedMovingDown(y) {
    this.isMovingDown = this.isOutHorizontal ? true : y > this.prevY;
    this.prevY = y;

    if (
      this.numberOfElementsTransformed > 0 &&
      this.isMovingDownPrev !== this.isMovingDown
    ) {
      /**
       * In this case, we have a sudden change in mouse movement. So, reverse
       * numberOfElementsTransformed value, to be compatible with effectedElemDirection.
       */
      this.toggleElementsTransformedInc();
    }

    this.isMovingDownPrev = this.isMovingDown;
  }

  incNumOfElementsTransformed() {
    if (this.numberOfElementsTransformed === 0) {
      this.resetElementsTransformedInc();
    }

    this.numberOfElementsTransformed += this.inc;

    console.log(
      "is this.numberOfElementsTransformed",
      this.numberOfElementsTransformed
    );
  }

  setDraggedPosition(topDifference) {
    /**
     * In this case, the use clicked without making any move.
     */
    if (
      (!this.isDraggedLeavingFromEnd() && this.isDraggedOut()) ||
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
      const { translateX, translateY } = this[DRAGGED_ELM];

      this.draggedStyle.transform = `translate(${translateX}px,${translateY}px)`;

      return;
    }

    this[DRAGGED_ELM].setCurrentOffset();

    const draggedDirection =
      this.tempIndex < this[DRAGGED_ELM].order.self ? -1 : 1;

    /**
     * Move to new droppable position.
     *
     * We already have translate value in for dragged in goX/goY but it is
     * related to mouse dragging. Instead, we want to translate to droppable
     * element that is replaced by dragged.
     */
    this[DRAGGED_ELM].setYPosition(
      this.siblingsList,
      draggedDirection,
      this.numberOfElementsTransformed * topDifference,
      this.numberOfElementsTransformed,
      false,
      this.dragID
    );
  }

  endDragging(topDifference) {
    this.setDragged(false);

    this.setDraggedPosition(topDifference);
  }
}

export default Draggable;
