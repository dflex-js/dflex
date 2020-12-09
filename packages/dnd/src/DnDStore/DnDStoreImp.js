import Store from "@dflex/store/src";
import CoreInstance from "@dflex/core-instance/src";

function noop() {}

const handlers = ["onDragOver", "onDragLeave"];

class DnDStoreImp extends Store {
  /**
   * Register element for Store
   *
   * @param {Object} elmInstance
   * @param {number} elmInstance.depth
   * @param {string} elmInstance.id
   * @param {node} elmInstance.element
   * @param {Object} opts - Extra options currently include handlers.
   * @memberof DraggableStoreImp
   */
  register(elmInstance, opts) {
    const finalOpts = opts || {};

    /**
     * Initiates available event handlers
     */
    handlers.forEach((handler) => {
      if (typeof finalOpts[handler] !== "function") finalOpts[handler] = noop;
    });

    super.register(elmInstance, CoreInstance, finalOpts);
  }
}

// eslint-disable-next-line func-names
export default (function () {
  const store = new DnDStoreImp();

  return store;
})();
