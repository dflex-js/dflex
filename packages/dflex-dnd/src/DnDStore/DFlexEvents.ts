import {
  DFLEX_EVENTS,
  DRAG_EVT,
  INTERACTIVITY_EVT,
  SIBLINGS_EVT,
} from "./constants";

interface DraggedEventPayload {
  /** Returns element id in the registry  */
  id: string;

  /** Returns dragged temp index */
  index: number;
}

interface InteractivityEventPayload {
  /** Returns element id in the registry  */
  id: string;

  /** Returns element current index */
  index: number;

  /** Returns the element that triggered the event  */
  target: HTMLElement;
}

interface SiblingsEventPayload {
  /** Returns the index where the dragged left  */
  from: number;

  /** Returns the last index effected of the dragged leaving/entering  */
  to: number;

  /** Returns an array of sibling ids in order  */
  siblings: Array<string>;
}

type DFlexEventPayload =
  | DraggedEventPayload
  | InteractivityEventPayload
  | SiblingsEventPayload;

/** For dragged out of threshold or container event. */
type DFlexDraggedEvent = CustomEvent<DraggedEventPayload>;

/** For dragged over an element or leaving an element. */
type DFlexInteractivityEvent = CustomEvent<InteractivityEventPayload>;

/** When dragged movement triggers the siblings up/down. */
type DFlexSiblingsEvent = CustomEvent<SiblingsEventPayload>;

/** All available DFlex events combined. */
type DFlexEvents =
  | DFlexDraggedEvent
  | DFlexInteractivityEvent
  | DFlexSiblingsEvent;

type DFlexEventsMeta = typeof DRAG_EVT &
  typeof INTERACTIVITY_EVT &
  typeof SIBLINGS_EVT;

/** Types of DFlex events. */
type DFlexEventsTypes =
  | typeof DRAG_EVT[keyof typeof DRAG_EVT]
  | typeof INTERACTIVITY_EVT[keyof typeof INTERACTIVITY_EVT]
  | typeof SIBLINGS_EVT[keyof typeof SIBLINGS_EVT];

const EVT_CONFIG = {
  bubbles: true,
  cancelable: true,
  composed: true,
};

function getEvtConfig(payload: DFlexEventPayload) {
  return Object.assign(EVT_CONFIG, { detail: payload });
}

type DispatchedSet = Set<keyof DFlexEventsMeta>;

function dispatchDFlexEvent(
  dispatcher: HTMLElement,
  dispatchedSet: DispatchedSet,
  evt: keyof DFlexEventsMeta,
  payload: DFlexEventPayload
): void {
  // Throttle the dispatched event
  if (dispatchedSet.has(evt)) return;

  const event = new CustomEvent(DFLEX_EVENTS[evt], getEvtConfig(payload));
  dispatcher.dispatchEvent(event);

  dispatchedSet.add(evt);
  setTimeout(() => dispatchedSet.delete(evt), 0);
}

function clear(dispatchedSet: DispatchedSet): void {
  if (dispatchedSet.size > 0) {
    dispatchedSet.clear();
  }
}

function initDFlexEvent(dispatcher: HTMLElement): {
  // eslint-disable-next-line no-unused-vars
  dispatch: (evt: keyof DFlexEventsMeta, payload: DFlexEventPayload) => void;
  clean: () => void;
} {
  const dispatchedSet: DispatchedSet = new Set();

  return {
    dispatch: dispatchDFlexEvent.bind(null, dispatcher, dispatchedSet),
    clean: clear.bind(null, dispatchedSet),
  };
}

type DFlexEventPlugin = ReturnType<typeof initDFlexEvent>;

export type {
  DFlexDraggedEvent,
  DFlexInteractivityEvent,
  DFlexSiblingsEvent,
  DFlexEvents,
  DFlexEventsTypes,
  DFlexEventPlugin,
};

export default initDFlexEvent;
