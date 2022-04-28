/* eslint-disable no-param-reassign */
import { RectBoundaries } from "../types";

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
