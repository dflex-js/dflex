import type { RectBoundaries } from "../types";

/**
 * Mutate the rect boundaries object to biggest rectangle if it is bigger than
 * the current one.
 */
function dirtyAssignBiggestRect($: RectBoundaries, elm: RectBoundaries) {
  const { top, left, right, bottom } = elm;

  if (left < $.left) {
    $.left = left;
  }

  if (top < $.top) {
    $.top = top;
  }

  if (right > $.right) {
    $.right = right;
  }

  if (bottom > $.bottom) {
    $.bottom = bottom;
  }
}

export default dirtyAssignBiggestRect;
