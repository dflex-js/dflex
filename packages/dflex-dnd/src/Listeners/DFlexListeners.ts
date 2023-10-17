/* eslint-disable no-unused-vars */

import type {
  DFlexListenerNotifications,
  DFlexLayoutStateNotification,
  DFlexElmMutationNotification as DFlexMutationNotification,
} from "./types";

type ListenerTypes =
  DFlexListenerNotifications[keyof DFlexListenerNotifications];

type ListenerFunction = (event: DFlexListenerNotifications) => void;

type ListenersMap = Map<ListenerTypes, Set<ListenerFunction>>;

type CleanupFunction = () => void;

function subscribeLayoutState(
  listenersMap: ListenersMap,
  listener: ListenerFunction,
  type: ListenerTypes,
): CleanupFunction {
  if (!listenersMap.has(type)) {
    listenersMap.set(type, new Set());
  }

  const listenersStateSet = listenersMap.get(type)!;

  listenersStateSet.add(listener);

  return () => {
    listenersStateSet.delete(listener);

    if (listenersStateSet.size === 0) {
      listenersMap.delete(type);
    }
  };
}

function notifyLayoutState(
  listenersMap: ListenersMap,
  event: DFlexListenerNotifications,
): void {
  if (!listenersMap.has(event.type)) {
    return;
  }
  const listenersStateSet = listenersMap.get(event.type)!;
  listenersStateSet.forEach((listener) => listener(event));
}

function clear(listeners: ListenersMap): void {
  listeners.forEach((listenersSet) => listenersSet.clear());
  listeners.clear();
}

function initDFlexListeners(): {
  subscribe: (
    listener: ListenerFunction,
    type: ListenerTypes,
  ) => CleanupFunction;
  notify: (event: DFlexListenerNotifications) => void;
  clear: () => void;
} {
  const listeners: ListenersMap = new Map();

  return {
    subscribe: subscribeLayoutState.bind(null, listeners),
    notify: notifyLayoutState.bind(null, listeners),
    clear: clear.bind(null, listeners),
  };
}

type DFlexListenerPlugin = ReturnType<typeof initDFlexListeners>;

export type {
  DFlexListenerNotifications,
  DFlexLayoutStateNotification,
  DFlexMutationNotification,
  DFlexListenerPlugin,
};

export default initDFlexListeners;
