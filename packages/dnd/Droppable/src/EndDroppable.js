import { DRAGGED_ELM } from "@dflex/draggable/constants.json";
import store from "@dflex/dnd-store";

import Droppable from "./Droppable";
import { ACTIVE_PARENT } from "../../constants.json";

class EndDroppable extends Droppable {
  /**
   * Undo list elements order and instances including translateX/Y and indexes
   * locally.
   *
   * @param {Array} lst - Array of ids.
   * @memberof EndDroppable
   */
  undoList(lst) {
    console.log("EndDroppable -> undoList -> lst", lst);
    const {
      order: { self: from },
      id: draggedID,
    } = this.draggable[DRAGGED_ELM];

    for (let i = from; i < lst.length; i += 1) {
      const elmID = lst[i];

      const element = store.getElmById(elmID);

      /**
       * Note: rolling back won't affect order array. It only deals with element
       * itself and totally ignore any instance related to store.
       */
      element.rollYBack();
    }

    /**
     * Add dragged is to its original position.
     *
     * Note: if elements have transformed, this means dragged also done the
     * same. That's why both are connected here.
     */
    lst.splice(from, 0, draggedID);
  }

  endDragging() {
    this.draggable.endDragging(this.isDraggedOutPosition, this.topDifference);

    if (this.isDraggedOutPosition) {
      const {
        keys: { chK },
      } = store.getElmById(this.draggable[ACTIVE_PARENT].id);

      /**
       * Get parent's children.
       */
      const children = store.getElmBranchByKey(chK);

      this.undoList(children);
    }
  }
}

export default EndDroppable;
