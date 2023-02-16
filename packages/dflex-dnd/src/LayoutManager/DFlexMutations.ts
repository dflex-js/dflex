import type { Keys } from "@dflex/dom-gen";
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
    const branch = store.getElmSiblingsByKey(key);

    let deletedElmKeys: Keys | null = null;
    let deletedParentIndex: number | null = null;

    for (let i = 0; i < branch.length; i += 1) {
      const elmID = branch[i];

      const elm = store.registry.get(elmID)!;

      if (terminatedDOMiDs.has(elmID)) {
        if (!deletedElmKeys) {
          deletedElmKeys = { ...elm.keys };
          deletedParentIndex = elm.VDOMOrder.parent;
        }
        store.clearElm(elmID);
      } else {
        elm.VDOMOrder.self = connectedNodesID.push(elmID) - 1;
      }
    }

    if (connectedNodesID.length > 0) {
      store.mutateSiblings(key, connectedNodesID);
    } else {
      if (__DEV__) {
        if (!(deletedElmKeys && typeof deletedParentIndex === "number")) {
          throw new Error(
            `cleanupBranchElements: deletedElmKeys is still null despite removing the entire ${key} branch.`
          );
        }
      }

      store.cleanupBranchInstances(key, deletedElmKeys!, deletedParentIndex!);
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
          if (addedNodes[0].id.includes("dflex-draggable-mirror")) {
            return;
          }

          if (__DEV__) {
            // TODO: Fix this warning.
            // if (store.registry.has(addedNodes[0].id)) {
            //   return;
            // }

            // eslint-disable-next-line no-console
            console.warn(
              "Insertion of DOM elements is not supported outside DFlex registry. Ignore this message if you are using commit()."
            );
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
