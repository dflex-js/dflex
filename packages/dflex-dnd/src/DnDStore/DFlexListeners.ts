import type { SerializedDFlexCoreNode } from "@dflex/core-instance";

/* eslint-disable no-unused-vars */
export type LayoutState =
  | "pending"
  | "ready"
  | "dragging"
  | "dragEnd"
  | "dragCancel";

type ElmMutationType = "destroyed" | "updated";

type ElmTransformationType = "translated" | "reordered" | "visible" | "hidden";

const layoutState = "layoutState";
const mutation = "mutation";
const transformation = "transformation";

export interface DFlexLayoutStateEvent {
  type: typeof layoutState;
  layoutState: LayoutState;
}

export interface DFlexElmMutationEvent {
  type: typeof mutation;
  mutation: ElmMutationType;
  element: SerializedDFlexCoreNode;
}

export interface DFlexElmTransformationEvent {
  type: typeof transformation;
  transformation: ElmTransformationType;
  element: SerializedDFlexCoreNode;
}

type ListenerEvents =
  | DFlexLayoutStateEvent
  | DFlexElmMutationEvent
  | DFlexElmTransformationEvent;

type ListenerTypes = ListenerEvents[keyof ListenerEvents];

type ListenerFunction = (event: ListenerEvents) => void;

type ListenersMap = Map<ListenerTypes, Set<ListenerFunction>>;

type CleanupFunction = () => void;

function subscribeLayoutState(
  listenersMap: ListenersMap,
  listener: ListenerFunction,
  type: ListenerTypes
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
  event: ListenerEvents
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
    type: ListenerTypes
  ) => CleanupFunction;
  notify: (event: ListenerEvents) => void;
  clear: (type: ListenerTypes) => void;
} {
  const listeners: ListenersMap = new Map();

  return {
    subscribe: subscribeLayoutState.bind(null, listeners),
    notify: notifyLayoutState.bind(null, listeners),
    clear: clear.bind(null, listeners),
  };
}

export type DFlexListenerPlugin = ReturnType<typeof initDFlexListeners>;

export default initDFlexListeners;
