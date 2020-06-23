/* eslint-disable no-underscore-dangle */

import { DRAGGED_ELM } from "@dflex/draggable/constants.json";
import Base from "../Base";

class Draggable extends Base {
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
  setDraggedTempCurrentOffset(x, y) {
    /**
     * Each time we got new translate, offset should be updated
     */
    const {
      offset: { top, left, width, height },
    } = this[DRAGGED_ELM];

    /**
     * Calculates the new offset
     */
    const _left = left + x;
    const _top = top + y;

    /**
     * Note, this instance can't be replaced with offset.
     * By adding translate to offset, with each move will double the
     * increase:
     *
     * Suppose top = 100 and translateY = 20 the result is 120.
     * But what'll happen to next move translateY = 20 the result is 120 + 20 = 140.
     *
     * To solve this issue, we keep the offset and returns the new value with
     * increase as 100 + 20 or 100 + 40.
     *
     * Also, you can always call currentOffset and get the right value since
     * it's updated with each translate value.
     */
    this.currentLeft = _left;
    this.currentRight = _left + width;
    this.currentTop = _top;
    this.currentBottom = _top + height;
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
      this.currentLeft < $.maxLeft ||
      this.currentRight > $.maxRight ||
      this.currentTop < $.maxTop ||
      this.currentBottom > $.maxBottom;

    return isOut;
  }

  /**
   * Checks if dragged is last element is parent list.
   *
   * @returns {boolean}
   * @memberof Draggable
   */
  isDraggedLastElm() {
    return this.draggedTempIndex === this.siblingsList.length - 1;
  }
}

export default Draggable;
