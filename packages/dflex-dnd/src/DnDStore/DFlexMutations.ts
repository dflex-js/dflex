import store from "./DnDStoreImp";
import type { IDnDStore } from "./types";

type ChangedIds = Set<{ oldId: string; newId: string }>;

let isProcessingMutations = false;

const terminatedDOMiDs = new Set<string>();
const changedIds: ChangedIds = new Set();

export function getIsProcessingMutations(): boolean {
  return isProcessingMutations;
}

function cleanupBranchElements() {
  const keys = new Set<string>();
  const connectedNodesID: string[] = [];

  terminatedDOMiDs.forEach((id) => {
    keys.add(store.registry.get(id)!.keys.SK);
  });

  keys.forEach((key) => {
    const branch = store.getElmBranchByKey(key);

    for (let i = 0; i < branch.length; i += 1) {
      const elmID = branch[i];

      const elm = store.registry.get(elmID)!;

      if (terminatedDOMiDs.has(elmID)) {
        store.unregister(elmID);
      } else {
        elm.order.self = connectedNodesID.push(elmID) - 1;
      }
    }

    store.updateBranch(key, connectedNodesID);
  });
}

function mutateIDs() {
  changedIds.forEach((idSet) => {
    if (store.registry.has(idSet.oldId)) {
      const elm = store.registry.get(idSet.oldId)!;
      const elmBranch = store.getElmBranchByKey(elm.keys.SK);

      // Update registry.
      store.registry.set(idSet.newId, elm);
      store.registry.delete(idSet.oldId);

      // Update DOM-gen branch.
      elmBranch[elm.order.self] = idSet.newId;

      // Update instance.
      // @ts-ignore
      elm.id = idSet.newId;
    }
  });
}

function checkMutations(mutations: MutationRecord[]) {
  for (let i = 0; i < mutations.length; i += 1) {
    const mutation = mutations[i];
    const { type, target, addedNodes, removedNodes, attributeName, oldValue } =
      mutation;

    if (target instanceof HTMLElement) {
      if (type === "childList") {
        if (addedNodes.length > 0) {
          throw new Error(
            `Insertion of DOM elements is not supported outside the registry.`
          );
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
  mutations: MutationRecord[],
  observer: MutationObserver
) {
  try {
    isProcessingMutations = true;

    checkMutations(mutations);

    // fetch all pending mutations and clear the queue.
    const records = observer.takeRecords();

    if (records.length > 0) {
      checkMutations(records);
    }

    if (changedIds.size > 0) {
      mutateIDs();
      changedIds.clear();
    }

    if (terminatedDOMiDs.size > 0) {
      cleanupBranchElements();
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

export function initMutationObserver(
  storeInstance: IDnDStore,
  DOMTarget: HTMLElement
) {
  storeInstance.observer = new MutationObserver(
    (mutations: Array<MutationRecord>, observer: MutationObserver) => {
      DOMmutationHandler(mutations, observer);
    }
  );

  storeInstance.observer.observe(DOMTarget, observerConfig);
}
