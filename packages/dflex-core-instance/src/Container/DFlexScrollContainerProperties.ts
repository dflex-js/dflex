import { getParentElm, getElmPos, PointBool } from "@dflex/utils";
import {
  isOverflowing,
  isScrollPropagationAllowed,
} from "./DFlexOverflowUtils";

type ResolveScrollPropsInput = [undefined | HTMLElement, boolean, PointBool];

type GetScrollContainerRes = [HTMLElement, boolean, PointBool];

const resolveScrollProps = (
  parentDOM: HTMLElement,
  baseELmPosition: string,
  res: ResolveScrollPropsInput,
) => {
  // @ts-ignore
  const isPropagated = isScrollPropagationAllowed(parentDOM, baseELmPosition);

  if (!isPropagated) {
    return false;
  }

  const [, , hasOverflow] = res;

  hasOverflow.x = isOverflowing("x", parentDOM);
  hasOverflow.y = isOverflowing("y", parentDOM);

  return hasOverflow.isOneTruthy();
};

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

  const scrollContainerDOM = getParentElm(
    baseDOMElm,
    (parentDOM: HTMLElement) =>
      resolveScrollProps(parentDOM, baseELmPosition, res),
  );

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
