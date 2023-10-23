import { getParentElm, getElmPos, PointBool } from "@dflex/utils";

import { isOverflowing, isScrollPropagationAllowed } from "./DFlexOverflow";

import type { CSSPosition } from "./DFlexOverflow";

type ScrollProps = [HTMLElement, boolean];

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

function getScrollProps(
  baseDOMElm: HTMLElement | null,
  hasOverflow: PointBool,
): ScrollProps {
  const scrollProps: ScrollProps = [document.documentElement, true];

  if (__DEV__) {
    Object.seal(scrollProps);
  }

  if (!baseDOMElm) {
    return scrollProps;
  }

  const baseELmPosition = getElmPos(baseDOMElm);

  const overflow = (parentDOM: HTMLElement) =>
    calculateOverflow(parentDOM, baseELmPosition, hasOverflow);

  const scrollContainerDOM = getParentElm(baseDOMElm, overflow);

  if (scrollContainerDOM) {
    scrollProps[0] = scrollContainerDOM;
    scrollProps[1] = false;
  }

  if (__DEV__) {
    Object.freeze(scrollProps);
  }

  return scrollProps;
}

export default getScrollProps;
