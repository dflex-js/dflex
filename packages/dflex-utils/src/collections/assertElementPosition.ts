import type { BoxRectAbstract } from "../Box";

let didThrowError = false;

function assertElementPosition(DOM: HTMLElement, rect: BoxRectAbstract): void {
  if (didThrowError) {
    return;
  }

  const DOMRect = DOM.getBoundingClientRect();

  const keys = Object.keys(rect) as (keyof typeof rect)[];

  keys.forEach((k) => {
    if (
      Object.prototype.hasOwnProperty.call(DOMRect, k) &&
      DOMRect[k] !== rect[k]
    ) {
      didThrowError = true;

      throw new Error(
        `Element position assertion failed. \n Expected: ${JSON.stringify(
          rect
        )} \n Actual: ${JSON.stringify(DOMRect)} \n\n`
      );
    }
  });
}

export default assertElementPosition;
