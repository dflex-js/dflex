/* eslint-disable no-redeclare */
/* eslint-disable no-unused-vars */
import type { DRAG_EVT, INTERACTIVITY_EVT, SIBLINGS_EVT } from "./constants";

interface PayloadDraggedEvent {
  /** Returns element id in the registry  */
  id: string;

  /** Returns dragged temp index */
  index: number;
}

interface PayloadInteractivityEvent {
  /** Returns element id in the registry  */
  id: string;

  /** Returns element current index */
  index: number;

  /** Returns the element that triggered the event  */
  target: HTMLElement;
}

interface PayloadSiblingsEvent {
  /** Returns the index where the dragged left  */
  from: number;

  /** Returns the last index effected of the dragged leaving/entering  */
  to: number;

  /** Returns an array of sibling ids in order  */
  siblings: string[];
}

type DFlexEventPayload =
  | PayloadDraggedEvent
  | PayloadInteractivityEvent
  | PayloadSiblingsEvent;

/** For dragged out of threshold or container event. */
type DFlexDraggedEvent = CustomEvent<PayloadDraggedEvent>;

/** For dragged over an element or leaving an element. */
type DFlexInteractivityEvent = CustomEvent<PayloadInteractivityEvent>;

/** When dragged movement triggers the siblings up/down. */
type DFlexSiblingsEvent = CustomEvent<PayloadSiblingsEvent>;

/** All available DFlex events combined. */
type DFlexEvents =
  | DFlexDraggedEvent
  | DFlexInteractivityEvent
  | DFlexSiblingsEvent;

type EvtDrag = typeof DRAG_EVT[keyof typeof DRAG_EVT];

type EvtInteractivity =
  typeof INTERACTIVITY_EVT[keyof typeof INTERACTIVITY_EVT];

type EvtSiblings = typeof SIBLINGS_EVT[keyof typeof SIBLINGS_EVT];

/** Types of DFlex events. */
type DFlexEventsTypes = EvtDrag | EvtInteractivity | EvtSiblings;

const EVT_CONFIG = Object.freeze({
  bubbles: true,
  cancelable: true,
  composed: true,
});

function getEvtConfig(payload: DFlexEventPayload) {
  return Object.assign(EVT_CONFIG, { detail: payload });
}

type DispatchedSet = Set<DFlexEventsTypes>;

function dispatchDFlexEvent(
  dispatcher: HTMLElement,
  dispatchedSet: DispatchedSet,
  evt: EvtDrag,
  payload: PayloadDraggedEvent
): void;

function dispatchDFlexEvent(
  dispatcher: HTMLElement,
  dispatchedSet: DispatchedSet,
  evt: EvtInteractivity,
  payload: PayloadInteractivityEvent
): void;

function dispatchDFlexEvent(
  dispatcher: HTMLElement,
  dispatchedSet: DispatchedSet,
  evt: EvtSiblings,
  payload: PayloadSiblingsEvent
): void;

function dispatchDFlexEvent(
  dispatcher: HTMLElement,
  dispatchedSet: DispatchedSet,
  evt: DFlexEventsTypes,
  payload: DFlexEventPayload
): void {
  // Throttle the dispatched event
  if (dispatchedSet.has(evt)) {
    return;
  }

  const event = new CustomEvent(evt, getEvtConfig(payload));
  dispatcher.dispatchEvent(event);

  dispatchedSet.add(evt);
  setTimeout(() => dispatchedSet.delete(evt), 0);
}

function clear(dispatchedSet: DispatchedSet): void {
  if (dispatchedSet.size > 0) {
    dispatchedSet.clear();
  }
}

type DispatchEvtDrag = (evt: EvtDrag, payload: PayloadDraggedEvent) => void;

type DispatchEvtInteractivity = (
  evt: EvtInteractivity,
  payload: PayloadInteractivityEvent
) => void;

type DispatchEvtSiblings = (
  evt: EvtSiblings,
  payload: PayloadSiblingsEvent
) => void;

type DispatchEvt = (evt: DFlexEventsTypes, payload: DFlexEventPayload) => void;

type DFlexEventPlugin = {
  dispatch: (DispatchEvtDrag | DispatchEvtSiblings | DispatchEvtInteractivity) &
    DispatchEvt;
  clean: () => void;
};

function initDFlexEvent(dispatcher: HTMLElement): DFlexEventPlugin {
  const dispatchedSet = new Set<DFlexEventsTypes>();

  const dispatch = () =>
    dispatchDFlexEvent.bind(null, dispatcher, dispatchedSet);

  return {
    dispatch,
    clean: clear.bind(null, dispatchedSet),
  };
}

export type {
  DFlexDraggedEvent,
  DFlexInteractivityEvent,
  DFlexSiblingsEvent,
  DFlexEvents,
  DFlexEventsTypes,
  DFlexEventPlugin,
};

export default initDFlexEvent;
