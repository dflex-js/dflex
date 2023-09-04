import { featureFlags } from "@dflex/utils";
import type DFlexDnDStore from "../LayoutManager/DFlexDnDStore";

import DFlexIdModifier, { ChangedIds } from "./DFlexIDModifier";
import DFlexIdGC, { TerminatedDOMiDs } from "./DFlexIDGarbageCollector";

let isProcessingMutations = false;

const terminatedDOMiDs: TerminatedDOMiDs = new Set();
const changedIds: ChangedIds = new Set();

function hasMutationsInProgress(): boolean {
  return isProcessingMutations;
}

function filterMutations(
  store: DFlexDnDStore,
  mutations: MutationRecord[],
): void {
  for (let i = 0; i < mutations.length; i += 1) {
    const mutation = mutations[i];
    const { type, target, removedNodes, attributeName, oldValue } = mutation;

    if (target instanceof HTMLElement) {
      if (type === "childList") {
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

function DOMmutationHandler(
  store: DFlexDnDStore,
  mutations: MutationRecord[],
  observer: MutationObserver,
): void {
  try {
    isProcessingMutations = true;

    filterMutations(store, mutations);

    // fetch all pending mutations and clear the queue.
    const records = observer.takeRecords();

    if (records.length > 0) {
      filterMutations(store, records);
    }

    if (changedIds.size > 0) {
      DFlexIdModifier(store, changedIds);
      changedIds.clear();
    }

    if (terminatedDOMiDs.size > 0) {
      DFlexIdGC(store, terminatedDOMiDs);
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

function initMutationObserver(store: DFlexDnDStore, SK: string): void {
  store.mutationObserverMap.set(
    SK,
    new MutationObserver(
      (mutations: MutationRecord[], observer: MutationObserver) => {
        DOMmutationHandler(store, mutations, observer);
      },
    ),
  );
}

function addObserver(
  store: DFlexDnDStore,
  id: string,
  DOMTarget: HTMLElement,
): void {
  if (!store.mutationObserverMap.has(id)) {
    initMutationObserver(store, id);

    if (__DEV__) {
      if (featureFlags.enableRegisterDebugger) {
        // eslint-disable-next-line no-console
        console.log(`addObserver: ${id}`);
      }
    }
  } else if (__DEV__) {
    if (featureFlags.enableRegisterDebugger) {
      // eslint-disable-next-line no-console
      console.log(`addObserver: ${id} already exist`);
    }
  }

  store.mutationObserverMap.get(id)!.observe(DOMTarget, observerConfig);
}

function disconnectObservers(store: DFlexDnDStore): void {
  store.mutationObserverMap.forEach((observer, id) => {
    if (__DEV__) {
      if (!observer) {
        throw new Error(
          `disconnectObservers: unable to find observer for id: ${id}`,
        );
      }
    }

    observer!.disconnect();
  });
}

function connectObservers(store: DFlexDnDStore): void {
  store.mutationObserverMap.forEach((_, id) => {
    const DOM = store.interactiveDOM.get(id)!;

    if (__DEV__) {
      if (!DOM) {
        throw new Error(`connectObservers: unable to find DOM for id: ${id}`);
      }
    }

    addObserver(store, id, DOM);
  });
}

type DFlexLMutationPlugin = ReturnType<typeof addObserver>;

export type { DFlexLMutationPlugin };

export {
  hasMutationsInProgress,
  addObserver,
  disconnectObservers,
  connectObservers,
};
