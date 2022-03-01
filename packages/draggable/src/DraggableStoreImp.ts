import Store from "@dflex/store";

import type { RegisterInput } from "./types";

class DraggableStoreImp extends Store {
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

    super.register({
      id,
      depth: 0,
      isInitialized: true,
      isPaused: false,
      scrollX: 0,
      scrollY: 0,
      ...element,
    });
  }
}

export default (function createStoreInstance() {
  const store = new DraggableStoreImp();

  return store;
})();
