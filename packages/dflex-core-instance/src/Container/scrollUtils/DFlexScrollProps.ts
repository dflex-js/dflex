import { getParentElm, getElmPos, PointBool } from "@dflex/utils";

import { isOverflowing, isScrollPropagationAllowed } from "./DFlexOverflow";

import type { CSSPosition } from "./DFlexOverflow";

type ScrollProps = [HTMLElement, boolean, PointBool];

function calculateOverflow(
  parentDOM: HTMLElement,
  baseELmPosition: CSSPosition,
  hasOverflow: PointBool,
): boolean {
  const isPropagated = isScrollPropagationAllowed(parentDOM, baseELmPosition);

  if (!isPropagated) {
    return false;
  }

  hasOverflow.x = isOverflowing("x", parentDOM);
  hasOverflow.y = isOverflowing("y", parentDOM);

  return hasOverflow.isOneTruthy();
}

function getScrollProps(baseDOMElm: HTMLElement): ScrollProps {
  const baseELmPosition = getElmPos(baseDOMElm);

  const scrollProps: ScrollProps = [
    document.documentElement,
    true,
    new PointBool(false, false),
  ];

  if (__DEV__) {
    Object.seal(scrollProps);
  }

  const overflow = (parentDOM: HTMLElement) =>
    calculateOverflow(parentDOM, baseELmPosition, scrollProps[2]);

  const scrollContainerDOM = getParentElm(baseDOMElm, overflow);

  if (scrollContainerDOM) {
    scrollProps[0] = scrollContainerDOM;
    scrollProps[1] = false;
    // scrollProps[2] should be mutated by `calculateOverflow`
  }

  if (__DEV__) {
    Object.freeze(scrollProps);
  }

  return scrollProps;
}

export default getScrollProps;
