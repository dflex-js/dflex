/* eslint-disable no-unused-vars */
export type DFlexLayoutState =
  | "pending"
  | "ready"
  | "dragging"
  | "dragEnd"
  | "dragCancel";

export interface DFlexLayoutStateEvent {
  layoutState: DFlexLayoutState;
}

const LAYOUT_STATE = 0;

type ListenersTypes = typeof LAYOUT_STATE;
type ListenerFunction = (event: DFlexLayoutStateEvent) => void;
type ListenersMap = Map<ListenersTypes, Set<ListenerFunction>>;

function subscribeLayoutState(
  listenersMap: ListenersMap,
  listener: ListenerFunction
): () => void {
  if (!listenersMap.has(LAYOUT_STATE)) {
    listenersMap.set(LAYOUT_STATE, new Set());
  }

  const listenersStateSet = listenersMap.get(LAYOUT_STATE)!;

  listenersStateSet.add(listener);

  return () => {
    listenersStateSet.delete(listener);

    if (listenersStateSet.size === 0) {
      listenersMap.delete(LAYOUT_STATE);
    }
  };
}

function notifyLayoutState(
  listenersMap: ListenersMap,
  event: DFlexLayoutStateEvent
): void {
  if (!listenersMap.has(LAYOUT_STATE)) {
    return;
  }
  const listenersStateSet = listenersMap.get(LAYOUT_STATE)!;
  listenersStateSet.forEach((listener) => listener(event));
}

function clear(listeners: ListenersMap): void {
  listeners.forEach((listenersSet) => listenersSet.clear());
  listeners.clear();
}

function initDFlexListeners(): {
  subscribe: (listener: ListenerFunction) => () => void;
  notify: (event: DFlexLayoutStateEvent) => void;
  clear: () => void;
} {
  const listeners: ListenersMap = new Map();

  return {
    subscribe: subscribeLayoutState.bind(null, listeners),
    notify: notifyLayoutState.bind(null, listeners),
    clear: clear.bind(null, listeners),
  };
}

export default initDFlexListeners;
