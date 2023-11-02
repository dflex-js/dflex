import type { DFlexGlobalConfig, RegisterInputOpts } from "@dflex/store";
import type { DFlexSerializedElement } from "@dflex/core-instance";

import DFlexDnDStore from "./DFlexDnDStore";

import { store } from ".";

// TODO: I am not sure if this is the best approach or not.

/**
 * Modifies an array of siblings by inserting a specified ID at a given index,
 * while ensuring that any trailing empty strings are removed.
 *
 * @param {string[]} siblings - The array of sibling strings.
 * @param {number} index - The index at which the ID should be inserted.
 * @param {string} id - The ID to be inserted.
 * @returns {string[]} The modified array of siblings.
 */
function updateSiblingsWithDragID(
  siblings: string[],
  index: number,
  id: string,
): string[] {
  // Remove empty string from the end of the array
  if (siblings[siblings.length - 1] === "") {
    siblings.pop();

    // Insert index and id
    siblings.splice(index, 0, id);
  } else {
    // direct assign cause it's already empty by design.
    siblings[index] = id;
  }

  return siblings;
}

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
   * @returns {boolean} `true` if the element is registered, `false` otherwise.
   */
  has(id: string): boolean {
    return this._base.has(id);
  }

  /**
   * Checks if there is an active drag operation.
   * @returns {boolean} `true` if an active drag operation is in progress, `false` otherwise.
   */
  hasActiveDrag(): boolean {
    const { migration } = this._base;

    return migration ? migration.isActive : false;
  }

  /**
   * Retrieves all element IDs of siblings.
   *
   * @param id - Element ID.
   * @returns An array containing the IDs of sibling elements.
   */
  getSiblingsByID(id: string): string[] {
    const SK = this._base.getSKByID(id);
    const siblings = [...this._base.getElmSiblingsByKey(SK)];

    if (this.hasActiveDrag()) {
      const {
        SK: latestSK,
        id: draggedID,
        index,
      } = this._base.migration.latest();

      // then the container has active dragging operation.
      if (SK === latestSK) {
        updateSiblingsWithDragID(siblings, index, draggedID);
      }
    }

    return siblings;
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
    return this.getSiblingsByID(id).map((_) => store.getSerializedElm(_)!);
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
