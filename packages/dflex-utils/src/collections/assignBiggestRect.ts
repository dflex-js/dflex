import type { AbstractBox, BoxNum } from "../Box";

/**
 * Mutate the rect boundaries object to biggest rectangle if it is bigger than
 * the current one.
 */
function dirtyAssignBiggestRect(
  $: BoxNum | AbstractBox,
  elm: BoxNum | AbstractBox
) {
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
