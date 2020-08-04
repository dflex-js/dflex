import { DRAGGED_ELM } from "@dflex/draggable/constants.json";

import store from "../DnDStore";
import Droppable from "./Droppable";
import { ACTIVE_PARENT } from "../../constants.json";

class EndDroppable extends Droppable {
  undoElm(lst, i) {
    const elmID = lst[i];

    if (elmID) {
      const element = store.getElmById(elmID);

      if (this.draggable.numberOfElementsTransformed > 0) {
        /**
         * Note: rolling back won't affect order array. It only deals with element
         * itself and totally ignore any instance related to store.
         */
        element.rollYBack();
        this.draggable.numberOfElementsTransformed -= 1;
      }
    } else {
      this.spliceAt = i;
    }
  }

  /**
   * Undo list elements order and instances including translateX/Y and indexes
   * locally.
   *
   * @param {Array} lst - Array of ids.
   * @memberof EndDroppable
   */
  undoList(lst) {
    const {
      order: { self: from },
      id: draggedID,
    } = this.draggable[DRAGGED_ELM];

    if (this.draggable.isMovingDown) {
      for (let i = from; i < lst.length; i += 1) {
        // if (this.draggable.numberOfElementsTransformed === 0) break;

        this.undoElm(lst, i);
      }
    } else {
      for (let i = from; i > 0; i -= 1) {
        // if (this.draggable.numberOfElementsTransformed === 0) break;

        this.undoElm(lst, i);
      }
    }

    lst.splice(this.spliceAt, 1);
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
