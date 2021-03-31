import type { ELmBranch } from "@dflex/dom-gen";

import store from "../DnDStore";
import type { DraggableDnDInterface } from "../Draggable";

import Droppable from "./Droppable";

class EndDroppable extends Droppable {
  private spliceAt: number;

  constructor(draggable: DraggableDnDInterface) {
    super(draggable);
    this.spliceAt = -1;
  }

  /**
   *
   */
  getSiblings() {
    const {
      keys: { sK },
    } = store.getElmById(this.draggable.draggedElm.id);

    const siblings = store.getElmBranchByKey(sK);

    return siblings;
  }

  /**
   *
   * @param lst -
   * @param i -
   */
  private undoElmTranslate(lst: ELmBranch, i: number) {
    const elmID = lst[i];

    if (elmID) {
      const element = store.getElmById(elmID);

      /**
       * Note: rolling back won't affect order array. It only deals with element
       * itself and totally ignore any instance related to store.
       */
      element.rollYBack(this.draggable.operationID);
      this.draggable.numberOfElementsTransformed -= 1;
    } else {
      this.spliceAt = i;
    }
  }

  /**
   * Undo list elements order and instances including translateX/Y and indexes
   * locally.
   */
  private undoList(lst: Array<string>) {
    const {
      order: { self: from },
      id: draggedID,
    } = this.draggable.draggedElm;

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
    // TODO: Add tests to cover dragged whiteout parents
    if (
      !this.draggable.siblingsList !== null &&
      this.draggable.isSiblingsTransformed()
    ) {
      const siblings = this.getSiblings();

      if (Array.isArray(siblings)) this.undoList(siblings);
    }

    this.draggable.endDragging(this.draggedYSpace);
  }
}

export default EndDroppable;
