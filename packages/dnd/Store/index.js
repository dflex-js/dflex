import Store from "@dflex/store/src";
import CoreInstance from "@dflex/core-instance/src";

class DnDStoreImp extends Store {
  register(elmInstance) {
    super.register(elmInstance, CoreInstance);
  }
}

let store;

// eslint-disable-next-line func-names
(function () {
  if (!store) {
    store = new DnDStoreImp();
  }

  return store;
})();
