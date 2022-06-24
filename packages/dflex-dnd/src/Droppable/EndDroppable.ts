/* eslint-disable no-param-reassign */
import { store } from "../DnDStore";
import Droppable, { isIDEligible } from "./Droppable";

import type { IDraggableInteractive } from "../Draggable";

class EndDroppable extends Droppable {
  private spliceAt: number;

  constructor(draggable: IDraggableInteractive) {
    super(draggable);
    this.spliceAt = -1;
  }

  private isIDEligible2Undo(id: string) {
    return (
      isIDEligible(id, this.draggable.draggedElm.id) &&
      !store.registry.get(id)!.isPaused
    );
  }

  private undoElmTranslate(
    lst: string[],
    operationID: string,
    i: number,
    prevVisibility: boolean,
    listVisibility: boolean
  ) {
    const elmID = lst[i];

    if (this.isIDEligible2Undo(elmID)) {
      const element = store.registry.get(elmID)!;

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
      element.rollBack(operationID, listVisibility);

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

  private loopAscWithAnimationFrame(
    from: number,
    lst: string[],
    operationID: string
  ) {
    let i = from;

    let prevVisibility = false;
    let listVisibility = true;

    const run = () => {
      ({ prevVisibility, listVisibility } = this.undoElmTranslate(
        lst,
        operationID,
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

  private loopDesWithAnimationFrame(
    from: number,
    lst: string[],
    operationID: string
  ) {
    let i = from;

    let prevVisibility = false;
    let listVisibility = true;

    const run = () => {
      ({ prevVisibility, listVisibility } = this.undoElmTranslate(
        lst,
        operationID,
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
  private undoList(lst: string[], operationID: string) {
    const {
      threshold,
      draggedElm: {
        id,
        order: { self: from },
      },
    } = this.draggable;

    if (this.isParentLocked || threshold.isOut[id].isLeftFromBottom) {
      this.loopAscWithAnimationFrame(from, lst, operationID);
    } else {
      /**
       * If from is zero, means dragged left, and all siblings are lifted up.
       */
      const actualFrom = from === 0 ? lst.length - 1 : from;
      this.loopDesWithAnimationFrame(actualFrom, lst, operationID);
    }
  }

  private verify(lst: string[]) {
    const { occupiedPosition, draggedElm } = this.draggable;

    const { top } = store.containers.get(draggedElm.keys.SK)!.boundaries;

    const id = lst[0];

    if (id.length === 0 || draggedElm.id === id) {
      return Math.floor(top) === Math.floor(occupiedPosition.y);
    }

    const element = store.registry.get(id)!;

    return Math.floor(top) === Math.floor(element.currentPosition.y);
  }

  endDragging() {
    const siblings = store.getElmBranchByKey(
      this.draggable.migration.latest().SK
    );

    let isFallback = false;

    if (this.draggable.isNotSettled() || !this.verify(siblings)) {
      isFallback = true;

      this.draggable.migration.getALlMigrations().forEach((migration) => {
        const lst = store.getElmBranchByKey(migration.SK);

        this.undoList(lst, migration.id);
      });
    }

    store.onStateChange(isFallback ? "dragCancel" : "dragEnd");

    this.draggable.endDragging(isFallback);

    [
      "elmTransition",
      "draggedOffset",
      "draggedAccumulatedTransition",
      "siblingsEmptyElmIndex",
      "initialScroll",
      "scrollAxes",
    ].forEach((instance) => {
      // @ts-expect-error
      this[instance] = null;
    });
  }
}

export default EndDroppable;
