/* eslint-disable no-unused-vars */

import type { DFlexListenerNotifications } from "./types";

type ListenerTypes =
  DFlexListenerNotifications[keyof DFlexListenerNotifications];

type ListenerFunction = (event: DFlexListenerNotifications) => void;

type ListenersMap = Map<ListenerTypes, Set<ListenerFunction>>;

type CleanupFunction = () => void;

const eventListeners: ListenersMap = new Map();

function subscribe(
  callback: ListenerFunction,
  eventType: ListenerTypes,
): CleanupFunction {
  if (!eventListeners.has(eventType)) {
    eventListeners.set(eventType, new Set());
  }

  const listenersStateSet = eventListeners.get(eventType)!;

  listenersStateSet.add(callback);

  return () => {
    listenersStateSet.delete(callback);
  };
}

function notify(event: DFlexListenerNotifications): void {
  const { type } = event;

  const listeners = eventListeners.get(type);

  if (!listeners) {
    return;
  }

  listeners.forEach((callback) => callback(event));
}

function clear(): void {
  eventListeners.forEach((eventListenersSet) => eventListenersSet.clear());
  eventListeners.clear();
}

function DFlexListeners() {
  return {
    subscribe,
    notify,
    clear,
  };
}

export default DFlexListeners;
