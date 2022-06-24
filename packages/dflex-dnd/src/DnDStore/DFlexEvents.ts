/* eslint-disable no-undef */
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
export type DFlexDraggedEvent = CustomEvent<DraggedEventPayload>;

/** For dragged over an element or leaving an element. */
export type DFlexInteractivityEvent = CustomEvent<InteractivityEventPayload>;

/** When dragged movement triggers the siblings up/down. */
export type DFlexSiblingsEvent = CustomEvent<SiblingsEventPayload>;

/** All available DFlex events combined. */
export type DFlexEvents =
  | DFlexDraggedEvent
  | DFlexInteractivityEvent
  | DFlexSiblingsEvent;

type DFlexEventsMeta = typeof DRAG_EVT &
  typeof INTERACTIVITY_EVT &
  typeof SIBLINGS_EVT;

/** Types of DFlex events. */
export type DFlexEventsTypes =
  | typeof DRAG_EVT[keyof typeof DRAG_EVT]
  | typeof INTERACTIVITY_EVT[keyof typeof INTERACTIVITY_EVT]
  | typeof SIBLINGS_EVT[keyof typeof SIBLINGS_EVT];

const CONFIG = {
  bubbles: true,
  cancelable: true,
  composed: true,
};

function getConfig(payload: DFlexEventPayload) {
  return Object.assign(CONFIG, { detail: payload });
}

const dispatched = new Set<keyof DFlexEventsMeta>();

function dispatchDFlexEvent(
  dispatcher: HTMLElement,
  evt: keyof DFlexEventsMeta,
  payload: DFlexEventPayload
) {
  // Throttle the dispatched event
  if (dispatched.has(evt)) return;

  const event = new CustomEvent(DFLEX_EVENTS[evt], getConfig(payload));
  dispatcher.dispatchEvent(event);

  dispatched.add(evt);
  setTimeout(() => dispatched.delete(evt), 0);
}

function clean() {
  if (dispatched.size > 0) {
    dispatched.clear();
  }
}

function initDFlexEvent(dispatcher: HTMLElement): {
  // eslint-disable-next-line no-unused-vars
  dispatch: (evt: keyof DFlexEventsMeta, payload: DFlexEventPayload) => void;
  clean: () => void;
} {
  return {
    dispatch: dispatchDFlexEvent.bind(null, dispatcher),
    clean,
  };
}

export default initDFlexEvent;
