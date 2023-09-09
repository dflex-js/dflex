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
   * Constructs a new DFlexDOMManager instance.
   */
  constructor() {
    this.registry = new Map();
    this.interactiveDOM = new Map();
    this.deletedDOM = new WeakSet();
  }

  /**
   * Retrieves the DFlex element and its associated DOM element by ID.
   * @param id - The unique ID of the DFlex element.
   * @returns A tuple containing the DFlex element and its corresponding DOM element.
   */
  getElmWithDOM(id: string): [DFlexElement, HTMLElement] {
    if (__DEV__) {
      if (!(this.registry.has(id) && this.interactiveDOM.has(id))) {
        // eslint-disable-next-line no-console
        console.warn(`getElmWithDOM: Unable to find element with ID: ${id}`);
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
  }

  /**
   * Destroys the DFlexDOMManager by clearing all stored elements and associated data.
   */
  destroy(): void {
    this.interactiveDOM.clear();
    this.registry.clear();

    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.info("DFlexDOMManager destroyed.");
    }
  }
}

export default DFlexDOMManager;
