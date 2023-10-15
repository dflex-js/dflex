/* eslint-disable no-unused-vars */
/* eslint-disable no-redeclare */
import { DFLEX_EVENTS, DFLEX_ATTRS, DFLEX_EVENTS_CAT } from "./constants";

import type {
  DragEventNames,
  InteractivityEventNames,
  SiblingsEventNames,
  PayloadDraggedEvent,
  PayloadInteractivityEvent,
  PayloadSiblingsEvent,
  DFlexEvents,
  DFlexEventNames,
  DFlexEventPayloads,
} from "./types";

const EVT_CONFIG = {
  bubbles: true,
  cancelable: true,
  composed: true,
};

const {
  DRAG_EVENT: {
    ON_ENTER_CONTAINER,
    ON_ENTER_THRESHOLD,
    ON_OUT_CONTAINER,
    ON_OUT_THRESHOLD,
  },
} = DFLEX_EVENTS;

const { DRAG_CAT } = DFLEX_EVENTS_CAT;

const {
  DRAG_ATTR: { OUT_CONTAINER, OUT_THRESHOLD },
} = DFLEX_ATTRS;

function domEventUpdater(
  DOM: HTMLElement,
  dflexEvent: DFlexEvents,
  eventName: DFlexEventNames,
): void {
  DOM.dispatchEvent(dflexEvent);

  if (dflexEvent.detail.type === DRAG_CAT) {
    switch (eventName) {
      case ON_ENTER_CONTAINER:
        DOM.removeAttribute(OUT_CONTAINER);
        break;

      case ON_ENTER_THRESHOLD:
        DOM.removeAttribute(OUT_THRESHOLD);
        break;

      case ON_OUT_CONTAINER:
        DOM.setAttribute(OUT_CONTAINER, `true`);
        break;

      case ON_OUT_THRESHOLD:
        DOM.setAttribute(OUT_THRESHOLD, `true`);
        break;

      default:
        if (__DEV__) {
          throw new Error(`Unexpected event name: ${eventName}`);
        }
        break;
    }
  }
}

function dispatchDFlexEvent(
  DOM: HTMLElement,
  eventType: DragEventNames,
  payload: PayloadDraggedEvent,
): void;

function dispatchDFlexEvent(
  DOM: HTMLElement,
  eventType: InteractivityEventNames,
  payload: PayloadInteractivityEvent,
): void;

function dispatchDFlexEvent(
  DOM: HTMLElement,
  eventType: SiblingsEventNames,
  payload: PayloadSiblingsEvent,
): void;

function dispatchDFlexEvent(
  DOM: HTMLElement,
  eventName: DFlexEventNames,
  payload: DFlexEventPayloads,
): void;

function dispatchDFlexEvent(
  DOM: HTMLElement,
  eventName: DFlexEventNames,
  payload: DFlexEventPayloads,
): void {
  const emittedEvent = Object.assign(EVT_CONFIG, { detail: payload });

  const dflexEvent: DFlexEvents = new CustomEvent<
    PayloadDraggedEvent | PayloadInteractivityEvent | PayloadSiblingsEvent
  >(eventName, emittedEvent);

  domEventUpdater(DOM, dflexEvent, eventName);
}

function DFlexEvent(dispatcher: HTMLElement) {
  function dispatch(
    eventName: InteractivityEventNames,
    payload: PayloadInteractivityEvent,
  ): void;

  function dispatch(
    eventName: DragEventNames,
    payload: PayloadDraggedEvent,
  ): void;

  function dispatch(
    eventName: SiblingsEventNames,
    payload: PayloadSiblingsEvent,
  ): void;

  function dispatch(
    eventName: DFlexEventNames,
    payload: DFlexEventPayloads,
  ): void {
    dispatchDFlexEvent(dispatcher, eventName, payload);
  }

  return {
    dispatch,
  };
}

export default DFlexEvent;
