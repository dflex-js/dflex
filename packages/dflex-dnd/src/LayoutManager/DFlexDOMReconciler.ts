/* eslint-disable no-console */
import type { DFlexElement } from "@dflex/core-instance";
import type { Siblings } from "@dflex/dom-gen";
import { featureFlags } from "@dflex/utils";
import type DFlexDnDStore from "./DFlexDnDStore";

function switchElmDOMPosition(
  branchIDs: Readonly<Siblings>,
  branchDOM: HTMLElement,
  store: DFlexDnDStore,
  dflexElm: DFlexElement,
  elmDOM: HTMLElement,
) {
  const { self: VDOMIndex } = dflexElm.VDOMOrder;
  const { self: DOMIndex } = dflexElm.DOMOrder;

  const isLatElm = VDOMIndex + 1 === branchIDs.length;

  if (isLatElm) {
    branchDOM.appendChild(elmDOM);
  } else {
    const PevDOMElm = store.interactiveDOM.get(branchIDs[VDOMIndex + 1])!;

    branchDOM.insertBefore(elmDOM, PevDOMElm);
  }

  const shiftDirection = VDOMIndex > DOMIndex ? 1 : -1;

  for (let i = VDOMIndex - 1; i >= DOMIndex; i -= 1) {
    const dflexNextElm = store.registry.get(branchIDs[i])!;

    dflexNextElm.DOMOrder.self += shiftDirection;
  }

  dflexElm.DOMOrder.self = VDOMIndex;

  if (__DEV__) {
    if (featureFlags.enableReconcileDebugger) {
      console.log(`${dflexElm.id} is reconciled`);
    }
  }
}

function commitElm(
  branchIDs: Readonly<Siblings>,
  branchDOM: HTMLElement,
  store: DFlexDnDStore,
  elmID: string,
): boolean {
  const elmWithDOm = store.getElmWithDOM(elmID);

  const [dflexElm, elmDOM] = elmWithDOm;

  const needsReconciliation = dflexElm.hasTransformedFromOrigin();

  if (needsReconciliation) {
    if (__DEV__) {
      if (featureFlags.enableReconcileDebugger) {
        console.log(`${dflexElm.id} requires reconciliation.`);
      }
    }

    switchElmDOMPosition(branchIDs, branchDOM, store, dflexElm, elmDOM);

    dflexElm.refreshIndicators(elmDOM);

    return true;
  }

  if (__DEV__) {
    if (featureFlags.enableReconcileDebugger) {
      console.log(`Ignoring: ${dflexElm.id}`);
    }
  }

  return false;
}

type ReconciledElementIDs = Set<string>;

/**
 * Reconciles the DOM elements in a sibling group.
 *
 * @param siblingIDs - An array of IDs representing the elements in the sibling group.
 * @param containerDOM - The DOM element of the sibling group container.
 * @param store - The DFlexDnDStore instance.
 * @param cb - The callback function.
 * @returns An array of tuples containing the reconciled elements and their corresponding DOM elements.
 */
function DFlexDOMReconciler(
  siblingsIDs: Readonly<Siblings>,
  containerDOM: HTMLElement,
  SK: string,
  store: DFlexDnDStore,
): void {
  const reconciledElementIDs: ReconciledElementIDs = new Set();

  for (let i = siblingsIDs.length - 1; i >= 0; i -= 1) {
    const elmID = siblingsIDs[i];

    const hasReconciled = commitElm(siblingsIDs, containerDOM, store, elmID);

    if (hasReconciled) {
      reconciledElementIDs.add(elmID);
    }
  }

  store.migration.updateReconciledIDs(SK, reconciledElementIDs);

  if (__DEV__) {
    if (featureFlags.enableReconcileDebugger) {
      if (reconciledElementIDs.size === 0) {
        console.warn("Elements are in their positions. Nothing to commit");
      }
    }
  }
}

export default DFlexDOMReconciler;
