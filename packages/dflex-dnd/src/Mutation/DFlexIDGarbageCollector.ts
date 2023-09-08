import { featureFlags } from "@dflex/utils";
import type DFlexDnDStore from "../LayoutManager/DFlexDnDStore";

export type TerminatedDOMiDs = Set<string>;

function recomposeSiblings(
  store: DFlexDnDStore,
  terminatedDOMiDs: TerminatedDOMiDs,
  { BK, depth }: SiblingKeyVal,
  SK: string,
): void {
  const connectedNodesID: string[] = [];

  const siblings = store.getElmSiblingsByKey(SK);

  for (let i = 0; i < siblings.length; i += 1) {
    const elmID = siblings[i];

    if (!terminatedDOMiDs.has(elmID)) {
      const dflexElm = store.registry.get(elmID)!;

      const index = connectedNodesID.push(elmID) - 1;

      if (index !== dflexElm.VDOMOrder.self) {
        dflexElm.updateIndex(store.interactiveDOM.get(elmID)!, index);

        if (featureFlags.enableRegisterDebugger) {
          // eslint-disable-next-line no-console
          console.log(`cleanupLeaves: updating index for ${elmID} to ${index}`);
        }
      }
    }
  }

  if (__DEV__) {
    if (featureFlags.enableRegisterDebugger) {
      // eslint-disable-next-line no-console
      console.log(
        `cleanupSiblings: Found ${connectedNodesID.length} connected`,
        connectedNodesID,
      );
    }
  }

  if (connectedNodesID.length > 0) {
    terminatedDOMiDs.forEach((id) => {
      store.DOMGen.removeIDFromBranch(id, BK);
    });

    store.DOMGen.mutateSiblings(SK, connectedNodesID);
  } else {
    store.deleteSiblings(SK, BK, depth);
  }
}

type SiblingKeyVal = { BK: string; depth: number };

function DFlexIDGarbageCollector(
  store: DFlexDnDStore,
  terminatedDOMiDs: TerminatedDOMiDs,
): void {
  const SKeys = new Map<string, SiblingKeyVal>();

  const terminatedParentDOMiDs: TerminatedDOMiDs = new Set();

  terminatedDOMiDs.forEach((id) => {
    const [parentID, parentHtml] = store.getParentByElmID(id);

    if (!parentHtml.isConnected) {
      terminatedParentDOMiDs.add(parentID);
    }
  });

  if (terminatedParentDOMiDs.size > 0) {
    terminatedParentDOMiDs.forEach((id) => {
      terminatedDOMiDs.add(id);
    });
  }

  terminatedDOMiDs.forEach((id) => {
    const {
      keys: { SK, BK },
      depth,
    } = store.registry.get(id)!;

    store.deleteFromRegistry(id);

    if (__DEV__) {
      if (featureFlags.enableRegisterDebugger) {
        // eslint-disable-next-line no-console
        console.log(`DFlexIdGC: removing ${id} from registry`);
      }
    }

    if (!SKeys.has(SK)) {
      SKeys.set(SK, { BK, depth });
    }
  });

  const recomposeFromKys = (v: SiblingKeyVal, k: string) =>
    recomposeSiblings(store, terminatedDOMiDs, v, k);

  SKeys.forEach(recomposeFromKys);

  // terminatedDOMiDs.forEach((id) => {
  //   const {
  //     keys: { BK },
  //   } = store.registry.get(id)!;

  //   store.DOMGen.removeIDFromBranch(id, BK);
  // });
}

export default DFlexIDGarbageCollector;
