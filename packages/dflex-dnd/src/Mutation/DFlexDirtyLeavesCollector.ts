import { featureFlags } from "@dflex/utils";
import DFlexDnDStore from "../LayoutManager/DFlexDnDStore";
import DFlexIDGarbageCollector, {
  TerminatedDOMiDs,
} from "./DFlexIDGarbageCollector";

function DFlexDirtyLeavesCollector(store: DFlexDnDStore, depth: number) {
  const terminatedDOMiDs: TerminatedDOMiDs = new Set();

  store.interactiveDOM.forEach((DOM, id) => {
    if (!DOM.isConnected) {
      if (store.registry.get(id)!.depth === depth) {
        terminatedDOMiDs.add(id);
      }
    }
  });

  if (terminatedDOMiDs.size === 0) {
    return;
  }

  if (__DEV__) {
    if (featureFlags.enableRegisterDebugger) {
      // eslint-disable-next-line no-console
      console.log(
        `Found ${terminatedDOMiDs.size} dirty leaves`,
        terminatedDOMiDs,
      );
    }
  }

  DFlexIDGarbageCollector(store, terminatedDOMiDs);
}

export default DFlexDirtyLeavesCollector;
