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

function cleanupSiblings(store: DFlexDnDStore) {
  const SKeys = new Map<string, { BK: string; depth: number }>();

  terminatedDOMiDs.forEach((id) => {
    const {
      keys: { SK, BK },
      depth,
    } = store.registry.get(id)!;

    store.removeElmFromRegistry(id);

    if (__DEV__) {
      if (featureFlags.enableObserverDebugger) {
        // eslint-disable-next-line no-console
        console.log(`cleanupSiblings: removing ${id} from registry`);
      }
    }

    if (!SKeys.has(SK)) {
      SKeys.set(SK, { BK, depth });
    }
  });

  SKeys.forEach(({ BK, depth }, SK) => {
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

          if (featureFlags.enableObserverDebugger) {
            // eslint-disable-next-line no-console
            console.log(
              `cleanupSiblings: updating index for ${elmID} to ${index}`
            );
          }
        }
      }
    }

    if (__DEV__) {
      if (featureFlags.enableObserverDebugger) {
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

function checkMutations(store: DFlexDnDStore, mutations: MutationRecord[]) {
  for (let i = 0; i < mutations.length; i += 1) {
    const mutation = mutations[i];
    const { type, target, addedNodes, removedNodes, attributeName, oldValue } =
      mutation;

    if (target instanceof HTMLElement) {
      if (type === "childList") {
        if (
          addedNodes.length > 0 &&
          addedNodes.length === 1 &&
          addedNodes[0] instanceof HTMLElement
        ) {
          const { id } = addedNodes[0];

          if (id.includes("dflex-draggable-mirror")) {
            return;
          }

          if (__DEV__) {
            setTimeout(() => {
              addedNodes.forEach((node) => {
                // TODO: Fix this warning.
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

          return;
        }

        removedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            const { id } = node;

            if (id && store.registry.has(id)) {
              terminatedDOMiDs.add(id);
            }
          }
        });
      } else if (
        type === "attributes" &&
        attributeName === "id" &&
        typeof oldValue === "string"
      ) {
        changedIds.add({ oldId: oldValue, newId: target.id });
      }
    }
  }
}

function onDOMMutation(
  store: DFlexDnDStore,
  mutations: MutationRecord[],
  observer: MutationObserver
) {
  try {
    if (__DEV__) {
      if (featureFlags.enableObserverDebugger) {
        // eslint-disable-next-line no-console
        console.log("onDOMMutation is triggered with:", mutations);
      }
    }

    isProcessingMutations = true;

    checkMutations(store, mutations);

    // fetch all pending mutations and clear the queue.
    const records = observer.takeRecords();

    if (records.length > 0) {
      checkMutations(store, records);
    }

    if (changedIds.size > 0) {
      mutateIDs(store);
      changedIds.clear();
    }

    if (terminatedDOMiDs.size > 0) {
      cleanupSiblings(store);
      terminatedDOMiDs.clear();
    }
  } finally {
    isProcessingMutations = false;
  }
}

const observerConfig = {
  childList: true,
  subtree: true,
  // attributeFilter: ["id"],
  // attributeOldValue: true,
};

if (__DEV__) {
  Object.freeze(observerConfig);
}

function addObserver(
  store: DFlexDnDStore,
  SK: string,
  DOMTarget: HTMLElement
): void {
  if (store.mutationObserverMap.has(SK)) {
    if (__DEV__) {
      if (featureFlags.enableObserverDebugger) {
        // eslint-disable-next-line no-console
        console.log(`addObserver: observe for ${SK} already exist`);
      }
    }

    return;
  }

  const observerCB = (
    mutations: MutationRecord[],
    observer: MutationObserver
  ) => onDOMMutation(store, mutations, observer);

  const observer = new MutationObserver(observerCB);

  observer.observe(DOMTarget, observerConfig);

  if (__DEV__) {
    if (featureFlags.enableObserverDebugger) {
      // eslint-disable-next-line no-console
      console.log(`addObserver: for ${SK} to observe`, DOMTarget);
    }
  }

  store.mutationObserverMap.set(SK, observer);
}

function disconnectObservers(store: DFlexDnDStore) {
  if (__DEV__) {
    if (featureFlags.enableObserverDebugger) {
      // eslint-disable-next-line no-console
      console.log("Disconnect observers");
    }
  }

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
