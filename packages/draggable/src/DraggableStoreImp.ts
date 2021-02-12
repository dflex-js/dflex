import Store from "@dflex/store/src/Store";
import AbstractCoreInstance from "packages/coreInstance/src/AbstractCoreInstance";
import { AbstractCoreInterface } from "@dflex/core-instance/src/pkgTypes";
import { ElmInstance } from "@dflex/store/src/pkgTypes";

class DraggableStoreImp extends Store<AbstractCoreInterface> {
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
