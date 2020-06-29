import AbstractCoreInstance from "@dflex/core-instance/src/AbstractCoreInstance";
import AbstractStore from "@dflex/store/src/AbstractStore";

class DraggableStoreImp extends AbstractStore {
  /**
   * Register element for Draggable store
   *
   * @param {Object} elmInstance
   * @param {string} elmInstance.id
   * @param {node} elmInstance.element
   * @memberof DraggableStoreImp
   */
  register(elmInstance) {
    super.register(
      Object.assign(elmInstance, {
        translateY: 0,
        translateX: 0,
      }),
      AbstractCoreInstance
    );
  }
}

// eslint-disable-next-line func-names
export default (function () {
  const store = new DraggableStoreImp();

  return store;
})();
