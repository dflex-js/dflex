import type { DeletedElmKeys } from "@dflex/dom-gen";
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

  let deletedElmKeys: DeletedElmKeys | null = null;

  keys.forEach((key) => {
    const branch = store.getElmBranchByKey(key);

    for (let i = 0; i < branch.length; i += 1) {
      const elmID = branch[i];

      const elm = store.registry.get(elmID)!;

      if (terminatedDOMiDs.has(elmID)) {
        if (!deletedElmKeys) {
          deletedElmKeys = { ...elm.keys, parentIndex: elm.DOMOrder.parent };
        }
        store.unregister(elmID);
      } else if (!deletedElmKeys) {
        elm.VDOMOrder.self = connectedNodesID.push(elmID) - 1;
      }
    }

    if (connectedNodesID.length > 0) {
      store.updateBranch(key, connectedNodesID);
    } else {
      store.cleanupBranchInstances(key, deletedElmKeys!);
    }
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
      elmBranch[elm.VDOMOrder.self] = idSet.newId;

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
          if (
            addedNodes.length === 1 &&
            addedNodes[0] instanceof HTMLElement &&
            addedNodes[0].id.includes("dflex-draggable-mirror")
          ) {
            return;
          }

          if (__DEV__) {
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

function initMutationObserver(store: DFlexDnDStore, SK: string) {
  const terminatedDOMiDs: TerminatedDOMiDs = new Set();
  const changedIds: ChangedIds = new Set();

  store.mutationObserverMap.set(
    SK,
    new MutationObserver(
      (mutations: MutationRecord[], observer: MutationObserver) => {
        DOMmutationHandler(
          store,
          mutations,
          observer,
          changedIds,
          terminatedDOMiDs
        );
      }
    )
  );
}

function addMutationObserver(
  store: DFlexDnDStore,
  SK: string,
  DOMTarget: HTMLElement
) {
  if (!store.mutationObserverMap.has(SK)) {
    initMutationObserver(store, SK);
  }

  store.mutationObserverMap.get(SK)!.observe(DOMTarget, observerConfig);
}

type DFlexLMutationPlugin = ReturnType<typeof addMutationObserver>;

export type { DFlexLMutationPlugin };

export { getIsProcessingMutations, addMutationObserver };
