import Store from "@dflex/store/src/Store";
import AbstractCoreInstance from "@dflex/core-instance/src/AbstractCoreInstance";
import { AbstractCoreInterface } from "@dflex/core-instance";
import { ElmInstance } from "@dflex/store";

class DraggableStoreImp extends Store<AbstractCoreInterface> {
  /**
   * Register element for Draggable store
   *
   * @param element -
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
