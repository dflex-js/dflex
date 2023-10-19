/* eslint-disable no-param-reassign */
import { AbstractDFlexCycle, featureFlags } from "@dflex/utils";

import { scheduler, store } from "../LayoutManager";

import DFlexMechanismController, {
  isIDEligible,
} from "./DFlexMechanismController";

import { DFLEX_EVENTS, createDragCommittedPayload } from "../Events";

const {
  DRAG_EVENT: { ON_COMMITTED, ON_TRANSFORMED },
} = DFLEX_EVENTS;

class EndCycle extends DFlexMechanismController {
  private _undoSiblingsPositions(
    siblings: string[],
    cycle: AbstractDFlexCycle,
  ) {
    const {
      threshold,
      draggedElm: {
        id: draggedID,
        VDOMOrder: { self: from },
      },
    } = this.draggable;

    const { index: tempIndex, cycleID } = cycle;

    const isElmLiftedUp =
      this.isParentLocked || threshold.isOut[draggedID].bottom;

    const to = isElmLiftedUp ? from : 0;

    if (__DEV__) {
      if (featureFlags.enableUndoSiblingsDebugger) {
        // eslint-disable-next-line no-console
        console.info(`Undo will start from: ${siblings.length} to: ${to}`);
      }
    }

    for (let i = siblings.length - 1; i >= 0; i -= 1) {
      const elmID = siblings[i];

      if (isIDEligible(elmID, draggedID)) {
        const [dflexElm, DOM] = store.getElmWithDOM(elmID);

        /**
         * Note: rolling back won't affect order array. It only deals with element
         * itself and totally ignore any instance related to store.
         */
        dflexElm.rollBackPosition(DOM, cycleID);
      }
    }

    const spliceAt =
      this.isParentLocked || threshold.isOut[draggedID].bottom
        ? siblings.length - 1
        : tempIndex;

    siblings.splice(spliceAt, 1);
    siblings.splice(from, 0, draggedID);

    if (__DEV__) {
      if (featureFlags.enableUndoSiblingsDebugger) {
        // eslint-disable-next-line no-console
        console.info("Siblings", siblings);
      }
    }
  }

  endDragging() {
    const { enableCommit, session, events, draggedElm } = this.draggable;
    const { migration } = store;
    const latestCycle = migration.latest();

    const sessionCycles = migration.filter(session, true);

    let isFallback = false;

    if (this.hasActiveScrolling()) {
      isFallback = true;

      if (__DEV__) {
        if (this.cancelScrolling === null) {
          throw new Error(
            "Failed to initiate fallback scrolling. The 'cancelScrolling' function must be available when 'hasActiveScrolling' is true.\n" +
              "Please check for any changes that may have affected the 'hasActiveScrolling' condition and ensure that:\n" +
              "- 'cancelScrolling' is properly implemented,\n" +
              "- 'cancelScrolling' is assigned and not null.",
          );
        }
      }

      this.cancelScrolling!();
    } else {
      isFallback = this.hasBeenScrolling || this.draggable.isNotSettled();
    }

    // If it's falling back then we won't trigger reconciliation.
    if (isFallback) {
      scheduler(
        store,
        () => {
          sessionCycles.forEach((_) => {
            const siblings = store.getElmSiblingsByKey(_.SK);
            this._undoSiblingsPositions(siblings, _);
          });
        },
        {
          onUpdate: () => {
            this.draggable.cleanup(true, latestCycle, false);
            migration.flush(session);
          },
        },
        {
          type: "layoutState",
          status: "dragCancel",
        },
      );

      return;
    }

    // If length is zero, means it's original and no need to migrate.
    const isMigratedInScroll =
      latestCycle.hasScroll && sessionCycles.length > 1;

    const { enableAfterEndingDrag } = enableCommit;

    const hasToReconcile = enableAfterEndingDrag || isMigratedInScroll;

    let onUpdate;

    if (events) {
      const { index: inserted, SK } = latestCycle;
      const { SK: originSK } = migration.getAll()[0];

      const {
        VDOMOrder: { self: initial },
        id,
      } = draggedElm;

      onUpdate = () => {
        const element = store.interactiveDOM.get(id)!;
        const container = store.containers.get(SK)!;
        const target = store.interactiveDOM.get(container.id)!;

        const originContainer = store.containers.get(originSK)!;
        const origin = store.interactiveDOM.get(originContainer.id)!;

        const indexes = {
          initial,
          inserted,
        };

        const containers = {
          origin,
          target,
        };

        events.dispatch(
          hasToReconcile ? ON_COMMITTED : ON_TRANSFORMED,
          createDragCommittedPayload({
            element,
            indexes,
            containers,
          }),
        );

        events.cleanup();
      };
    }

    scheduler(
      store,
      () => this.draggable.cleanup(isFallback, latestCycle, hasToReconcile),
      hasToReconcile ? null : { onUpdate },
      {
        type: "layoutState",
        status: "dragEnd",
      },
    );

    if (__DEV__) {
      if (featureFlags.enableCommit) {
        store.commit(onUpdate);

        return;
      }
    }

    if (hasToReconcile) {
      store.commit(onUpdate);
    }
  }
}

export default EndCycle;
