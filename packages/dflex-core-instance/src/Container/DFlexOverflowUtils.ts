import { getElmOverflow, Axis, getElmPos } from "@dflex/utils";

const OVERFLOW_REGEX = /(auto|scroll|overlay)/;

type CSSOverflow = ReturnType<typeof getElmOverflow>;
export type CSSPosition = ReturnType<typeof getElmPos>;

function isScrollPropagationAllowed(
  parentDOM: HTMLElement,
  baseELmPosition: CSSPosition,
): boolean {
  if (baseELmPosition !== "absolute") {
    return true;
  }

  return getElmPos(parentDOM) !== "static";
}

function hasScrollableContent(axis: Axis, parentDOM: HTMLElement): boolean {
  return axis === "y"
    ? parentDOM.scrollHeight > parentDOM.clientHeight
    : parentDOM.scrollWidth > parentDOM.clientWidth;
}

function hasOverflowProperty(axis: Axis, parentDOM: HTMLElement): boolean {
  const overflow: CSSOverflow = getElmOverflow(
    parentDOM,
    axis === "x" ? "overflow-x" : "overflow-y",
  );

  return OVERFLOW_REGEX.test(overflow);
}

function isOverflowing(axis: Axis, parentDOM: HTMLElement): boolean {
  if (hasOverflowProperty(axis, parentDOM)) {
    return hasScrollableContent(axis, parentDOM);
  }

  return false;
}

export { isOverflowing, hasScrollableContent, isScrollPropagationAllowed };
