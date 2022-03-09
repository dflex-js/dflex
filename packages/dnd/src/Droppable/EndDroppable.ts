/* eslint-disable no-param-reassign */
import type { ELmBranch } from "@dflex/dom-gen";

import store from "../DnDStore";
import Droppable, { isIDEligible } from "./Droppable";

import type { DraggableDnDInterface } from "../Draggable";

class EndDroppable extends Droppable {
  private spliceAt: number;

  constructor(draggable: DraggableDnDInterface) {
    super(draggable);
    this.spliceAt = -1;
  }

  private isIDEligible2Undo(id: string) {
    return (
      isIDEligible(id, this.draggable.draggedElm.id) &&
      !store.registry[id].isPaused
    );
  }

  /**
   *
   * @param lst -
   * @param i -
   */
  private undoElmTranslate(
    lst: Exclude<ELmBranch, null>,
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
      element.rollBack(this.draggable.operationID, listVisibility, this.axes);

      // This will decrease the number by 1.
      this.draggable.updateNumOfElementsTransformed(1);

      prevVisibility = isVisible;
    } else {
      this.spliceAt = i;
    }

    return { prevVisibility, listVisibility };
  }

  private insertDragged(from: number, lst: string[]) {
    lst.splice(this.spliceAt, 1);
    lst.splice(from, 0, this.draggable.draggedElm.id);
  }

  private loopAscWithAnimationFrame(from: number, lst: string[]) {
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
        // requestAnimationFrame(run);
        run();
      }
    };

    // requestAnimationFrame(run);
    run();

    this.insertDragged(from, lst);
  }

  private loopDesWithAnimationFrame(from: number, lst: string[]) {
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
        // requestAnimationFrame(run);
        run();
      }
    };

    // requestAnimationFrame(run);
    run();

    this.insertDragged(from, lst);
  }

  /**
   * Undo list elements order and instances including translateX/Y and indexes
   * locally.
   */
  private undoList(lst: string[]) {
    const {
      order: { self: from },
    } = this.draggable.draggedElm;

    if (
      this.draggable.isOutActiveSiblingsContainer ||
      this.draggable.isMovingDown
    ) {
      this.loopAscWithAnimationFrame(from, lst);
    } else {
      /**
       * If from is zero, means dragged left, and all siblings are lifted up.
       */
      const actualFrom = from === 0 ? lst.length - 1 : from;
      this.loopDesWithAnimationFrame(actualFrom, lst);
    }
  }

  private verify(lst: string[]) {
    const { top } =
      store.siblingsBoundaries[
        store.registry[this.draggable.draggedElm.id].keys.SK
      ];

    const id = lst[0];

    if (id.length === 0 || this.draggable.draggedElm.id === id) {
      return Math.floor(top) === Math.floor(this.draggable.occupiedOffset.y);
    }

    const element = store.registry[id];

    return Math.floor(top) === Math.floor(element.currentPosition.y);
  }

  endDragging() {
    const siblings = store.getElmSiblingsListById(this.draggable.draggedElm.id);

    let isFallback = false;

    if (siblings) {
      if (this.draggable.isNotSettled() || !this.verify(siblings)) {
        isFallback = true;

        this.undoList(siblings);
      }

      store.onStateChange(isFallback ? "dragCancel" : "dragEnd");
    }

    this.draggable.endDragging(isFallback);
  }
}

export default EndDroppable;
