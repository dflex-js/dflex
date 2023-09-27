import { canUseDOM } from "@dflex/utils";
import { DFlexDnDStore } from "../LayoutManager";

declare global {
  // eslint-disable-next-line
  var $DFlex: DFlexDnDStore;
}

function createStoreInstance() {
  const store = DFlexDnDStore.getInstance();

  if (__DEV__) {
    if (canUseDOM()) {
      if (!globalThis.$DFlex) {
        globalThis.$DFlex = store;
      }
    }
  }

  return store;
}

export default createStoreInstance();
