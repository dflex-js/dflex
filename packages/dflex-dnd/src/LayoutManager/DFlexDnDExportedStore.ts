import type { DFlexGlobalConfig, RegisterInputOpts } from "@dflex/store";
import type { DFlexSerializedElement } from "@dflex/core-instance";

import DFlexDnDStore from "./DFlexDnDStore";

import { store } from ".";

// TODO: I am not sure if this is the best approach or not.

/**
 * Exported store for interacting with DFlex.
 */
class DFlexDnDExportedStore {
  private _base: DFlexDnDStore;

  listeners: DFlexDnDStore["listeners"];

  constructor() {
    this._base = store;
    this.listeners = this._base.listeners;
  }

  /**
   * Sets DFlex global configurations.
   *
   * @param globals - Global configurations for DFlex.
   */
  config(globals: Partial<DFlexGlobalConfig>): void {
    this._base.config(globals);
  }

  /**
   * Checks if an element with the specified ID is registered.
   *
   * @param id - ID of the element.
   * @returns `true` if the element is registered, `false` otherwise.
   */
  has(id: string): boolean {
    return this._base.has(id);
  }

  /**
   * Retrieves all element IDs of siblings.
   *
   * @param id - Element ID.
   * @returns An array containing the IDs of sibling elements.
   */
  getSiblingsByID(id: string): string[] {
    const SK = this._base.getSKByID(id);

    return this._base.getElmSiblingsByKey(SK);
  }

  /**
   * Retrieves the serialized representation of the element with the specified
   * ID.
   *
   * @param id - ID of the element.
   * @returns The serialized element object or `null` if the element is not
   * found.
   */
  getSerializedElement(id: string): DFlexSerializedElement | null {
    return this._base.getSerializedElm(id);
  }

  /**
   * Retrieves the serialized representation of all elements in the container.
   *
   * @param id - ID of the element.
   * @returns An array of serialized element objects or an empty array if no
   * elements are found.
   */
  getSerializedElements(id: string): DFlexSerializedElement[] {
    const siblingIDs = this.getSiblingsByID(id);
    const results: DFlexSerializedElement[] = [];

    for (let i = 0; i < siblingIDs.length; i += 1) {
      const siblingID = siblingIDs[i];

      const serializedElement = store.getSerializedElm(
        // This method may be invoked when a dragged element is present in the layout.
        // If there is a dragged element (siblingID.length === 0),
        // retrieve the dragged id from migration in this scenario.
        siblingID.length > 0 ? siblingID : store.migration.latest().id,
      )!;

      results.push(serializedElement);
    }

    return results;
  }

  /**
   * Checks if the layout is available.
   *
   * @returns `true` if the layout is available, `false` otherwise.
   */
  isLayoutAvailable(): boolean {
    return this._base.isLayoutAvailable();
  }

  /**
   * Registers an element with DFlex.
   *
   * @param elm - Element to register.
   */
  register(elm: RegisterInputOpts): void {
    return this._base.register(elm);
  }

  /**
   * Removes an element with the specified ID from DFlex.
   *
   * @param id - ID of the element to unregister.
   */
  unregister(id: string): void {
    this._base.unregister(id);
  }

  /**
   * Commits any pending changes to the DFlex instance.
   */
  commit(): void {
    this._base.commit();
  }

  /**
   * Destroys the DFlex instance.
   */
  destroy(): void {
    return this._base.destroy();
  }
}

export default DFlexDnDExportedStore;
