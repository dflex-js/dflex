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

  if (OVERFLOW_REGEX.test(overflowY)) {
    hasOverflow.y = true;

    return true;
  }

  if (OVERFLOW_REGEX.test(overflowX)) {
    hasOverflow.x = true;

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
