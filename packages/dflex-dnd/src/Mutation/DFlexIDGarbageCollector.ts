import { featureFlags } from "@dflex/utils";
import type DFlexDnDStore from "../LayoutManager/DFlexDnDStore";

export type TerminatedDOMiDs = Set<string>;

let isGarbageCollectorActive = false;

function hasGCInProgress(): boolean {
  return isGarbageCollectorActive;
}

function recomposeSiblings(
  store: DFlexDnDStore,
  terminatedDOMiDs: TerminatedDOMiDs,
  SK: string,
): string[] {
  const connectedNodesID: string[] = [];

  const siblings = store.getElmSiblingsByKey(SK);

  for (let i = 0; i < siblings.length; i += 1) {
    const elmID = siblings[i];

    if (terminatedDOMiDs.has(elmID)) {
      store.deleteFromRegistry(elmID);
    } else {
      const dflexElm = store.registry.get(elmID)!;

      const index = connectedNodesID.push(elmID) - 1;

      if (index !== dflexElm.VDOMOrder.self) {
        dflexElm.updateIndex(store.interactiveDOM.get(elmID)!, index);

        if (featureFlags.enableMutationDebugger) {
          // eslint-disable-next-line no-console
          console.log(
            `recomposeSiblings: updating index for ${elmID} to ${index}`,
          );
        }
      }
    }
  }

  return connectedNodesID;
}

function cleanupSiblings(
  store: DFlexDnDStore,
  terminatedDOMiDs: TerminatedDOMiDs,
  { BK, depth }: SiblingKeyVal,
  SK: string,
): void {
  const connectedNodesID = recomposeSiblings(store, terminatedDOMiDs, SK);

  const { DOMGen } = store;

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
      DOMGen.deleteIDFromBranch(BK, SK, depth, id);
    });

    DOMGen.mutateSiblings(SK, connectedNodesID);
  } else {
    store.cleanupSiblingsAttachments(BK, SK, depth);
    DOMGen.deleteSiblings(BK, depth);
  }
}

type SiblingKeyVal = { BK: string; depth: number };
type SKeysMap = Map<string, SiblingKeyVal>;

function groupIDsBySK(
  store: DFlexDnDStore,
  SKeys: SKeysMap,
  terminatedParentDOMiDs: TerminatedDOMiDs,
  terminatedSKs: TerminatedDOMiDs,
  id: string,
): void {
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
    // This section handles cases where DFlex receives a sequence of
    // register/unregister/register calls.
    // If an unregister is called while a registration is still active, the
    // process is postponed until the registration completes. In such cases,
    // DFlex will perform the entire registration process as a single operation.
    // Once complete, it will trigger the unregister. To prevent this situation,
    // we validate the DOM and if the element is active then we entirely bypass
    // the unregister process.
    if (DOM.isConnected) {
      if (__DEV__) {
        if (featureFlags.enableMutationDebugger) {
          // eslint-disable-next-line no-console
          console.warn(`The call is invalid. Element ${id} is still active.`);
        }
      }

      return;
    }

    if (__DEV__) {
      if (featureFlags.enableMutationDebugger) {
        // eslint-disable-next-line no-console
        console.log(`Queue ${id} to be removed from registry`);
      }
    }

    if (!SKeys.has(SK)) {
      SKeys.set(SK, { BK, depth });

      // For each siblings do:
      const parent = store.getParentByElmID(id);

      if (parent) {
        const [parentID, parentDOM] = parent;

        if (!parentDOM.isConnected) {
          if (__DEV__) {
            if (featureFlags.enableMutationDebugger) {
              // eslint-disable-next-line no-console
              console.log(
                `Parent with id: (${parentID}) will be removed from registry`,
              );
            }
          }

          terminatedParentDOMiDs.add(parentID);
          terminatedSKs.add(SK);
        }
      }
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
  const terminatedParentDOMiDs = new Set<string>();
  const terminatedSKs = new Set<string>();

  const groupBySK = (id: string) =>
    groupIDsBySK(store, SKeys, terminatedParentDOMiDs, terminatedSKs, id);

  terminatedDOMiDs.forEach(groupBySK);

  if (SKeys.size === 0) {
    if (__DEV__) {
      if (featureFlags.enableMutationDebugger) {
        // eslint-disable-next-line no-console
        console.log(
          `No elements were unregistered. Another process may have prevented elements from being unregistered.`,
        );
      }
    }

    return;
  }

  if (terminatedParentDOMiDs.size > 0) {
    if (__DEV__) {
      if (featureFlags.enableMutationDebugger) {
        // eslint-disable-next-line no-console
        console.log(
          "Ignoring Keys clean up for children as parents is going to be removed.",
        );
      }
    }

    terminatedSKs.forEach((_, SK) => {
      const siblings = store.getElmSiblingsByKey(SK);

      const id = siblings[0];

      const child = store.registry.get(id)!;

      siblings.forEach((eID) => {
        // Remove children because they will be recursively deleted when the
        // paren is going to be deleted.
        store.deleteFromRegistry(eID);
        terminatedDOMiDs.delete(eID);
      });

      // Trigger the siblings cleanup because the parent won't trigger it recursively.
      store.cleanupSiblingsAttachments(child.keys.BK, SK, child.depth);
    });

    DFlexIDGarbageCollector(store, terminatedParentDOMiDs);

    return;
  }

  const cleanup = (v: SiblingKeyVal, k: string) =>
    cleanupSiblings(store, terminatedDOMiDs, v, k);

  SKeys.forEach(cleanup);
}

function garbageCollectorProcess(
  store: DFlexDnDStore,
  terminatedDOMiDs: TerminatedDOMiDs,
) {
  try {
    isGarbageCollectorActive = true;
    DFlexIDGarbageCollector(store, terminatedDOMiDs);
  } finally {
    isGarbageCollectorActive = false;

    if (__DEV__) {
      if (featureFlags.enableMutationDebugger) {
        // eslint-disable-next-line no-console
        console.log(
          "%cGarbage Collector Process has been ended",
          "color: blue; font-weight: bold;",
        );
      }
    }
  }
}

export { garbageCollectorProcess as DFlexIDGarbageCollector, hasGCInProgress };
