/**
 * Retrieves an HTMLElement by its ID or throws an error if not found.
 *
 * @param id - The ID of the element to retrieve.
 * @returns The HTMLElement with the specified ID, or null if not found.
 * @throws Error - If the element is not found or is not a valid HTMLElement.
 */
function getElmDOMOrThrow(id: string): HTMLElement | null {
  let DOM = document.getElementById(id);

  if (!DOM) {
    if (__DEV__) {
      throw new Error(
        `Element with ID: ${id} is not found.This could be due wrong ID or missing DOM element.`,
      );
    }
  }

  if (!DOM || DOM.nodeType !== Node.ELEMENT_NODE) {
    if (__DEV__) {
      throw new Error(`Invalid HTMLElement ${DOM} is passed to registry.`);
    }

    DOM = null;
  }

  return DOM;
}

export default getElmDOMOrThrow;
