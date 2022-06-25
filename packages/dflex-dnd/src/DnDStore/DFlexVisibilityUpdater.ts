import type { IDFlexNode } from "@dflex/core-instance";
import type { IScroll } from "@dflex/utils";
import type { IDFlexDnDStore } from "./types";

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
  elm: IDFlexNode,
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

  elm.changeVisibility(isVisible);
}

function updateBranchVisibility(store: IDFlexDnDStore, SK: string) {
  const branch = store.getElmBranchByKey(SK);
  const { scroll } = store.containers.get(SK)!;

  let prevIndex = 0;

  branch.forEach((elmID, i) => {
    if (elmID.length > 0) {
      const permitExceptionToOverride = i > prevIndex;

      const elm = store.registry.get(elmID)!;

      updateElementVisibility(elm, scroll, permitExceptionToOverride);

      prevIndex = i;
    }
  });
}

export default updateBranchVisibility;
