import {
  getParentElm,
  getElmPos,
  getElmOverflow,
  PointBool,
  Axis,
} from "@dflex/utils";

const OVERFLOW_REGEX = /(auto|scroll|overlay)/;

type ScrollProps = [HTMLElement, boolean, PointBool];

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
  hasOverflow: PointBool,
) => {
  const overflowX = getElmOverflow(parentDOM, "overflow-x");
  const overflowY = getElmOverflow(parentDOM, "overflow-y");

  const excludeStaticParents = baseELmPosition === "absolute";

  if (excludeStaticParents && getElmPos(parentDOM) === "static") {
    return false;
  }

  const checkOverflow = (axis: Axis, overflow: Overflow) =>
    hasScrollbar(axis, overflow, parentDOM, hasOverflow);

  return checkOverflow("y", overflowY) || checkOverflow("x", overflowX);
};

function getScrollContainerProperties(
  baseDOMElm: HTMLElement,
  res: ScrollProps,
): void {
  const baseELmPosition = getElmPos(baseDOMElm);

  const scrollContainerDOM = getParentElm(
    baseDOMElm,
    (parentDOM: HTMLElement) =>
      resolveScrollProps(parentDOM, baseELmPosition, res[2]),
  );

  if (scrollContainerDOM) {
    res[0] = scrollContainerDOM;
    res[1] = false;
  }

  if (__DEV__) {
    Object.freeze(res);
  }
}

export default getScrollContainerProperties;
