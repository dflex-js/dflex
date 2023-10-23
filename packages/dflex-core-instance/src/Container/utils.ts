import { getElmOverflow, PointBool, Axis } from "@dflex/utils";

const OVERFLOW_REGEX = /(auto|scroll|overlay)/;

type CSSOverflow = ReturnType<typeof getElmOverflow>;

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

function hasOverflow(axis: Axis, DOM: HTMLElement): boolean {
  if (hasOverflowProperty(axis, DOM)) {
    return hasScrollableContent(axis, DOM);
  }

  return false;
}
