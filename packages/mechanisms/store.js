import Store from "@dflex/store";

let store;

// eslint-disable-next-line func-names
(function () {
  if (!store) {
    store = new Store();
  }

  return store;
})();
