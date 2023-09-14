import { tracker, PREFIX_TRACKER_ID } from "@dflex/utils";

function generateID(DOM: HTMLElement): string {
  const id = tracker.newTravel(PREFIX_TRACKER_ID);
  DOM.id = id;

  return id;
}

/**
 * Assigns an element ID to an HTMLElement if it doesn't already have one.
 *
 * @param DOM - The HTMLElement to assign an ID to.
 * @returns The assigned or existing ID of the element.
 */
function assignElementID(
  DOM: HTMLElement,
  uniqueElementIDs: Set<string>,
): string {
  let { id } = DOM;

  if (!id) {
    id = generateID(DOM);
  } else if (uniqueElementIDs.has(id)) {
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.warn("Element ID already assigned:", id);
    }

    DOM.dataset.oldId = id;

    id = generateID(DOM);
  }

  uniqueElementIDs.add(id);

  return id;
}

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

export { assignElementID, getElmDOMOrThrow };
