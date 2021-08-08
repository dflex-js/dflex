/**
 * Copyright (c) Jalal Maskoun.
 *
 * This source code is licensed under the AGPL3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
/* eslint-disable  */
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

  private isIDEligible2Undo(id: string) {
    return this.isIDEligible(id) && !store.registry[id].isPaused;
  }

  /**
   *
   * @param lst -
   * @param i -
   */
  private undoElmTranslate(
    lst: ELmBranch,
    i: number,
    prevVisibility: boolean,
    listVisibility: boolean
  ) {
    const elmID = lst[i];

    if (this.isIDEligible2Undo(elmID)) {
      const element = store.registry[elmID];

      const { isVisible } = element;

      if (i === 0) {
        // Init prev visibility flag.
        prevVisibility = isVisible;
      }

      if (prevVisibility !== isVisible) {
        listVisibility = isVisible;
      }

      /**
       * Note: rolling back won't affect order array. It only deals with element
       * itself and totally ignore any instance related to store.
       */
      element.rollYBack(this.draggable.operationID, listVisibility);

      this.draggable.numberOfElementsTransformed -= 1;

      prevVisibility = isVisible;
    } else {
      this.spliceAt = i;
    }

    return { prevVisibility, listVisibility };
  }

  // spliceList(from: number, lst: string[]) {
  //   lst.splice(this.spliceAt, 1);
  //   lst.splice(from, 0, this.draggable.draggedElm.id);
  // }

  private loopAscWithAnimationFrame(
    from: number,
    lst: string[],
    cb: (i: number) => void
  ) {
    let i = from;

    let prevVisibility = false;
    let listVisibility = true;

    const run = () => {
      ({ prevVisibility, listVisibility } = this.undoElmTranslate(
        lst,
        i,
        prevVisibility,
        listVisibility
      ));
      i += 1;

      if (i < lst.length) {
        requestAnimationFrame(run);
      } else {
        cb(from);
      }
    };

    requestAnimationFrame(run);
  }

  private loopDesWithAnimationFrame(
    from: number,
    lst: string[],
    cb: (i: number) => void
  ) {
    let i = from;

    let prevVisibility = false;
    let listVisibility = true;

    const run = () => {
      ({ prevVisibility, listVisibility } = this.undoElmTranslate(
        lst,
        i,
        prevVisibility,
        listVisibility
      ));
      i -= 1;

      if (i >= 0) {
        requestAnimationFrame(run);
      } else {
        cb(from);
      }
    };

    requestAnimationFrame(run);
  }

  /**
   * Undo list elements order and instances including translateX/Y and indexes
   * locally.
   */
  private undoList(lst: string[], cb: (i: number) => void) {
    const {
      order: { self: from },
    } = this.draggable.draggedElm;

    if (this.isListLocked || this.draggable.isMovingDown) {
      this.loopAscWithAnimationFrame(from, lst, cb);
    } else {
      /**
       * If from is zero, means dragged left, and all siblings are lifted up.
       */
      const actualFrom = from === 0 ? lst.length - 1 : from;
      this.loopDesWithAnimationFrame(actualFrom, lst, cb);
    }
  }

  private verify(lst: string[]) {
    const siblingsBoundaries =
      store.siblingsBoundaries[
        store.registry[this.draggable.draggedElm.id].keys.sK
      ];

    const id = lst[0];

    if (id.length === 0 || this.draggable.draggedElm.id === id) {
      return (
        Math.floor(siblingsBoundaries.top) ===
        Math.floor(this.draggable.occupiedOffset.currentTop)
      );
    }

    const element = store.registry[id];

    return (
      Math.floor(siblingsBoundaries.top) === Math.floor(element.currentTop!)
    );
  }

  endDragging() {
    const siblings = store.getElmSiblingsListById(this.draggable.draggedElm.id);

    if (siblings) {
      if (this.draggable.isNotSettled() || !this.verify(siblings)) {
        this.draggable.endDragging(true);

        this.undoList(siblings, (from) => {});

        return;
      }
    }

    this.draggable.endDragging(false);
  }
}

export default EndDroppable;
