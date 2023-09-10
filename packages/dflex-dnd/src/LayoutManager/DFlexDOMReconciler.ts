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
  container: DFlexParentContainer,
) {
  store.linkElmToContainerGrid(container, dflexElm);

  setTimeout(() => {
    if (didThrowError) {
      return;
    }

    if (
      elmIndex !== dflexElm.DOMOrder.self ||
      dflexElm.DOMOrder.self !== dflexElm.VDOMOrder.self
    ) {
      didThrowError = true;

      console.error(
        `Error in DOM order reconciliation.\n id: ${dflexElm.id}. Expected DOM order: ${dflexElm.DOMOrder.self} to match VDOM order: ${dflexElm.VDOMOrder.self}`,
      );
    }

    if (
      !containerDOM.children[elmIndex].isSameNode(
        store.interactiveDOM.get(elmID)!,
      )
    ) {
      didThrowError = true;

      console.error(
        "Error in DOM order reconciliation at Index: ",
        elmIndex,
        "Container: ",
        containerDOM,
      );
      console.error("Actually DOM tree has: ", containerDOM.children[elmIndex]);
      console.error("While DFlex Store has: ", store.interactiveDOM.get(elmID));
    }

    // dflexElm._initIndicators(store.interactiveDOM.get(elmID)!);
    if (featureFlags.enablePositionAssertion) {
      assertElmPos(store.interactiveDOM.get(elmID)!, dflexElm.rect);
    }
  }, 0);
}

type ScrollPosTuple = [number, number];

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
}

function commitElm(
  branchIDs: Readonly<Siblings>,
  branchDOM: HTMLElement,
  store: DFlexDnDStore,
  elmID: string,
  scrollTuple: ScrollPosTuple,
): boolean {
  const elmWithDOm = store.getElmWithDOM(elmID);

  const [dflexElm, elmDOM] = elmWithDOm;

  const hasTransformedFromOrigin = dflexElm.hasTransformedFromOrigin();

  if (hasTransformedFromOrigin) {
    const needsReconciliation =
      dflexElm.needDOMReconciliation() ||
      // Until the element owns its transformation between containers history we
      // can't rely only on the local indicators as it only reflects the
      // elements movement inside the origin container.
      store.migration.filter([dflexElm.id], false);

    if (needsReconciliation) {
      switchElmDOMPosition(branchIDs, branchDOM, store, dflexElm, elmDOM);
    }

    const [scrollTop, scrollLeft] = scrollTuple;

    dflexElm.refreshIndicators(elmDOM, scrollTop, scrollLeft);

    return true;
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
 * @param dflexContainer - The parent DFlexParentContainer.
 * @param scroll - The DFlexScrollContainer.
 * @param refreshAllSibling - When true, all elements in the reconciled sibling group
 * will update their Rect regardless of their transformation status.
 * @returns An array of tuples containing the reconciled elements and their corresponding DOM elements.
 */
function DFlexDOMReconciler(
  siblingsIDs: Readonly<Siblings>,
  containerDOM: HTMLElement,
  store: DFlexDnDStore,
  dflexContainer: DFlexParentContainer,
  scroll: DFlexScrollContainer,
  refreshAllSibling: boolean,
): ReconciledElementIDs {
  const {
    totalScrollRect: { left, top },
  } = scroll;

  const scrollTuple: ScrollPosTuple = [top, left];

  dflexContainer.resetIndicators(siblingsIDs.length);

  const reconciledElementIDs: ReconciledElementIDs = new Set();

  for (let i = siblingsIDs.length - 1; i >= 0; i -= 1) {
    const elmID = siblingsIDs[i];

    const hasReconciled = commitElm(
      siblingsIDs,
      containerDOM,
      store,
      elmID,
      scrollTuple,
    );

    if (hasReconciled) {
      reconciledElementIDs.add(elmID);
    }
  }

  const isUpdateElmGrid = !refreshAllSibling;

  if (refreshAllSibling) {
    for (let i = 0; i <= siblingsIDs.length - 1; i += 1) {
      const elmID = siblingsIDs[i];

      const [dflexElm, elmDOM] = store.getElmWithDOM(siblingsIDs[i]);

      if (!reconciledElementIDs.has(elmID)) {
        dflexElm.refreshIndicators(elmDOM, left, top);
      }

      if (__DEV__) {
        setElmGridAndAssertPosition(
          siblingsIDs[i],
          dflexElm,
          i,
          containerDOM,
          store,
          dflexContainer,
        );
      } else {
        store.linkElmToContainerGrid(dflexContainer, dflexElm);
      }
    }
  }

  if (isUpdateElmGrid) {
    for (let i = 0; i <= siblingsIDs.length - 1; i += 1) {
      const elmID = siblingsIDs[i];

      const dflexElm = store.registry.get(elmID)!;

      if (__DEV__) {
        setElmGridAndAssertPosition(
          siblingsIDs[i],
          dflexElm,
          i,
          containerDOM,
          store,
          dflexContainer,
        );
      } else {
        store.linkElmToContainerGrid(dflexContainer, dflexElm);
      }
    }
  }

  return reconciledElementIDs;
}

export default DFlexDOMReconciler;
