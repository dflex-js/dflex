const MAX_LOOP_ELEMENTS_TO_WARN = 49;

function getParentElm(
  baseElement: HTMLElement,
  // eslint-disable-next-line no-unused-vars
  cb: (arg: HTMLElement) => boolean
): null | HTMLElement {
  let iterationCounter = 0;

  let current: HTMLElement | null = baseElement;

  do {
    iterationCounter += 1;

    if (__DEV__) {
      if (iterationCounter > MAX_LOOP_ELEMENTS_TO_WARN) {
        throw new Error(
          `getParentElm: DFlex detects performance issues during iterating for nearest parent element.` +
            `Please check your registered interactive element at id:${baseElement.id}.`
        );
      }
    }

    // Skip the same element `baseElement`.
    if (iterationCounter > 1) {
      // If the callback returns true, then we have found the parent element.
      if (cb(current)) {
        iterationCounter = 0;
        return current;
      }
    }

    current = current.parentElement;
  } while (current !== null && !current.isSameNode(document.body));

  return null;
}

export default getParentElm;
