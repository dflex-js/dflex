import { featureFlags } from "@dflex/utils";
import type DFlexDnDStore from "./DFlexDnDStore";

type ChangedIds = Set<{ oldId: string; newId: string }>;
type TerminatedDOMiDs = Set<string>;

let isProcessingMutations = false;
const terminatedDOMiDs: TerminatedDOMiDs = new Set();
const changedIds: ChangedIds = new Set();

function getIsProcessingMutations(): boolean {
  return isProcessingMutations;
}

function cleanupLeaves(store: DFlexDnDStore, SK: string) {
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

        if (featureFlags.enableMutationDebugger) {
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
  SK: string,
  BK: string,
  depth: number
) {
  const [connectedNodesID, deletedNodesID] = cleanupLeaves(store, SK);

  if (__DEV__) {
    if (featureFlags.enableMutationDebugger) {
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
      store.DOMGen.removeIDFromBranch(id, BK);
    });

    return;
  }

  // All has been deleted.
  store.DOMGen.destroySiblings(SK, BK, depth);
  store.disposeContainers(SK);
}

function cleanupIDs(store: DFlexDnDStore) {
  const SKeys = new Map<string, { BK: string; depth: number }>();

  terminatedDOMiDs.forEach((id) => {
    const {
      keys: { SK, BK },
      depth,
    } = store.registry.get(id)!;

    store.unregister(id);

    if (__DEV__) {
      if (featureFlags.enableMutationDebugger) {
        // eslint-disable-next-line no-console
        console.log(
          `cleanupIDs: removing ${id} from registry and interactiveDOM`
        );
      }
    }

    if (!SKeys.has(SK)) {
      SKeys.set(SK, { BK, depth });
    }
  });

  SKeys.forEach(({ BK, depth }, SK) => {
    cleanupSiblings(store, SK, BK, depth);
  });
}

// Needs refactoring and testing.
function mutateIDs(store: DFlexDnDStore) {
  changedIds.forEach((idSet) => {
    if (store.registry.has(idSet.oldId)) {
      const elm = store.registry.get(idSet.oldId)!;
      const elmBranch = store.getElmSiblingsByKey(elm.keys.SK);

      // Update registry.
      store.registry.set(idSet.newId, elm);
      store.registry.delete(idSet.oldId);

      // Update DOM-gen branch.
      elmBranch[elm.VDOMOrder.self] = idSet.newId;

      // Update instance.
      // @ts-ignore
      elm.id = idSet.newId;
    }
  });
}

function filterChildListMutation(
  store: DFlexDnDStore,
  addedNodes: NodeList,
  removedNodes: NodeList
) {
  if (__DEV__) {
    if (
      addedNodes.length > 0 &&
      addedNodes.length === 1 &&
      addedNodes[0] instanceof HTMLElement
    ) {
      const { id } = addedNodes[0];

      if (id.includes("dflex-draggable-mirror")) {
        return;
      }

      if (featureFlags.enableMutationDebugger) {
        // eslint-disable-next-line no-console
        console.log(`Insertion of new DOM elements ${id} is detected.`);
      }

      setTimeout(() => {
        addedNodes.forEach((node) => {
          if (!store.registry.has((node as HTMLElement).id)) {
            // eslint-disable-next-line no-console
            console.error(
              // @ts-ignore
              `Insertion of DOM elements is not supported outside DFlex registry ${node.id}`
            );
          }
        });
      }, 0);
    }
  }

  if (removedNodes.length === 0) {
    return;
  }

  if (__DEV__) {
    if (featureFlags.enableMutationDebugger) {
      // eslint-disable-next-line no-console
      console.log(`observer received: ${removedNodes.length} removed nodes.`);
    }
  }

  removedNodes.forEach((node) => {
    if (node instanceof HTMLElement) {
      const { id } = node;

      if (id && store.registry.has(id)) {
        terminatedDOMiDs.add(id);
      }
    }
  });
}

function filterMutations(store: DFlexDnDStore, mutations: MutationRecord[]) {
  for (let i = 0; i < mutations.length; i += 1) {
    const mutation = mutations[i];

    const { type, target, addedNodes, removedNodes, attributeName, oldValue } =
      mutation;

    if (target instanceof HTMLElement) {
      if (type === "childList") {
        filterChildListMutation(store, addedNodes, removedNodes);

        return;
      }

      const isIdAttributeMutation =
        type === "attributes" &&
        attributeName === "id" &&
        typeof oldValue === "string";

      if (isIdAttributeMutation) {
        changedIds.add({ oldId: oldValue, newId: target.id });
      }
    }
  }
}

function DOMmutationHandler(
  store: DFlexDnDStore,
  mutations: MutationRecord[],
  observer: MutationObserver
) {
  try {
    isProcessingMutations = true;

    filterMutations(store, mutations);

    // fetch all pending mutations and clear the queue.
    const records = observer.takeRecords();

    if (records.length > 0) {
      filterMutations(store, records);
    }

    if (changedIds.size > 0) {
      mutateIDs(store);
      changedIds.clear();
    }

    if (terminatedDOMiDs.size > 0) {
      cleanupIDs(store);
      terminatedDOMiDs.clear();
    }
  } finally {
    isProcessingMutations = false;
  }
}

const observerConfig = {
  childList: true,
  subtree: true,
  attributeFilter: ["id"],
  attributeOldValue: true,
};

if (__DEV__) {
  Object.freeze(observerConfig);
}

function initMutationObserver(store: DFlexDnDStore, SK: string) {
  store.mutationObserverMap.set(
    SK,
    new MutationObserver(
      (mutations: MutationRecord[], observer: MutationObserver) => {
        DOMmutationHandler(store, mutations, observer);
      }
    )
  );
}

function addObserver(
  store: DFlexDnDStore,
  SK: string,
  DOMTarget: HTMLElement
): void {
  if (!store.mutationObserverMap.has(SK)) {
    if (__DEV__) {
      if (featureFlags.enableMutationDebugger) {
        // eslint-disable-next-line no-console
        console.log(`addObserver: ${SK}`);
      }
    }

    initMutationObserver(store, SK);
  } else if (__DEV__) {
    if (featureFlags.enableMutationDebugger) {
      // eslint-disable-next-line no-console
      console.log(`addObserver: ${SK} already exist`);
    }
  }

  store.mutationObserverMap.get(SK)!.observe(DOMTarget, observerConfig);
}

function disconnectObservers(store: DFlexDnDStore) {
  store.mutationObserverMap.forEach((observer, key) => {
    if (__DEV__) {
      if (!observer) {
        throw new Error(
          `disconnectObservers: unable to find observer for key: ${key}`
        );
      }
    }

    observer!.disconnect();
  });
}

function connectObservers(store: DFlexDnDStore) {
  store.mutationObserverMap.forEach((_, key) => {
    const DOM = store.interactiveDOM.get(key)!;

    if (__DEV__) {
      if (!DOM) {
        throw new Error(`connectObservers: unable to find DOM for key: ${key}`);
      }
    }

    addObserver(store, key, DOM);
  });
}

type DFlexLMutationPlugin = ReturnType<typeof addObserver>;

export type { DFlexLMutationPlugin };

export {
  getIsProcessingMutations,
  addObserver,
  disconnectObservers,
  connectObservers,
};
