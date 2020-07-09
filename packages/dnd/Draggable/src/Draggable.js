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

    /**
     * Elements effected by dragged direction.
     */
    this.elemDirection = 1;

    this.isMovingDownPrev = false;
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

    const isOut =
      this.tempOffset.currentLeft < $.maxLeft ||
      this.tempOffset.currentLeft > $.maxRight ||
      this.tempOffset.currentTop < $.maxTop ||
      this.tempOffset.currentTop > $.maxBottom;

    return isOut;
  }

  /**
   * Checks if dragged is last element in parent list.
   *
   * @returns {boolean}
   * @memberof Draggable
   */
  isDraggedLastElm() {
    return this.isSingleton || this.tempIndex === this.siblingsList.length - 1;
  }

  /**
   * Checks if dragged is first element in parent list.
   *
   * @returns {boolean}
   * @memberof Draggable
   */
  isDraggedFirstElm() {
    return this.isSingleton || this.tempIndex === 0;
  }

  /**
   * Checks if dragged movement has any effect on it's siblings.
   *
   * @returns {boolean}
   * @memberof Draggable
   */
  isDraggedHasNoEffect() {
    return this.isDraggedLastElm() && this.isMovingDown;
  }

  /**
   * Checks if dragged all siblings should be lifted
   *
   * @returns {boolean}
   * @memberof Draggable
   */
  isLeftAllSiblings() {
    const isLeftAll = this.isDraggedFirstElm() && !this.isMovingDown;

    if (isLeftAll) {
      this.elemDirection = -1;
    }

    return isLeftAll;
  }

  /**
   * Checks if dragged is moving down and updates element direction sign (+/-).
   *
   * @returns {boolean}
   * @memberof Draggable
   */
  updateDraggedDirectionFlags(y) {
    this.isMovingDown = y > this.prevY;

    if (this.isMovingDownPrev !== this.isMovingDown) {
      /**
       * In this case, we have a sudden change in mouse movement. So, reverse
       * numberOfElementsTransformed value, to be compatible with elemDirection.
       */
      this.numberOfElementsTransformed *= -1;
    }

    /**
     * If dragged is going top, element will decrease. So:
     * Down: -1, up: 1. Unless, dragged is leaving the list.
     */
    this.elemDirection = this.isMovingDown ? -1 : 1;

    this.prevY = y;
    this.isMovingDownPrev = this.isMovingDown;
  }

  setDraggedPosition(isFoundBreakingPoint, topDifference) {
    if (!isFoundBreakingPoint) {
      /**
       * If not isFoundBreakingPoint, it means dragged is out its position, inside
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

    /**
     * Move to new droppable position.
     *
     * We already have translate value in for dragged in goX/goY but it is
     * related to mouse dragging. Instead, we want to translate to droppable
     * element that is replaced by dragged.
     */
    this[DRAGGED_ELM].setYPosition(
      this.siblingsList,
      -this.elemDirection /** dragged goes to opposite side */,
      this.numberOfElementsTransformed * topDifference,
      this.numberOfElementsTransformed,
      false
    );
  }

  endDragging(isFoundBreakingPoint, topDifference) {
    this.setDragged(false);

    this[DRAGGED_ELM].setCurrentOffset();

    this.setDraggedPosition(isFoundBreakingPoint, topDifference);
  }
}

export default Draggable;
