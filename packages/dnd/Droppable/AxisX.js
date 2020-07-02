import { DRAGGED_ELM } from "@dflex/draggable/constants.json";

import store from "../Store";
import Draggable from "../Draggable";

/**
 * Class includes all transformation methods related to droppable.
 *
 * @class AxisX
 * @extends {Draggable}
 */
class AxisX extends Draggable {
  /**
   * Inits all parents threshold. This should be called once only.
   *
   * @param {Array} parents - Contains ids of parents in order.
   * @memberof AxisX
   */
  initParentsThreshold(parentsList) {
    for (let i = 0; i < parentsList.length; i += 1) {
      const id = parentsList[i];
      const coreInstance = store.getElmById(id);

      if (!this.thresholds.parents[id]) {
        this.setThreshold(coreInstance, true);
      }
    }
  }

  /**
   * Loops in parents layout to find where the dragged is so we can assign new
   * ACTIVE_PARENT.
   *
   * TODO: what if dragged is orphan?
   *
   * @returns {CoreInstance|null} parent if found.
   * @memberof AxisX
   */
  getDraggedNearestParent() {
    if (!this.isParentsThreshold) {
      this.initParentsThreshold(this.parentsList);

      this.isParentsThreshold = true;
    }

    let parent = null;

    for (let i = 0; i < this.parentsList.length; i += 1) {
      const id = this.parentsList[i];

      const isOut = this.isDraggedOut(id);

      if (!isOut) {
        parent = store.getElmById(id);

        break;
      }
    }

    return parent;
  }

  /**
   * Checker method. Compares the dragged offset with element offset and returns
   * true if element is matched.
   *
   * @param {number} elmCurrentOffsetTop - element vertical offset (offsetTop)
   * @returns {boolean} - true if isElemUnderDragged
   * @memberof AxisX
   */
  isElemUnderDragged(elmCurrentOffsetTop) {
    console.log("%c inside isElemUnderDragged", "background: red");

    /**
     * Element is Switchable when it's under dragged.
     */
    return elmCurrentOffsetTop >= this.currentTop;
  }

  insertElement() {
    console.log("%c inside insertElement", "background: red");

    return;

    /**
     * Loop to figure out where dragged is.
     */
    // eslint-disable-next-line no-unreachable
    for (let i = 0; i < this.siblingsList.length; i += 1) {
      const id = this.siblingsList[i];

      const element = store.getElmById(id);

      const { currentTop } = element;

      const isQualified = this.isElemUnderDragged(currentTop);
      console.log("TCL: isQualified", id, isQualified, i);

      if (isQualified) {
        this.droppableIndex = i;

        break;
      }
    }

    if (typeof this.droppableIndex !== "number") return;

    /**
     * If we've got a valid position, then loop backwards. Last element should
     * transform down first then the element before last and so on until we
     * reach to the droppableIndex.
     */

    const from = this.siblingsList.length - 1;

    for (let i = from; i >= this.droppableIndex; i -= 1) {
      const id = this.siblingsList[i];
      console.log("inside moving down", i, id);

      const element = store.getElmById(id);

      if (i === this.droppableIndex) {
        this.setThreshold(element);
      }

      /**
       * Note:
       *
       * elemDirection is 1. Elements should go down.
       * topDifference: is already calculated when dragged was going out form
       * parent.
       */
      element.setYPosition(this.siblingsList, 1, this.topDifference);
    }

    this.draggedTempIndex = this.droppableIndex;

    this.numberOfElementsTransformed =
      this.droppableIndex - this[DRAGGED_ELM].indexes.self;
    // this.droppableIndex = null;
  }
}

export default AxisX;
