/* eslint-disable no-console */
import type {
  DFlexElement,
  DFlexParentContainer,
  DFlexScrollContainer,
} from "@dflex/core-instance";
import type { Siblings } from "@dflex/dom-gen";
import { assertElmPos, featureFlags } from "@dflex/utils";
import type DFlexDnDStore from "./DFlexDnDStore";

let didThrowError = false;

function setElmGridAndAssertPosition(
  elmID: string,
  dflexElm: DFlexElement,
  elmIndex: number,
  containerDOM: HTMLElement,
  store: DFlexDnDStore,
  container: DFlexParentContainer
) {
  store.setElmGridBridge(container, dflexElm);

  setTimeout(() => {
    if (didThrowError) {
      return;
    }

    if (
      elmIndex !== dflexElm._DOMOrder.self ||
      dflexElm._DOMOrder.self !== dflexElm._VDOMOrder.self
    ) {
      didThrowError = true;

      console.error(
        `Error in DOM order reconciliation.\n id: ${dflexElm._id}. Expected DOM order: ${dflexElm._DOMOrder.self} to match VDOM order: ${dflexElm._VDOMOrder.self}`
      );
    }

    if (
      !containerDOM.children[elmIndex].isSameNode(
        store._interactiveDOM.get(elmID)!
      )
    ) {
      didThrowError = true;

      console.error(
        "Error in DOM order reconciliation at Index: ",
        elmIndex,
        "Container: ",
        containerDOM
      );
      console.error("Actually DOM tree has: ", containerDOM.children[elmIndex]);
      console.error(
        "While DFlex Store has: ",
        store._interactiveDOM.get(elmID)
      );
    }

    // dflexElm._initIndicators(store.interactiveDOM.get(elmID)!);
    if (featureFlags.enablePositionAssertion) {
      assertElmPos(store._interactiveDOM.get(elmID)!, dflexElm.rect);
    }
  }, 0);
}

function switchElmDOMPosition(
  branchIDs: Readonly<Siblings>,
  branchDOM: HTMLElement,
  store: DFlexDnDStore,
  dflexElm: DFlexElement,
  elmDOM: HTMLElement
) {
  const VDOMIndex = dflexElm._VDOMOrder.self;
  const DOMIndex = dflexElm._DOMOrder.self;

  // Is it the last element?
  if (VDOMIndex + 1 === branchIDs.length) {
    branchDOM.appendChild(elmDOM);
  } else {
    const PevElmDOM = store._interactiveDOM.get(branchIDs[VDOMIndex + 1])!;

    branchDOM.insertBefore(elmDOM, PevElmDOM);
  }

  const shiftDirection = VDOMIndex > DOMIndex ? 1 : -1;

  for (let i = VDOMIndex - 1; i >= DOMIndex; i -= 1) {
    const dflexNextElm = store._registry.get(branchIDs[i])!;

    dflexNextElm._DOMOrder.self += shiftDirection;
  }

  dflexElm._DOMOrder.self = VDOMIndex;
}

let reconciledElmQueue: [DFlexElement, HTMLElement][] = [];

function commitElm(
  branchIDs: Readonly<Siblings>,
  branchDOM: HTMLElement,
  store: DFlexDnDStore,
  elmID: string
): void {
  const [dflexElm, elmDOM] = store.getDOMbyElmID(elmID);

  if (dflexElm._hasTransformedFromOrigin()) {
    if (
      dflexElm._needDOMReconciliation() ||
      // Until the element owns its transformation between containers history we
      // can't rely only on the local indicators as it only reflects the
      // elements movement inside the origin container.
      store.migration._filter([dflexElm._id], false)
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
  branchIDs: Readonly<Siblings>,
  branchDOM: HTMLElement,
  store: DFlexDnDStore,
  container: DFlexParentContainer,
  scroll: DFlexScrollContainer,
  refreshAllBranchElements: boolean
): void {
  container._resetIndicators(branchIDs.length);

  for (let i = branchIDs.length - 1; i >= 0; i -= 1) {
    commitElm(branchIDs, branchDOM, store, branchIDs[i]);
  }

  let isUpdateElmGrid = true;

  const {
    _totalScrollRect: { left, top },
  } = scroll;

  if (refreshAllBranchElements) {
    isUpdateElmGrid = false;
    reconciledElmQueue = [];

    for (let i = 0; i <= branchIDs.length - 1; i += 1) {
      const [dflexElm, elmDOM] = store.getDOMbyElmID(branchIDs[i]);

      dflexElm._refreshIndicators(elmDOM, left, top);

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

      dflexElm._refreshIndicators(elmDOM, left, top);
    }
  }

  if (isUpdateElmGrid) {
    for (let i = 0; i <= branchIDs.length - 1; i += 1) {
      const dflexElm = store._registry.get(branchIDs[i])!;

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
