import { DRAGGED_ELM } from "@dflex/draggable/constants.json";
import store from "@dflex/dnd-store";

import Droppable from "./Droppable";
import { ACTIVE_PARENT } from "../../constants.json";

function move(arr, from, to) {
  arr.splice(to, 0, arr.splice(from, 1)[0]);
}

class EndDroppable extends Droppable {
  /**
   * Undo list elements order and instances including translateX/Y and indexes
   * locally.
   *
   * @param {Array} lst - Array of ids.
   * @memberof EndDroppable
   */
  undoList(lst, travel = 1) {
    for (let i = 0; i < travel; i += 1) {
      const { from, to, id } = this.movingMap[i];

      const element = store.getElmById(id);
      element.rollYBack();

      move(lst, to, from);
    }
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
