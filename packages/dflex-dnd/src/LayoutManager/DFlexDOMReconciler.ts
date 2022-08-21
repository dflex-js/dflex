import type { DFlexNode, DFlexParentContainer } from "@dflex/core-instance";
import type { ELmBranch } from "@dflex/dom-gen";
import type DFlexDnDStore from "./DFlexDnDStore";

function prependElm(
  branchIDs: ELmBranch,
  branchDOM: HTMLElement,
  store: DFlexDnDStore,
  elmIndex: number,
  elmDOM: HTMLElement
): void {
  branchDOM.prepend(elmDOM);

  for (let i = elmIndex + 1; i < branchIDs.length; i += 1) {
    const dflexNextElm = store.registry.get(branchIDs[i])!;

    if (dflexNextElm.hasTransformed()) {
      dflexNextElm.DOMOrder.self += 1;
    }
  }
}

function switchElmUp(
  branchIDs: ELmBranch,
  branchDOM: HTMLElement,
  store: DFlexDnDStore,
  elmIndex: number,
  elmDOM: HTMLElement
) {
  const [dflexNextElm, domNextElm] = store.getElmWithDOM(
    branchIDs[elmIndex + 1]
  )!;

  branchDOM.insertBefore(elmDOM, domNextElm);

  if (dflexNextElm.hasTransformed()) {
    dflexNextElm.DOMOrder.self += 1;
  }
}

function updateELmGrid(container: DFlexParentContainer, dflexElm: DFlexNode) {
  container.registerNewElm(dflexElm.rect);
  dflexElm.DOMGrid.clone(container.grid);
}

function commitElm(
  branchIDs: ELmBranch,
  branchDOM: HTMLElement,
  store: DFlexDnDStore,
  container: DFlexParentContainer,
  elmID: string,
  elmIndex: number
): boolean {
  const [dflexElm, elmDOM] = store.getElmWithDOM(elmID);

  const isBreak = false;

  if (dflexElm.hasTransformed()) {
    if (elmIndex === 0) {
      prependElm(branchIDs, branchDOM, store, elmIndex, elmDOM);
    } else if (elmIndex !== dflexElm.DOMOrder.self) {
      switchElmUp(branchIDs, branchDOM, store, elmIndex, elmDOM);
    }

    dflexElm.flushIndicators(elmDOM);
  }

  updateELmGrid(container, dflexElm);

  return isBreak;
}

function commitBranch(
  branchIDs: ELmBranch,
  branchDOM: HTMLElement,
  store: DFlexDnDStore,
  container: DFlexParentContainer
): void {
  const orderedDOMS = branchIDs.map((id) => store.interactiveDOM.get(id)!);

  branchDOM.replaceChildren(...orderedDOMS);

  orderedDOMS.forEach((elmDOM) => {
    const dflexElm = store.registry.get(elmDOM.id)!;
    dflexElm.flushIndicators(elmDOM);
    updateELmGrid(container, dflexElm);
  });
}

/**
 *
 * @param branchIDs
 * @param branchDOM
 * @param store
 * @param container
 * @param isPartial
 * @returns
 */
function DFlexDOMReconciler(
  branchIDs: ELmBranch,
  branchDOM: HTMLElement,
  store: DFlexDnDStore,
  container: DFlexParentContainer,
  isPartial: boolean
): void {
  container.resetIndicators(branchIDs.length);

  if (isPartial) {
    for (let i = 0; i < branchIDs.length; i += 1) {
      const isBreak = commitElm(
        branchIDs,
        branchDOM,
        store,
        container,
        branchIDs[i],
        i
      );

      if (isBreak) {
        break;
      }
    }

    return;
  }

  commitBranch(branchIDs, branchDOM, store, container);
}

export default DFlexDOMReconciler;
