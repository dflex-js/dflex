import type { BoxRectAbstract } from "../Box";

let didThrowError = false;

function assertElementPosition(DOM: HTMLElement, rect: BoxRectAbstract): void {
  if (didThrowError) {
    return;
  }

  const { top, left, bottom, right, width, height } =
    DOM.getBoundingClientRect();

  if (
    top !== rect.top ||
    left !== rect.left ||
    bottom !== rect.bottom ||
    right !== rect.right ||
    width !== rect.width ||
    height !== rect.height
  ) {
    didThrowError = true;

    throw new Error(
      `Element position assertion failed. \n Expected: ${JSON.stringify(
        rect
      )} \n Actual: ${JSON.stringify({
        top,
        left,
        bottom,
        right,
        width,
        height,
      })} \n\n`
    );
  }
}

export default assertElementPosition;
