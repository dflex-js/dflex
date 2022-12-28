/* eslint-disable no-param-reassign */
import { AbstractDFlexCycle, featureFlags } from "@dflex/utils";
import { scheduler, store } from "../LayoutManager";
import DFlexMechanismController, {
  isIDEligible,
} from "./DFlexMechanismController";

class EndCycle extends DFlexMechanismController {
  private _undoSiblingsPositions(
    siblings: string[],
    cycle: AbstractDFlexCycle
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
        dflexElm.rollBack(DOM, cycleID);
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
    const { enableCommit, session } = this.draggable;
    const { migration } = store;
    const latestCycle = migration.latest();

    const sessionCycles = migration.filter(session, true);

    let isFallback = false;

    if (this.isScrolling()) {
      isFallback = true;
      this.cancelAndThrottleScrolling(store.scrolls.get(latestCycle.SK)!);
    } else {
      isFallback = this.draggable.isNotSettled();
    }

    if (isFallback) {
      scheduler(
        store,
        () => {
          sessionCycles.forEach((_) => {
            const siblings = store.getElmBranchByKey(_.SK);
            this._undoSiblingsPositions(siblings, _);
          });
        },
        {
          onUpdate: () => {
            this.draggable.cleanup(true, false, latestCycle);
            migration.flush(session);
            store.isTransforming = false;
          },
        },
        {
          type: "layoutState",
          status: "dragCancel",
        }
      );

      return;
    }

    // If length is zero, means it's original and no need to migrate.
    const isMigratedInScroll =
      latestCycle.hasScroll && sessionCycles.length > 1;

    const { enableAfterEndingDrag, enableForScrollOnly } = enableCommit;

    const hasToReconcile =
      (isMigratedInScroll && enableForScrollOnly) || enableAfterEndingDrag;

    scheduler(
      store,
      () => this.draggable.cleanup(isFallback, isMigratedInScroll, latestCycle),
      null,
      {
        type: "layoutState",
        status: "dragEnd",
      }
    );

    if (__DEV__) {
      if (featureFlags.enableCommit) {
        store.commit();

        return;
      }
    }

    if (hasToReconcile) {
      store.commit();
    }

    // TODO.
    // Of course this is not ideal. Because all the mutation and reconciliation
    // will happen asynchronously so this mean `isTransforming` will be false
    // while it still actually transforming.
    // Not a big deal since we don't depend on it directly when to check if it's
    // available or not. But it should be fixed though.
    store.isTransforming = false;
  }
}

export default EndCycle;
