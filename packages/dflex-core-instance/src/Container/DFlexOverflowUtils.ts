import { getElmOverflow, Axis, getElmPos } from "@dflex/utils";

const OVERFLOW_REGEX = /(auto|scroll|overlay)/;

type CSSOverflow = ReturnType<typeof getElmOverflow>;
type CSSPosition = ReturnType<typeof getElmPos>;

function isScrollPropagationAllowed(
  parentDOM: HTMLElement,
  baseELmPosition: CSSPosition,
): boolean {
  if (baseELmPosition !== "absolute") {
    return true;
  }

  return getElmPos(parentDOM) !== "static";
}

function hasScrollableContent(axis: Axis, DOM: HTMLElement): boolean {
  return axis === "y"
    ? DOM.scrollHeight > DOM.clientHeight
    : DOM.scrollWidth > DOM.clientWidth;
}

function hasOverflowProperty(axis: Axis, DOM: HTMLElement): boolean {
  const overflow: CSSOverflow = getElmOverflow(
    DOM,
    axis === "x" ? "overflow-x" : "overflow-y",
  );

  return OVERFLOW_REGEX.test(overflow);
}

function isOverflowing(axis: Axis, DOM: HTMLElement): boolean {
  if (hasOverflowProperty(axis, DOM)) {
    return hasScrollableContent(axis, DOM);
  }

  return false;
}

export { isOverflowing, hasScrollableContent, isScrollPropagationAllowed };
