import type DFlexDnDStore from "./DFlexDnDStore";

type ChangedIds = Set<{ oldId: string; newId: string }>;
type TerminatedDOMiDs = Set<string>;

let isProcessingMutations = false;

function getIsProcessingMutations(): boolean {
  return isProcessingMutations;
}

function cleanupBranchElements(
  store: DFlexDnDStore,
  terminatedDOMiDs: TerminatedDOMiDs
) {
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

function mutateIDs(store: DFlexDnDStore, changedIds: ChangedIds) {
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

function checkMutations(
  store: DFlexDnDStore,
  mutations: MutationRecord[],
  changedIds: ChangedIds,
  terminatedDOMiDs: TerminatedDOMiDs
) {
  for (let i = 0; i < mutations.length; i += 1) {
    const mutation = mutations[i];
    const { type, target, addedNodes, removedNodes, attributeName, oldValue } =
      mutation;

    if (target instanceof HTMLElement) {
      if (type === "childList") {
        if (addedNodes.length > 0) {
          if (__DEV__) {
            throw new Error(
              `Insertion of DOM elements is not supported outside the registry.`
            );
          }
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
  observer: MutationObserver,
  changedIds: ChangedIds,
  terminatedDOMiDs: TerminatedDOMiDs
) {
  try {
    isProcessingMutations = true;

    checkMutations(store, mutations, changedIds, terminatedDOMiDs);

    // fetch all pending mutations and clear the queue.
    const records = observer.takeRecords();

    if (records.length > 0) {
      checkMutations(store, records, changedIds, terminatedDOMiDs);
    }

    if (changedIds.size > 0) {
      mutateIDs(store, changedIds);
      changedIds.clear();
    }

    if (terminatedDOMiDs.size > 0) {
      cleanupBranchElements(store, terminatedDOMiDs);
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

function initMutationObserver(store: DFlexDnDStore, DOMTarget: HTMLElement) {
  const terminatedDOMiDs: TerminatedDOMiDs = new Set();
  const changedIds: ChangedIds = new Set();

  store.observer = new MutationObserver(
    (mutations: Array<MutationRecord>, observer: MutationObserver) => {
      DOMmutationHandler(
        store,
        mutations,
        observer,
        changedIds,
        terminatedDOMiDs
      );
    }
  );

  store.observer.observe(DOMTarget, observerConfig);
}

type DFlexLMutationPlugin = ReturnType<typeof initMutationObserver>;

export type { DFlexLMutationPlugin };

export { getIsProcessingMutations, initMutationObserver };
