import {
  getParentElm,
  getElmPos,
  getElmOverflow,
  getElmDimensions,
  PointBool,
  Axis,
  Dimensions,
} from "@dflex/utils";

const OVERFLOW_REGEX = /(auto|scroll|overlay)/;

type ResolveScrollPropsInput = [
  undefined | HTMLElement,
  boolean,
  PointBool,
  undefined | Dimensions
];

type GetScrollContainerRes = [HTMLElement, boolean, PointBool, Dimensions];

type Overflow = ReturnType<typeof getElmOverflow>;

function hasScrollableContent(DOM: HTMLElement): boolean {
  return DOM.scrollHeight > DOM.clientHeight;
}

const hasScrollbar = (
  axis: Axis,
  overflow: Overflow,
  DOM: HTMLElement,
  hasOverflow: PointBool
) => {
  if (OVERFLOW_REGEX.test(overflow)) {
    const has = hasScrollableContent(DOM);

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
  res: ResolveScrollPropsInput
) => {
  const overflowX = getElmOverflow(parentDOM, "overflow-x");
  const overflowY = getElmOverflow(parentDOM, "overflow-y");

  const excludeStaticParents = baseELmPosition === "absolute";

  if (excludeStaticParents && getElmPos(parentDOM) === "static") {
    return false;
  }

  const [, , hasOverflow, dimension] = res;

  if (!dimension) {
    // Get parent DOM dimension.
    res[3] = getElmDimensions(parentDOM);

    if (__DEV__) {
      Object.freeze(dimension);
    }
  }

  const checkOverflow = (axis: Axis, overflow: Overflow) =>
    hasScrollbar(axis, overflow, parentDOM, hasOverflow);

  return checkOverflow("y", overflowY) || checkOverflow("x", overflowX);
};

function getScrollContainerProperties(
  baseDOMElm: HTMLElement
): GetScrollContainerRes {
  const baseELmPosition = getElmPos(baseDOMElm);

  const res: ResolveScrollPropsInput = [
    undefined,
    false,
    new PointBool(false, false),
    undefined,
  ];

  if (__DEV__) {
    Object.seal(res);
  }

  const scrollContainerDOM = getParentElm(
    baseDOMElm,
    (parentDOM: HTMLElement) =>
      resolveScrollProps(parentDOM, baseELmPosition, res)
  );

  if (!res[3]) {
    res[3] = getElmDimensions(document.documentElement);
  }

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
