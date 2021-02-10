import Store from "@dflex/store/src/Store";
import AbstractCoreInstance from "packages/coreInstance/src/AbstractCoreInstance";
import { AbstractCore } from "packages/coreInstance/src/types";
import { ElmInstance } from "packages/store/src/types";

class DraggableStoreImp extends Store<AbstractCore> {
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
