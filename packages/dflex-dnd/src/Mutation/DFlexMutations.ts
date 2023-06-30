import { featureFlags } from "@dflex/utils";
import type DFlexDnDStore from "../LayoutManager/DFlexDnDStore";

import DFlexIdModifier, { ChangedIds } from "./DFlexIDModifier";
import DFlexIdGC, { TerminatedDOMiDs } from "./DFlexIDGarbageCollector";

let isProcessingMutations = false;

const terminatedDOMiDs: TerminatedDOMiDs = new Set();
const changedIds: ChangedIds = new Set();

function getIsProcessingMutations(): boolean {
  return isProcessingMutations;
}

function filterMutations(
  store: DFlexDnDStore,
  mutations: MutationRecord[]
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
  observer: MutationObserver
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
      if (featureFlags.enableRegisterDebugger) {
        // eslint-disable-next-line no-console
        console.log(`addObserver: ${SK}`);
      }
    }

    initMutationObserver(store, SK);
  } else if (__DEV__) {
    if (featureFlags.enableRegisterDebugger) {
      // eslint-disable-next-line no-console
      console.log(`addObserver: ${SK} already exist`);
    }
  }

  store.mutationObserverMap.get(SK)!.observe(DOMTarget, observerConfig);
}

function disconnectObservers(store: DFlexDnDStore): void {
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

function connectObservers(store: DFlexDnDStore): void {
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
