import { DFlexDnDExportedStore } from "./LayoutManager";

function createStoreInstance() {
  const store = DFlexDnDExportedStore.getInstance();

  return store;
}

export default createStoreInstance();
