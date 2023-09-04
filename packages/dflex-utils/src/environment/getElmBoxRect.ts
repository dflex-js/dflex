import { BoxRect } from "../Box";

function getElmBoxRect(
  DOM: HTMLElement,
  scrollLeft: number,
  scrollTop: number,
): BoxRect {
  const { left, top, right, bottom, height, width } =
    DOM.getBoundingClientRect();

  const boxRect = new BoxRect(top, right, bottom, left);

  if (scrollLeft === 0 && scrollTop === 0) {
    return boxRect;
  }

  /**
   * Calculate the element's position by adding the scroll position to the
   * left and top values obtained from getBoundingClientRect.
   */
  const elementLeft = left + scrollLeft;
  const elementTop = top + scrollTop;

  boxRect.setByPointAndDimensions(elementTop, elementLeft, height, width);

  return boxRect;
}

export default getElmBoxRect;
