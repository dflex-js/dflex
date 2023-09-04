import {
  getParentElm,
  getElmPos,
  getElmOverflow,
  PointBool,
  Axis,
} from "@dflex/utils";

const OVERFLOW_REGEX = /(auto|scroll|overlay)/;

type ResolveScrollPropsInput = [undefined | HTMLElement, boolean, PointBool];

type GetScrollContainerRes = [HTMLElement, boolean, PointBool];

type Overflow = ReturnType<typeof getElmOverflow>;

function hasScrollableContent(DOM: HTMLElement, axis: Axis): boolean {
  return axis === "y"
    ? DOM.scrollHeight > DOM.clientHeight
    : DOM.scrollWidth > DOM.clientWidth;
}

const hasScrollbar = (
  axis: Axis,
  overflow: Overflow,
  DOM: HTMLElement,
  hasOverflow: PointBool,
) => {
  if (OVERFLOW_REGEX.test(overflow)) {
    const has = hasScrollableContent(DOM, axis);

    if (has) {
      hasOverflow[axis] = true;

      return true;
    }
  }

  return false;
};

const resolveScrollProps = (
  parentDOM: HTMLElement,
  baseELmPosition: string,
  res: ResolveScrollPropsInput,
) => {
  const overflowX = getElmOverflow(parentDOM, "overflow-x");
  const overflowY = getElmOverflow(parentDOM, "overflow-y");

  const excludeStaticParents = baseELmPosition === "absolute";

  if (excludeStaticParents && getElmPos(parentDOM) === "static") {
    return false;
  }

  const [, , hasOverflow] = res;

  const checkOverflow = (axis: Axis, overflow: Overflow) =>
    hasScrollbar(axis, overflow, parentDOM, hasOverflow);

  return checkOverflow("y", overflowY) || checkOverflow("x", overflowX);
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
