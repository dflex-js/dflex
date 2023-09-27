import DFlexDnDExportedStore from "./DFlexDnDExportedStore";

function createStoreInstance() {
  const store = DFlexDnDExportedStore.getInstance();

  return store;
}

export default createStoreInstance();
