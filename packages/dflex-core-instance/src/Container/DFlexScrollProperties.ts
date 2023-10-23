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

function hasScrollbar(
  axis: Axis,
  overflow: Overflow,
  DOM: HTMLElement,
  hasOverflow: PointBool,
): boolean {
  if (OVERFLOW_REGEX.test(overflow)) {
    const has = hasScrollableContent(DOM, axis);

    if (has) {
      hasOverflow[axis] = true;

      return true;
    }
  }

  return false;
}

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

  const checkScrollbar = (axis: Axis, overflow: Overflow) =>
    hasScrollbar(axis, overflow, parentDOM, hasOverflow);

  return checkScrollbar("y", overflowY) || checkScrollbar("x", overflowX);
};

function getScrollProps(
  baseDOMElm: HTMLElement,
  scrollProps: ScrollProps,
): void {
  const baseELmPosition = getElmPos(baseDOMElm);

  const scrollContainerDOM = getParentElm(
    baseDOMElm,
    (parentDOM: HTMLElement) =>
      resolveScrollProps(parentDOM, baseELmPosition, scrollProps[2]),
  );

  if (scrollContainerDOM) {
    scrollProps[0] = scrollContainerDOM;
    scrollProps[1] = false;
  }

  if (__DEV__) {
    Object.freeze(scrollProps);
  }
}

export { getScrollProps, hasScrollbar };
