import { DFlexElement } from "@dflex/core-instance";
import { PREFIX_TRACKER_ID, tracker } from "@dflex/utils";

function generateID(DOM: HTMLElement): string {
  const id = tracker.newTravel(PREFIX_TRACKER_ID);
  DOM.id = id;

  return id;
}

/**
 * Assigns an element ID to an HTMLElement if it doesn't already have one.
 *
 * @param DOM - The HTMLElement to assign an ID to.
 * @param uniqueElementIDs - Set of added IDs.
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
 * DFlexDOMManager manages the elements registered in the DFlex framework.
 */
class DFlexDOMManager {
  /**
   * Map to store DFlex elements by their unique IDs.
   */
  registry: Map<string, DFlexElement>;

  /**
   * Map to associate DFlex element IDs with their corresponding DOM elements.
   */
  interactiveDOM: Map<string, HTMLElement>;

  /**
   * Set to track deleted DOM elements weakly.
   */
  deletedDOM: WeakSet<HTMLElement>;

  /**
   * Set to track unique element IDs.
   * This ensures that each element has a globally unique identifier.
   */
  private _uniqueElementIDs: Set<string>;

  /**
   * Constructs a new DFlexDOMManager instance.
   */
  constructor() {
    this.registry = new Map();
    this.interactiveDOM = new Map();
    this.deletedDOM = new WeakSet();
    this._uniqueElementIDs = new Set();
  }

  /**
   * Retrieves the DFlex element and its associated DOM element by ID.
   * @param id - The unique ID of the DFlex element.
   * @param {boolean} [shouldThrowIfNotFound=true] - Whether to throw an error if the element is not found.
   * @returns A tuple containing the DFlex element and its corresponding DOM element.
   */
  getElmWithDOM(
    id: string,
    shouldThrowIfNotFound: boolean = true,
  ): [DFlexElement, HTMLElement] {
    if (__DEV__) {
      if (shouldThrowIfNotFound && !this.has(id)) {
        throw new Error(`getElmWithDOM: Unable to find element with ID: ${id}`);
      }
    }

    const dflexElm = this.registry.get(id)!;
    const DOM = this.interactiveDOM.get(id)!;

    return [dflexElm, DOM];
  }

  /**
   * Checks if an element with a given ID is registered.
   * @param id - The unique ID of the DFlex element.
   * @returns `true` if the element is registered, otherwise `false`.
   */
  has(id: string): boolean {
    return this.interactiveDOM.has(id) && this.registry.has(id);
  }

  /**
   * Assigns a unique element ID to an HTMLElement if it doesn't already have one.
   * If the element already has an ID, it ensures that it is unique globally.
   *
   * @param DOM - The HTMLElement to assign an ID to.
   * @returns The assigned or existing unique ID of the element.
   */
  assignElementID(DOM: HTMLElement): string {
    return assignElementID(DOM, this._uniqueElementIDs);
  }

  /**
   * Removes a DFlex element and its associated DOM element from the registry.
   * @param id - The unique ID of the DFlex element.
   */
  dispose(id: string): void {
    this.registry.delete(id);
    this.interactiveDOM.delete(id);
    this._uniqueElementIDs.delete(id);
  }

  /**
   * Destroys the DFlexDOMManager by clearing all stored elements and associated data.
   */
  destroy(): void {
    this.interactiveDOM.clear();
    this.registry.clear();
    this._uniqueElementIDs.clear();

    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.info("DFlexDOMManager destroyed.");
    }
  }
}

export default DFlexDOMManager;
