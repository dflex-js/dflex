import { featureFlags } from "@dflex/utils";
import type DFlexDnDStore from "../LayoutManager/DFlexDnDStore";

export type TerminatedDOMiDs = Set<string>;

function cleanupLeaves(
  store: DFlexDnDStore,
  terminatedDOMiDs: TerminatedDOMiDs,
  SK: string
): [string[], string[]] {
  const connectedNodesID: string[] = [];
  const deletedNodesID: string[] = [];

  const siblings = store.getElmSiblingsByKey(SK);

  for (let i = 0; i < siblings.length; i += 1) {
    const elmID = siblings[i];

    if (terminatedDOMiDs.has(elmID)) {
      deletedNodesID.push(elmID);
    } else {
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

  return [connectedNodesID, deletedNodesID];
}

function cleanupSiblings(
  store: DFlexDnDStore,
  terminatedDOMiDs: TerminatedDOMiDs,
  SK: string,
  BK: string,
  depth: number
): void {
  const [connectedNodesID, deletedNodesID] = cleanupLeaves(
    store,
    terminatedDOMiDs,
    SK
  );

  if (__DEV__) {
    if (featureFlags.enableRegisterDebugger) {
      // eslint-disable-next-line no-console
      console.log(
        `cleanupSiblings: Found ${connectedNodesID.length} connected`,
        connectedNodesID
      );
    }
  }

  if (connectedNodesID.length > 0) {
    store.mutateSiblings(SK, connectedNodesID);

    deletedNodesID.forEach((id) => {
      store.cleanupELmInstance(id, BK);
    });
  } else {
    store.cleanupSiblingsInstance(SK, BK, depth);
  }
}

function DFlexIDGarbageCollector(
  store: DFlexDnDStore,
  terminatedDOMiDs: TerminatedDOMiDs
): void {
  const SKeys = new Map<string, { BK: string; depth: number }>();

  terminatedDOMiDs.forEach((id) => {
    const {
      keys: { SK, BK },
      depth,
    } = store.registry.get(id)!;

    store.removeElmFromRegistry(id);

    if (__DEV__) {
      if (featureFlags.enableRegisterDebugger) {
        // eslint-disable-next-line no-console
        console.log(`cleanupIDs: removing ${id} from registry`);
      }
    }

    if (!SKeys.has(SK)) {
      SKeys.set(SK, { BK, depth });
    }
  });

  SKeys.forEach(({ BK, depth }, SK) =>
    cleanupSiblings(store, terminatedDOMiDs, SK, BK, depth)
  );
}

export default DFlexIDGarbageCollector;
