import { DRAGGED_ELM } from "@dflex/draggable/constants.json";

import store from "../DnDStore";
import Droppable from "./Droppable";

class EndDroppable extends Droppable {
  /**
   * Gets the current statues of dragged siblings. If it's called before ending
   * dragged then `null` is expected in the dragged index. Otherwise, it returns
   * all element in order.
   *
   * @return {Array|string}
   * @memberof EndDroppable
   */
  getStatus() {
    const {
      keys: { sK },
    } = store.getElmById(this.draggable[DRAGGED_ELM].id);

    const siblings = store.getElmBranchByKey(sK);

    return siblings;
  }

  undoElmTranslate(lst, i) {
    const elmID = lst[i];

    if (elmID) {
      const element = store.getElmById(elmID);

      /**
       * Note: rolling back won't affect order array. It only deals with element
       * itself and totally ignore any instance related to store.
       */
      element.rollYBack(this.draggable.dragID);
      this.draggable.numberOfElementsTransformed -= 1;
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

    if (this.isListLocked || this.draggable.isMovingDown) {
      for (let i = from; i < lst.length; i += 1) {
        this.undoElmTranslate(lst, i);
      }
    } else {
      /**
       * If from is zero, means dragged left, and all siblings are lifted up.
       */
      const actualFrom = from === 0 ? lst.length - 1 : from;

      for (let i = actualFrom; i >= 0; i -= 1) {
        this.undoElmTranslate(lst, i);
      }
    }

    lst.splice(this.spliceAt, 1);
    lst.splice(from, 0, draggedID);
  }

  endDragging() {
    this.draggable.endDragging(this.topDifference);

    // TODO: Add tests to cover dragged whiteout parents
    if (!this.draggable.isSingleton && this.draggable.isSiblingsTransformed()) {
      const siblings = this.getStatus();
      this.undoList(siblings);
    }
  }
}

export default EndDroppable;
