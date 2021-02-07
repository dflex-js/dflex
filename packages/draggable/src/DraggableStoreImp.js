/* eslint-disable tree-shaking/no-side-effects-in-initialization */
import AbstractCoreInstance from "@dflex/core-instance/src/AbstractCoreInstance";
import Store from "@dflex/store/src/Store";

/** @typedef {import("packages/store/src/Store").ElmInstance} ElmInstance */

class DraggableStoreImp extends Store {
  /**
   * Register element for Draggable store
   *
   * @param {ElmInstance} element
   * @memberof DraggableStoreImp
   */
  register(element) {
    super.register(element, AbstractCoreInstance);
  }
}

// eslint-disable-next-line func-names
export default (function () {
  const store = new DraggableStoreImp();

  return store;
})();
