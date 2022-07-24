import { canUseDOM } from "@dflex/utils";
import DFlexDnDStore from "./DFlexDnDStore";

declare global {
  // eslint-disable-next-line
  var $DFlex: DFlexDnDStore;
}

export default (function createStoreInstance() {
  const store = new DFlexDnDStore();

  if (__DEV__) {
    if (canUseDOM()) {
      if (!globalThis.$DFlex) {
        globalThis.$DFlex = store;
      }
    }
  }

  return store;
})();
