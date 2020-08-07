import { DRAGGED_ELM } from "@dflex/draggable/constants.json";

import store from "../DnDStore";
import Droppable from "./Droppable";
import { ACTIVE_PARENT } from "../../constants.json";

class EndDroppable extends Droppable {
  undoElmTranslate(lst, i) {
    const elmID = lst[i];

    if (elmID) {
      const element = store.getElmById(elmID);

      console.log(this.draggable.numberOfElementsTransformed);
      if (this.draggable.numberOfElementsTransformed >= 0) {
        const rollNum = element.prevTranslateY.length > 1 ? 2 : 1;
        console.log("EndDroppable -> undoElmTranslate -> rollNum", rollNum);

        for (let j = 0; j < rollNum; j += 1) {
          /**
           * Note: rolling back won't affect order array. It only deals with element
           * itself and totally ignore any instance related to store.
           */
          element.rollYBack();
        }
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
    console.log("EndDroppable -> undoList -> lst", lst);
    const {
      order: { self: from },
      id: draggedID,
    } = this.draggable[DRAGGED_ELM];

    if (this.draggable.isMovingDown) {
      for (let i = from; i < lst.length; i += 1) {
        // if (this.draggable.numberOfElementsTransformed === 0) break;

        this.undoElmTranslate(lst, i);
      }
    } else {
      /**
       * If from is zero, means dragged left, and all siblings are lifted up.
       */
      const actualFrom = from === 0 ? lst.length - 1 : from;
      console.log("EndDroppable -> undoList -> actualFrom", actualFrom);

      for (let i = actualFrom; i >= 0; i -= 1) {
        // if (this.draggable.numberOfElementsTransformed === 0) break;

        this.undoElmTranslate(lst, i);
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
