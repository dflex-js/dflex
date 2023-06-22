import type { DFlexGlobalConfig, RegisterInputOpts } from "@dflex/store";
import type { DFlexSerializedElement } from "@dflex/core-instance";
import type { Siblings } from "@dflex/dom-gen";

import DFlexDnDStore from "./DFlexDnDStore";

import { store } from ".";

// TODO: I am not sure if this is the best approach or not.

class DFlexDnDExportedStore {
  private base: DFlexDnDStore;

  listeners: DFlexDnDStore["listeners"];

  constructor() {
    this.base = store;

    this.listeners = this.base.listeners;
  }

  /**
   * Sets DFlex global configurations.
   *
   * @param globals - Global configurations for DFlex.
   */
  config(globals: DFlexGlobalConfig): void {
    this.base.config(globals);
  }

  /**
   * Checks if an element with the specified ID is registered.
   *
   * @param id - ID of the element.
   * @returns `true` if the element is registered, `false` otherwise.
   */
  has(id: string): boolean {
    return this.base.has(id);
  }

  /**
   * Retrieves all element IDs of siblings in the given node represented by the sibling key.
   *
   * @param SK - Sibling Key.
   * @returns An object containing the sibling element IDs.
   */
  getElmSiblingsByKey(SK: string): Siblings {
    return this.base.getElmSiblingsByKey(SK);
  }

  /**
   * Checks if the DFlex instance is idle.
   *
   * @returns `true` if DFlex is idle, `false` otherwise.
   */
  isIDle(): boolean {
    return this.base.isIDle();
  }

  /**
   * Checks if the layout is available.
   *
   * @returns `true` if the layout is available, `false` otherwise.
   */
  isLayoutAvailable(): boolean {
    return this.base.isLayoutAvailable();
  }

  /**
   * Registers an element with DFlex.
   *
   * @param elm - Element to register.
   * @returns The registered element.
   */
  register(elm: RegisterInputOpts) {
    return this.base.register(elm);
  }

  commit(): void {
    this.base.commit(null);
  }

  /**
   * Retrieves the serialized representation of the element with the specified ID.
   *
   * @param id - ID of the element.
   * @returns The serialized element object or `null` if the element is not found.
   */
  getSerializedElm(id: string): DFlexSerializedElement | null {
    return this.getSerializedElm(id);
  }

  /**
   * Destroys the DFlex instance.
   */
  destroy() {
    return this.base.destroy();
  }
}

export default DFlexDnDExportedStore;
