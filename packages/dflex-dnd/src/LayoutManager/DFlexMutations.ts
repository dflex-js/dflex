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
  const keys = new Set<string>();
  const connectedNodesID: string[] = [];

  terminatedDOMiDs.forEach((id) => {
    keys.add(store.registry.get(id)!.keys.SK);
  });

  keys.forEach((key) => {
    const siblings = store.getElmSiblingsByKey(key);

    for (let i = 0; i < siblings.length; i += 1) {
      const elmID = siblings[i];

      const elm = store.registry.get(elmID)!;

      if (terminatedDOMiDs.has(elmID)) {
        if (featureFlags.enableRegisterDebugger) {
          // eslint-disable-next-line no-console
          console.log(`cleanupSiblings: removing ${elmID} from registry`);
        }
        store.rmElmFromRegistry(elmID);
      } else {
        elm.VDOMOrder.self = connectedNodesID.push(elmID) - 1;

        if (featureFlags.enableRegisterDebugger) {
          // eslint-disable-next-line no-console
          console.log(
            `cleanupSiblings: updating index for ${elmID} to ${elm.VDOMOrder.self}`
          );
        }
      }
    }

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
      store.mutateSiblings(key, connectedNodesID);
    } else {
      store.cleanupSiblingsInstance(key, true);
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

            if (store.registry.has(id)) {
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

function DOMmutationHandler(
  store: DFlexDnDStore,
  mutations: MutationRecord[],
  observer: MutationObserver
) {
  try {
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

const observerConfig = Object.freeze({
  childList: true,
  subtree: true,
  attributeFilter: ["id"],
  attributeOldValue: true,
});

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

function addMutationObserver(
  store: DFlexDnDStore,
  SK: string,
  DOMTarget: HTMLElement
): void {
  if (!store.mutationObserverMap.has(SK)) {
    initMutationObserver(store, SK);
  }

  store.mutationObserverMap.get(SK)!.observe(DOMTarget, observerConfig);
}

type DFlexLMutationPlugin = ReturnType<typeof addMutationObserver>;

export type { DFlexLMutationPlugin };

export { getIsProcessingMutations, addMutationObserver };
