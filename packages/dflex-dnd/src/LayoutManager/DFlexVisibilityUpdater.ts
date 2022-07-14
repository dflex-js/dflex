import type { DFlexNode, DFlexScrollContainer } from "@dflex/core-instance";
import type DFlexDnDStore from "./DFlexDnDStore";

let hasGivenVisibilityException = false;

function updateElementVisibility(
  DOM: HTMLElement,
  elm: DFlexNode,
  scroll: DFlexScrollContainer
) {
  let isVisible = true;
  let isVisibleY = true;
  let isVisibleX = true;

  if (scroll.allowDynamicVisibility) {
    isVisibleY = scroll.isElementVisibleViewportY(elm.currentPosition.y);

    isVisibleX = scroll.isElementVisibleViewportX(elm.currentPosition.x);

    isVisible = isVisibleY && isVisibleX;

    if (!isVisible && !hasGivenVisibilityException) {
      hasGivenVisibilityException = true;

      // Override the result.
      isVisible = true;
    } else if (isVisible) {
      if (hasGivenVisibilityException) {
        // In this case, we are moving from hidden to visible.
        // Eg: 1, 2 are hidden the rest of the list is visible.
        // But, there's a possibility that the rest of the branch elements
        // are hidden.
        // Eg: 1, 2: hidden 3, 4, 5, 6, 7:visible 8, 9, 10: hidden.
        hasGivenVisibilityException = false;
      }
    }
  }

  elm.changeVisibility(DOM, isVisible);
}

function updateBranchVisibility(store: DFlexDnDStore, SK: string) {
  const branch = store.getElmBranchByKey(SK);
  const scroll = store.scrolls.get(SK)!;

  branch.forEach((elmID) => {
    if (elmID.length > 0) {
      const [elm, DOM] = store.getElmWithDOM(elmID);

      updateElementVisibility(DOM, elm, scroll);
    }
  });

  // Reset the exception.
  hasGivenVisibilityException = false;
}

export { updateBranchVisibility, updateElementVisibility };
