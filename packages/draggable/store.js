import CoreInstance from "@dflex/core-instance/src";
import AbstractStore from "@dflex/store/src/AbstractStore";

class DraggableStoreImp extends AbstractStore {
  register(elmInstance) {
    super.register(elmInstance, CoreInstance);
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
