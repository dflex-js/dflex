import Store from "@dflex/store/src";
import CoreInstance from "@dflex/core-instance/src";

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
  register(elmInstance) {
    super.register(elmInstance, CoreInstance);
  }
}

// eslint-disable-next-line func-names
export default (function () {
  const store = new DnDStoreImp();

  return store;
})();
