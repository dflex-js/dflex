import { DRAGGED_ELM } from "@dflex/draggable/constants.json";
import Base from "../../Base";

class Draggable extends Base {
  constructor(elementId, clickCoordinates) {
    super(elementId, clickCoordinates);

    this.innerXOffset = clickCoordinates.x - this[DRAGGED_ELM].currentLeft;
    this.innerYOffset = clickCoordinates.y - this[DRAGGED_ELM].currentTop;
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
    super.dragAt(x, y);

    /**
     * Every time we got new translate, offset should be updated
     */
    this.currentLeft = x - this.innerXOffset;
    this.currentTop = y - this.innerYOffset;
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
      this.currentLeft > $.maxRight ||
      this.currentTop < $.maxTop ||
      this.currentTop > $.maxBottom;

    return isOut;
  }

  /**
   * Checks if dragged is last element is parent list.
   *
   * @returns {boolean}
   * @memberof Draggable
   */
  isDraggedLastElm() {
    return (
      this.isSingleton || this.draggedTempIndex === this.siblingsList.length - 1
    );
  }

  endDragging() {
    super.endDragging();
    this[DRAGGED_ELM].setCurrentOffset();
  }
}

export default Draggable;
