import { getParentElm, getElmPos, PointBool } from "@dflex/utils";

import {
  isOverflowing,
  isScrollPropagationAllowed,
} from "./DFlexOverflowUtils";

import type { CSSPosition } from "./DFlexOverflowUtils";

type ResolveScrollPropsInput = [undefined | HTMLElement, boolean, PointBool];

type GetScrollContainerRes = [HTMLElement, boolean, PointBool];

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

function getScrollContainerProperties(
  baseDOMElm: HTMLElement,
): GetScrollContainerRes {
  const baseELmPosition = getElmPos(baseDOMElm);

  const res: ResolveScrollPropsInput = [
    undefined,
    false,
    new PointBool(false, false),
  ];

  if (__DEV__) {
    Object.seal(res);
  }

  const overflow = (parentDOM: HTMLElement) =>
    calculateOverflow(parentDOM, baseELmPosition, res[2]);

  const scrollContainerDOM = getParentElm(baseDOMElm, overflow);

  if (!scrollContainerDOM || baseELmPosition === "fixed") {
    res[0] = document.documentElement;
    res[1] = true;
  } else {
    res[0] = scrollContainerDOM;
  }

  if (__DEV__) {
    Object.freeze(res);
  }

  return res as GetScrollContainerRes;
}

export default getScrollContainerProperties;
