import { canUseDOM } from "@dflex/utils";
import DnDStoreImp from "./DFlexDnDStore";

declare global {
  // eslint-disable-next-line
  var $DFlex: DnDStoreImp;
}

export default (function createStoreInstance() {
  const store = new DnDStoreImp();

  if (__DEV__) {
    if (canUseDOM()) {
      if (!globalThis.$DFlex) {
        globalThis.$DFlex = store;
      }
    }
  }

  return store;
})();
