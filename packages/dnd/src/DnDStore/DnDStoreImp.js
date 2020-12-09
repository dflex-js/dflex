import Store from "@dflex/store/src";
import CoreInstance from "@dflex/core-instance/src";

function noop() {
  console.log("hehe");
}

const handlers = ["onDragOver", "onDragLeave"];

class DnDStoreImp extends Store {
  /**
   * Register element for Store
   *
   * @param {Object} elmInstance
   * @param {number} elmInstance.depth
   * @param {string} elmInstance.id
   * @param {node} elmInstance.element
   * @memberof DraggableStoreImp
   */
  register(elmInstance, opts) {
    const finalOpts = opts || {};

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
