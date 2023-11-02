/* eslint-disable no-param-reassign */
import { AbstractDFlexCycle, featureFlags } from "@dflex/utils";
import { scheduler, store } from "../LayoutManager";
import DFlexMechanismController, {
  isIDEligible,
} from "./DFlexMechanismController";

import { DFLEX_EVENTS, emitDragCommittedEvent } from "../Events";

import { LAYOUT_STATES, notifyLayoutStateListeners } from "../Listeners";

const {
  DRAG_EVENT: { ON_COMMITTED, ON_TRANSFORMED },
} = DFLEX_EVENTS;

const { DRAG_CANCEL, DRAG_END } = LAYOUT_STATES;

class EndCycle extends DFlexMechanismController {
  private _undoSiblingsPositions(
    siblings: string[],
    cycle: AbstractDFlexCycle,
  ): void {
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

  private _isCanceled(): boolean {
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

    return isFallback;
  }

  private _composeDragMutationEvent(
    hasToReconcile: boolean,
  ): (() => void) | undefined {
    const { events, draggedElm } = this.draggable;

    let dispatchDragMutationEvent;

    if (events) {
      const { migration } = store;
      const latestCycle = migration.latest();

      const { index: inserted, SK } = latestCycle;
      const { SK: originSK } = migration.getAll()[0];

      const {
        VDOMOrder: { self: initial },
        id,
      } = draggedElm;

      dispatchDragMutationEvent = () => {
        // Use it instead of draggedElm because the dragged might be a mirror.
        const element = store.interactiveDOM.get(id)!;

        const target = store.getParentBySK(SK)!;
        const origin = store.getParentBySK(originSK)!;

        const indexes = {
          initial,
          inserted,
        };

        const containers = {
          origin,
          target,
        };

        emitDragCommittedEvent(
          events,
          hasToReconcile ? ON_COMMITTED : ON_TRANSFORMED,
          {
            element,
            indexes,
            containers,
          },
        );
      };
    }

    return dispatchDragMutationEvent;
  }

  endDragging(): void {
    const { enableCommit, session } = this.draggable;
    const { migration, listeners } = store;
    const latestCycle = migration.latest();

    const sessionCycles = migration.filter(session, true);

    const isFallback = this._isCanceled();

    const cleanup = (willReconcile: boolean) => {
      this.draggable.cleanup(isFallback, latestCycle, willReconcile);
      migration.isActive = false;
    };

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
            cleanup(false);

            migration.flush(session);

            if (listeners) {
              notifyLayoutStateListeners(listeners, DRAG_CANCEL);
            }
          },
        },
      );

      return;
    }

    // If length is zero, means it's original and no need to migrate.
    const isMigratedInScroll =
      latestCycle.hasScroll && sessionCycles.length > 1;

    const { enableAfterEndingDrag } = enableCommit;

    const hasToReconcile = enableAfterEndingDrag || isMigratedInScroll;

    const dispatchDragMutationEvent =
      this._composeDragMutationEvent(hasToReconcile);

    scheduler(
      store,
      () => cleanup(hasToReconcile),
      listeners
        ? {
            onUpdate: () => {
              notifyLayoutStateListeners(listeners, DRAG_END);
            },
          }
        : null,
    );

    if (hasToReconcile) {
      store.commit();
    }

    if (dispatchDragMutationEvent) {
      dispatchDragMutationEvent();
    }
  }
}

export default EndCycle;
