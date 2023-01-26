import type { DFlexElement, DFlexParentContainer } from "@dflex/core-instance";
import type { ELmBranch } from "@dflex/dom-gen";
import { assertElementPosition, featureFlags } from "@dflex/utils";
import type DFlexDnDStore from "./DFlexDnDStore";

function setElmGridAndAssertPosition(
  elmID: string,
  dflexElm: DFlexElement,
  elmIndex: number,
  branchDOM: HTMLElement,
  store: DFlexDnDStore,
  container: DFlexParentContainer
) {
  store.setElmGridBridge(container, dflexElm);

  if (
    elmIndex !== dflexElm.DOMOrder.self ||
    dflexElm.DOMOrder.self !== dflexElm.VDOMOrder.self
  ) {
    // eslint-disable-next-line no-console
    console.error(
      `Error in DOM order reconciliation.\n id: ${dflexElm.id}. Expected DOM order: ${dflexElm.DOMOrder.self} to match VDOM order: ${dflexElm.VDOMOrder.self}`
    );
  }

  if (
    !branchDOM.children[elmIndex].isSameNode(store.interactiveDOM.get(elmID)!)
  ) {
    // eslint-disable-next-line no-console
    console.error(
      `Error in DOM order reconciliation.\n. ${
        branchDOM.children[elmIndex]
      } doesn't match ${store.interactiveDOM.get(elmID)!}`
    );
  }

  // dflexElm._initIndicators(store.interactiveDOM.get(elmID)!);
  if (featureFlags.enablePositionAssertion) {
    assertElementPosition(store.interactiveDOM.get(elmID)!, dflexElm.rect);
  }
}

function switchElmDOMPosition(
  branchIDs: Readonly<ELmBranch>,
  branchDOM: HTMLElement,
  store: DFlexDnDStore,
  dflexElm: DFlexElement,
  elmDOM: HTMLElement
) {
  const VDOMIndex = dflexElm.VDOMOrder.self;
  const DOMIndex = dflexElm.DOMOrder.self;

  // Is it the last element?
  if (VDOMIndex + 1 === branchIDs.length) {
    branchDOM.appendChild(elmDOM);
  } else {
    const PevElmDOM = store.interactiveDOM.get(branchIDs[VDOMIndex + 1])!;

    branchDOM.insertBefore(elmDOM, PevElmDOM);
  }

  const shiftDirection = VDOMIndex > DOMIndex ? 1 : -1;

  for (let i = VDOMIndex - 1; i >= DOMIndex; i -= 1) {
    const dflexNextElm = store.registry.get(branchIDs[i])!;

    dflexNextElm.DOMOrder.self += shiftDirection;
  }

  dflexElm.DOMOrder.self = VDOMIndex;
}

let reconciledElmQueue: [DFlexElement, HTMLElement][] = [];

function commitElm(
  branchIDs: Readonly<ELmBranch>,
  branchDOM: HTMLElement,
  store: DFlexDnDStore,
  elmID: string
): void {
  const [dflexElm, elmDOM] = store.getElmWithDOM(elmID);

  if (dflexElm.hasTransformedFromOrigin()) {
    if (
      dflexElm.needReconciliation() ||
      // Until the element owns its transformation between containers history we
      // can't rely only on the local indicators as it only reflects the
      // elements movement inside the origin container.
      store.migration.filter([dflexElm.id], false)
    ) {
      switchElmDOMPosition(branchIDs, branchDOM, store, dflexElm, elmDOM);
    }

    reconciledElmQueue.push([dflexElm, elmDOM]);
  }
}

/**
 *
 * @param branchIDs
 * @param branchDOM
 * @param store
 * @param container
 * @param refreshAllBranchElements - When true, all element in the reconciled
 * brach will update their Rect regardless of their transformation status.
 * @returns
 */
function DFlexDOMReconciler(
  branchIDs: Readonly<ELmBranch>,
  branchDOM: HTMLElement,
  store: DFlexDnDStore,
  container: DFlexParentContainer,
  refreshAllBranchElements: boolean
): void {
  container.resetIndicators(branchIDs.length);

  for (let i = branchIDs.length - 1; i >= 0; i -= 1) {
    commitElm(branchIDs, branchDOM, store, branchIDs[i]);
  }

  let isUpdateElmGrid = true;

  if (refreshAllBranchElements) {
    isUpdateElmGrid = false;
    reconciledElmQueue = [];

    for (let i = 0; i <= branchIDs.length - 1; i += 1) {
      const [dflexElm, elmDOM] = store.getElmWithDOM(branchIDs[i]);

      dflexElm.refreshIndicators(elmDOM);

      if (__DEV__) {
        setElmGridAndAssertPosition(
          branchIDs[i],
          dflexElm,
          i,
          branchDOM,
          store,
          container
        );
      } else {
        store.setElmGridBridge(container, dflexElm);
      }
    }
  } else {
    while (reconciledElmQueue.length) {
      const [dflexElm, elmDOM] = reconciledElmQueue.pop()!;

      dflexElm.refreshIndicators(elmDOM);
    }
  }

  if (isUpdateElmGrid) {
    for (let i = 0; i <= branchIDs.length - 1; i += 1) {
      const dflexElm = store.registry.get(branchIDs[i])!;

      if (__DEV__) {
        setElmGridAndAssertPosition(
          branchIDs[i],
          dflexElm,
          i,
          branchDOM,
          store,
          container
        );
      } else {
        store.setElmGridBridge(container, dflexElm);
      }
    }
  }
}

export default DFlexDOMReconciler;
