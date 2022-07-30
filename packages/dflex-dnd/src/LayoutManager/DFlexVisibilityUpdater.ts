import type { DFlexNode, DFlexScrollContainer } from "@dflex/core-instance";
import type { ELmBranch } from "@dflex/dom-gen";
import type DFlexDnDStore from "./DFlexDnDStore";

let prevVisibility = false;

function updateElementVisibility(
  DOM: HTMLElement,
  elm: DFlexNode,
  scroll: DFlexScrollContainer
): boolean {
  let isVisible = true;

  let isBreakable = false;

  const { currentPosition, initialOffset } = elm;

  isVisible = scroll.isElementVisibleViewport(
    currentPosition.y,
    currentPosition.x,
    initialOffset.height,
    initialOffset.width
  );

  if (prevVisibility === true && isVisible === false) {
    isBreakable = true;
  }

  prevVisibility = isVisible;

  elm.changeVisibility(DOM, isVisible);

  return isBreakable;
}

function setBranchVisibility(
  branch: ELmBranch,
  store: DFlexDnDStore,
  from: number,
  to: number,
  value: boolean
): void {
  for (let i = from; i < to; i += 1) {
    const elmID = branch[i];

    if (elmID.length > 0) {
      const [elm, DOM] = store.getElmWithDOM(elmID);

      elm.changeVisibility(DOM, value);
    }
  }
}

function updateBranchVisibilityLinearly(
  store: DFlexDnDStore,
  SK: string
): void {
  const branch = store.getElmBranchByKey(SK);
  const scroll = store.scrolls.get(SK)!;

  // If not scroll, then all the elements are visible.
  if (!scroll.allowDynamicVisibility) {
    setBranchVisibility(branch, store, 0, branch.length, true);
  } else {
    let isBreakable = false;
    let breakAt = 0;

    for (let i = 0; i < branch.length; i += 1) {
      const elmID = branch[i];

      if (elmID.length > 0) {
        const [elm, DOM] = store.getElmWithDOM(elmID);

        // isBreakable when the element is visible and the next element is not.
        isBreakable = updateElementVisibility(DOM, elm, scroll);
      }

      if (isBreakable) {
        breakAt = i;

        break;
      }
    }

    if (isBreakable) {
      setBranchVisibility(branch, store, breakAt, branch.length, false);
    }

    // Resetting the flag.
    prevVisibility = false;
  }
}

export default updateBranchVisibilityLinearly;
