import {
  getParentElm,
  getElmPos,
  getElmOverflow,
  getElmDimensions,
  PointBool,
} from "@dflex/utils";

const OVERFLOW_REGEX = /(auto|scroll|overlay)/;

type ResolveScrollPropsInput = [
  undefined | HTMLElement,
  boolean,
  PointBool,
  undefined | ReturnType<typeof getElmDimensions>
];

type GetScrollContainerRes = [
  HTMLElement,
  boolean,
  PointBool,
  ReturnType<typeof getElmDimensions>
];

const resolveScrollProps = (
  parentDOM: HTMLElement,
  baseDOMElm: HTMLElement,
  baseELmPosition: string,
  res: ResolveScrollPropsInput
) => {
  const overflowX = getElmOverflow(baseDOMElm, "overflow-x");
  const overflowY = getElmOverflow(baseDOMElm, "overflow-y");

  const parentRect = parentDOM.getBoundingClientRect();

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

  if (
    OVERFLOW_REGEX.test(overflowY) &&
    parentDOM.scrollHeight === Math.round(parentRect.height)
  ) {
    res[1] = true;
    hasOverflow.y = true;
    return true;
  }

  if (
    OVERFLOW_REGEX.test(overflowX) &&
    parentDOM.scrollWidth === Math.round(parentRect.width)
  ) {
    hasOverflow.x = true;
    res[1] = true;
    return true;
  }

  return false;
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
      resolveScrollProps(parentDOM, baseDOMElm, baseELmPosition, res)
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
