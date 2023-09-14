import { featureFlags } from "@dflex/utils";
import type DFlexDnDStore from "../LayoutManager/DFlexDnDStore";

export type TerminatedDOMiDs = Set<string>;

const enableParentCleanup = false;

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

        if (featureFlags.enableMutationDebugger) {
          // eslint-disable-next-line no-console
          console.log(`cleanupLeaves: updating index for ${elmID} to ${index}`);
        }
      }
    }
  }

  if (__DEV__) {
    if (featureFlags.enableMutationDebugger) {
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
type SKeysMap = Map<string, SiblingKeyVal>;

function groupIDsBySK(store: DFlexDnDStore, SKeys: SKeysMap, id: string): void {
  const [dflexElm, DOM] = store.getElmWithDOM(id, false);

  // hasAlreadyBeenRemoved
  if (!DOM || !dflexElm) {
    if (featureFlags.enableMutationDebugger) {
      // eslint-disable-next-line no-console
      console.log(
        `Element with id: (${id}) has already been removed from registry`,
      );
    }

    return;
  }

  const {
    keys: { SK, BK },
    depth,
  } = dflexElm;

  // This function handles calls from two sources: the observer and unregister.
  // To prevent triggering the process twice, we check if it's the first time
  // or if it's already been deleted.
  const hasAlreadyBeenRemoved = store.deletedDOM.has(DOM);

  if (!hasAlreadyBeenRemoved) {
    if (__DEV__) {
      if (featureFlags.enableMutationDebugger) {
        // eslint-disable-next-line no-console
        console.log(`Queue ${id} to be removed from registry`);
      }
    }

    if (!SKeys.has(SK)) {
      SKeys.set(SK, { BK, depth });
    }
  } else if (__DEV__) {
    if (featureFlags.enableMutationDebugger) {
      // eslint-disable-next-line no-console
      console.log(
        `Element with id: (${id}) has already been removed from registry`,
      );
    }
  }
}

function DFlexIDGarbageCollector(
  store: DFlexDnDStore,
  terminatedDOMiDs: TerminatedDOMiDs,
): void {
  const SKeys = new Map<string, SiblingKeyVal>();

  const group = (id: string) => groupIDsBySK(store, SKeys, id);

  terminatedDOMiDs.forEach(group);

  if (SKeys.size === 0) {
    if (featureFlags.enableMutationDebugger) {
      // eslint-disable-next-line no-console
      console.log(`Nothing to unregister.`);
    }

    return;
  }

  SKeys.forEach((_, SK) => {
    const siblings = store.getElmSiblingsByKey(SK);

    const id = siblings[0];

    const parent = store.getParentByElmID(id);

    if (enableParentCleanup && parent) {
      const [parentID, parentDOM] = parent;

      if (!parentDOM.isConnected) {
        if (featureFlags.enableMutationDebugger) {
          // eslint-disable-next-line no-console
          console.log(
            `Parent with id: (${parentID}) will be removed from registry`,
          );
        }

        siblings.forEach((eID) => {
          store.deleteFromRegistry(eID);
          terminatedDOMiDs.delete(eID);
        });

        DFlexIDGarbageCollector(store, new Set([parentID]));
      }
    }
  });

  terminatedDOMiDs.forEach((id) => {
    store.deleteFromRegistry(id);
  });

  if (terminatedDOMiDs.size > 0) {
    const recompose = (v: SiblingKeyVal, k: string) =>
      recomposeSiblings(store, terminatedDOMiDs, v, k);

    SKeys.forEach(recompose);
  } else if (__DEV__) {
    if (featureFlags.enableMutationDebugger) {
      // eslint-disable-next-line no-console
      console.log(`Nothing to unregister.`);
    }
  }
}

export default DFlexIDGarbageCollector;
