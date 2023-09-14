import { DFlexElement } from "@dflex/core-instance";

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
  uniqueElementIDs: Set<string>;

  /**
   * Constructs a new DFlexDOMManager instance.
   */
  constructor() {
    this.registry = new Map();
    this.interactiveDOM = new Map();
    this.deletedDOM = new WeakSet();
    this.uniqueElementIDs = new Set();
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
      if (
        shouldThrowIfNotFound &&
        !(this.registry.has(id) && this.interactiveDOM.has(id))
      ) {
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
   * Removes a DFlex element and its associated DOM element from the registry.
   * @param id - The unique ID of the DFlex element.
   */
  dispose(id: string): void {
    this.registry.delete(id);
    this.interactiveDOM.delete(id);
    this.uniqueElementIDs.delete(id);
  }

  /**
   * Destroys the DFlexDOMManager by clearing all stored elements and associated data.
   */
  destroy(): void {
    this.interactiveDOM.clear();
    this.registry.clear();
    this.uniqueElementIDs.clear();

    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.info("DFlexDOMManager destroyed.");
    }
  }
}

export default DFlexDOMManager;
