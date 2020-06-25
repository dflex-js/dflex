import { DRAGGED_ELM } from "@dflex/draggable/constants.json";

import store from "../Store";
import Droppable from "./Droppable";

class DroppableUndo extends Droppable {
  /**
   * Restores the dragged element to its position. Why not calling
   * setYPosition as rest of elements in undoParents? Because
   * dragging instances in tem and not updated in Store.
   *
   * @memberof DroppableUndo
   */
  resettleDragged() {
    /**
     * Restore dragged position (translateX, translateY) directly. Why? Because,
     * dragged depends on extra instance to float in layout that is not related to element
     * instance.
     */
    const { translateX, translateY } = this[DRAGGED_ELM];

    this.draggedStyle.transform = `translate(${translateX}px,${translateY}px)`;
  }

  /**
   * Undo list elements order and instances including translateX/Y and indexes
   * locally.
   *
   * @param {Array} lst - Array of ids.
   * @memberof DroppableUndo
   */
  undoList(lst) {
    const {
      indexes: { self: from },
      id,
    } = this[DRAGGED_ELM];

    for (let i = from; i < lst.length; i += 1) {
      const id = lst[i];

      const element = store.getElmById(id);

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
    lst.splice(from, 0, id);
  }

  /**
   * Loop inside all transformed parents and call their children to be undone.
   *
   * @memberof DroppableUndo
   */
  undoTransformedParents() {
    this.setOfTransformedIds.forEach((id) => {
      const {
        keys: { chK },
      } = store.getElmById(id);
      console.log("DroppableUndo -> undoTransformedParents -> store", store);

      /**
       * Get parent's children.
       */
      const children = store.getElmBranch(chK);
      console.log(
        "DroppableUndo -> undoTransformedParents -> children",
        children
      );

      this.undoList(children);
    });

    /**
     * End of the operation.
     */
    this.setOfTransformedIds.clear();
  }
}

export default DroppableUndo;
