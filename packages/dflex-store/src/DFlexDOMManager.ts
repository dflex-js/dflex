import { DFlexElement } from "@dflex/core-instance";
import { featureFlags } from "@dflex/utils";

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
   * Retrieves the Sibling Key (SK) associated with a given element ID.
   *
   * @param {string} id - The unique element ID.
   * @returns {string} The Sibling Key (SK) of the element.
   * @throws {Error} Throws an error if the element with the provided ID is not registered.
   */
  getSKByID(id: string): string {
    if (__DEV__) {
      if (!this.has(id)) {
        throw new Error(`Element with ID '${id}' is not registered.`);
      }
    }

    const {
      keys: { SK },
    } = this.registry.get(id)!;

    return SK;
  }

  /**
   * Removes a DFlex element and its associated DOM element from the registry.
   * @param id - The unique ID of the DFlex element.
   */
  dispose(id: string): void {
    this.registry.delete(id);

    const DOM = this.interactiveDOM.get(id)!;
    this.deletedDOM.add(DOM);

    this.interactiveDOM.delete(id);

    if (featureFlags.enableMutationDebugger) {
      // eslint-disable-next-line no-console
      console.log(`Element with id ${id} has been disposed from DOM manager.`);
    }
  }

  /**
   * Destroys the DFlexDOMManager by clearing all stored elements and associated data.
   */
  destroy(): void {
    this.interactiveDOM.clear();
    this.registry.clear();
    this.deletedDOM = new WeakSet();

    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.info("DFlexDOMManager destroyed.");
    }
  }
}

export default DFlexDOMManager;
