import type { DFlexNode, DFlexScrollContainer } from "@dflex/core-instance";
import type DFlexDnDStore from "./DFlexDnDStore";

function updateElementVisibility(
  DOM: HTMLElement,
  elm: DFlexNode,
  scroll: DFlexScrollContainer
) {
  let isVisible = true;
  let isVisibleY = true;
  let isVisibleX = true;

  isVisibleY = scroll.isElementVisibleViewportY(
    elm.currentPosition.y,
    elm.initialOffset.height
  );

  isVisibleX = scroll.isElementVisibleViewportX(
    elm.currentPosition.x,
    elm.initialOffset.width
  );

  isVisible = isVisibleY && isVisibleX;

  elm.changeVisibility(DOM, isVisible);
}

function updateBranchVisibility(store: DFlexDnDStore, SK: string) {
  const branch = store.getElmBranchByKey(SK);
  const scroll = store.scrolls.get(SK)!;

  // If not scroll, then all the elements are visible.
  if (!scroll.allowDynamicVisibility) {
    branch.forEach((elmID) => {
      if (elmID.length > 0) {
        const [elm, DOM] = store.getElmWithDOM(elmID);

        elm.changeVisibility(DOM, true);
      }
    });
  } else {
    branch.forEach((elmID) => {
      if (elmID.length > 0) {
        const [elm, DOM] = store.getElmWithDOM(elmID);

        updateElementVisibility(DOM, elm, scroll);
      }
    });
  }
}

export { updateBranchVisibility, updateElementVisibility };
