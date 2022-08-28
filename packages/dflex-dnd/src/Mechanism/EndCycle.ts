/* eslint-disable no-param-reassign */
import { featureFlags } from "@dflex/utils";
import { scheduler, store } from "../LayoutManager";
import DFlexMechanismController, {
  isIDEligible,
} from "./DFlexMechanismController";

class EndCycle extends DFlexMechanismController {
  private _undoSiblingsPositions(siblings: string[], cycleID: string) {
    const {
      threshold,
      migration,
      draggedElm: {
        id: draggedID,
        VDOMOrder: { self: from },
      },
    } = this.draggable;

    const { index: tempIndex } = migration.latest();

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
    const { migration, enableCommit } = this.draggable;

    const {
      SK: activeSK,
      cycleID,
      hasScroll,
      numberOfTransformedELm,
    } = migration.latest();

    const activeSiblings = store.getElmBranchByKey(activeSK);

    let isFallback = false;

    if (this.isScrolling()) {
      isFallback = true;

      this.cancelAndThrottleScrolling(store.scrolls.get(activeSK)!);

      this._undoSiblingsPositions(activeSiblings, cycleID);
    } else {
      const all = migration.getALlMigrations();

      isFallback =
        this.draggable.isNotSettled() ||
        !(all.length > 1 || numberOfTransformedELm > 0);

      if (isFallback) {
        all.forEach((_) => {
          const siblings = store.getElmBranchByKey(_.SK);
          this._undoSiblingsPositions(siblings, _.cycleID);
        });
      }
    }

    // If length is zero, means it's original and no need to migrate.
    const isMigratedInScroll =
      !isFallback && hasScroll && migration.getALlMigrations().length > 1;

    scheduler(
      store,
      () => this.draggable.cleanup(isFallback, isMigratedInScroll),
      null,
      {
        layoutState: isFallback ? "dragCancel" : "dragEnd",
        type: "layoutState",
      }
    );

    // Nothing to reconcile.
    if (isFallback) {
      if (__DEV__) {
        if (featureFlags.enableCommit) {
          // eslint-disable-next-line no-console
          console.warn("No changes detected to reconcile.");
        }
      }
      return;
    }

    if (__DEV__) {
      if (featureFlags.enableCommit) {
        migration.getALlMigrations().forEach((_) => {
          store.reconcileBranch(_.SK);
        });

        return;
      }
    }

    const { enableAfterEndingDrag, enableForScrollOnly } = enableCommit;

    if ((isMigratedInScroll && enableForScrollOnly) || enableAfterEndingDrag) {
      migration.getALlMigrations().forEach((_) => {
        store.reconcileBranch(_.SK);
      });
    }
  }
}

export default EndCycle;
