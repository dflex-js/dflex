/**
 * Copyright (c) Jalal Maskoun.
 *
 * This source code is licensed under the AGPL3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
import Store from "@dflex/store";

import AbstractCoreInstance, {
  AbstractCoreInterface,
} from "@dflex/core-instance";

import type { RegisterInput } from "./types";

class DraggableStoreImp extends Store<AbstractCoreInterface> {
  /**
   * Register element for Draggable store
   *
   * @param element -
   */
  register(element: RegisterInput) {
    if (!element.ref && !element.id) {
      throw new Error(
        `DFlex: A valid unique id Or/and HTML element is required.`
      );
    }

    /**
     * If element already exist in the store, then the reattach the reference.
     */
    const id = element.id || element.ref?.id;

    if (!id) {
      throw new Error(`DFlex: A valid and unique id is required.`);
    }

    const elm = {
      ...element,
      id,
      depth: 0,
    };

    super.register(elm, AbstractCoreInstance);
  }
}

export default (function createStoreInstance() {
  const store = new DraggableStoreImp();

  return store;
})();
