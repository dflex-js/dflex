/* eslint-disable no-unused-vars */

type LayoutState =
  | "pending" // when DnD is initiated but not activated yet.
  | "ready" // When clicking over the registered element. The element is ready but not being dragged.
  | "dragging" // as expected.
  | "dragEnd" // as expected.
  | "dragCancel"; // When releasing the drag without settling in the new position.

type ElmMutationType = "committed";

type ElmTransformationType = "transformed" | "reordered" | "visible" | "hidden";

interface DFlexLayoutStateEvent {
  type: "layoutState";
  status: LayoutState;
  payload?: never;
}

interface DFlexElmMutationEvent {
  type: "mutation";
  status: ElmMutationType;
  payload: {
    target: HTMLElement; // HTML element container.
    ids: string[]; // Committed Elements' id in order.
  };
}

// This feature is not implemented yet.
interface DFlexElmTransformationEvent {
  type: "transformation";
  status: ElmTransformationType;
  payload: {
    id: string;
  };
}

interface DFlexErrorEvent {
  type: "error";
  error: Error;
}

type DFlexListenerEvents =
  | DFlexLayoutStateEvent
  | DFlexElmMutationEvent
  | DFlexElmTransformationEvent
  | DFlexErrorEvent;

type ListenerTypes = DFlexListenerEvents[keyof DFlexListenerEvents];

type ListenerFunction = (event: DFlexListenerEvents) => void;

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
  event: DFlexListenerEvents,
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
  notify: (event: DFlexListenerEvents) => void;
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
  DFlexListenerEvents,
  DFlexLayoutStateEvent,
  DFlexElmMutationEvent,
  DFlexElmTransformationEvent,
  DFlexListenerPlugin,
};

export default initDFlexListeners;
