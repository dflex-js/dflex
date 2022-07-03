import type { DFlexNode } from "@dflex/core-instance";
import type { IScroll } from "@dflex/utils";
import type DFlexDnDStore from "./DFlexDnDStore";

const elmIndicator = Object.seal({
  currentKy: "",
  prevKy: "",
  exceptionToNextElm: false,
});

function initELmIndicator() {
  elmIndicator.currentKy = "";
  elmIndicator.prevKy = "";
  elmIndicator.exceptionToNextElm = false;
}

function updateElementVisibility(
  DOM: HTMLElement,
  elm: DFlexNode,
  scroll: IScroll,
  permitExceptionToOverride: boolean
) {
  let isVisible = true;
  let isVisibleY = true;
  let isVisibleX = true;

  if (scroll.allowDynamicVisibility) {
    isVisibleY = scroll.isElementVisibleViewportY(elm.currentPosition.y);

    isVisibleX = scroll.isElementVisibleViewportX(elm.currentPosition.x);

    isVisible = isVisibleY && isVisibleX;

    if (
      !isVisible &&
      !elmIndicator.exceptionToNextElm &&
      permitExceptionToOverride
    ) {
      elmIndicator.exceptionToNextElm = true;

      // Override the result.
      isVisible = true;
    } else if (isVisible) {
      if (elmIndicator.exceptionToNextElm) {
        // In this case, we are moving from hidden to visible.
        // Eg: 1, 2 are hidden the rest of the list is visible.
        // But, there's a possibility that the rest of the branch elements
        // are hidden.
        // Eg: 1, 2: hidden 3, 4, 5, 6, 7:visible 8, 9, 10: hidden.
        initELmIndicator();
      }
    }
  }

  elm.changeVisibility(DOM, isVisible);
}

function updateBranchVisibility(store: DFlexDnDStore, SK: string) {
  const branch = store.getElmBranchByKey(SK);
  const scroll = store.scrolls.get(SK)!;

  let prevIndex = 0;

  branch.forEach((elmID, i) => {
    if (elmID.length > 0) {
      const permitExceptionToOverride = i > prevIndex;

      const [elm, DOM] = store.getElmWithDOM(elmID);

      updateElementVisibility(DOM, elm, scroll, permitExceptionToOverride);

      prevIndex = i;
    }
  });
}

export { updateBranchVisibility, updateElementVisibility };
