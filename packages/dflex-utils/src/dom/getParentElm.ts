const MAX_LOOP_ELEMENTS_TO_WARN = 49;
let iterationCounter = 0;

// TODO: Test this (Jest + JSX testing library) and implement it in the scroll.

function getParentElm(
  fromElement: HTMLElement,
  // eslint-disable-next-line no-unused-vars
  cb: (arg: HTMLElement) => boolean
): void {
  let current: HTMLElement | null = fromElement;

  do {
    iterationCounter += 1;

    if (__DEV__) {
      if (iterationCounter > MAX_LOOP_ELEMENTS_TO_WARN) {
        throw new Error(
          `getParentElm: DFlex detects performance issues during iterating for nearest parent element.` +
            `Please check your registered interactive element at id:${fromElement.id}.`
        );
      }
    }

    // Skip the same element `fromElement`.
    if (iterationCounter > 1) {
      // If the callback returns true, then we have found the parent element.
      if (cb(current)) {
        iterationCounter = 0;
        break;
      }
    }

    current = current.parentElement;
  } while (current && !current.isSameNode(document.body));
}

export default getParentElm;
