import Store, { ElmInstance } from "@dflex/store/src/Store";
import AbstractCoreInstance from "@dflex/core-instance/src/AbstractCoreInstance";

class DraggableStoreImp extends Store<AbstractCoreInstance> {
  /**
   * Register element for Draggable store
   *
   * @param {ElmInstance} element
   * @memberof DraggableStoreImp
   */
  register(element: ElmInstance) {
    super.register(element, AbstractCoreInstance);
  }
}

// eslint-disable-next-line func-names
export default (function () {
  const store = new DraggableStoreImp();

  return store;
})();
