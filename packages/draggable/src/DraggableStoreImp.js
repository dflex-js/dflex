import AbstractCoreInstance from "@dflex/core-instance/src/AbstractCoreInstance";
import AbstractStore from "@dflex/store/src/AbstractStore";

class DraggableStoreImp extends AbstractStore {
  register(elmInstance) {
    super.register(elmInstance, AbstractCoreInstance);
  }
}

let store;

// eslint-disable-next-line func-names
export default (function () {
  if (!store) {
    store = new DraggableStoreImp();
  }

  return store;
})();
