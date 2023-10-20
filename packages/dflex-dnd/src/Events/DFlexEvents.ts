/* eslint-disable no-unused-vars */
/* eslint-disable no-redeclare */
import { updateDOMAttr } from "@dflex/utils";

import {
  DFLEX_EVENTS,
  DFLEX_ATTRS,
  DFLEX_EVENTS_CAT,
  DFLEX_ATTRS_STATUS,
} from "./constants";

import type {
  InteractivityEventNames,
  SiblingsEventNames,
  PayloadDragged,
  PayloadInteractivity,
  PayloadSiblings,
  DFlexEvents,
  DFlexEventNames,
  DFlexEventPayloads,
  DragAttr,
  PayloadDragMoved,
  PayloadDragCommitted,
  DragMovedEventNames,
  DragMutationEventNames,
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
    ON_COMMITTED,
    ON_TRANSFORMED,
  },
} = DFLEX_EVENTS;

const { DRAG_CAT } = DFLEX_EVENTS_CAT;

const {
  DRAG_ATTR: { OUT_CONTAINER, OUT_THRESHOLD },
} = DFLEX_ATTRS;

const { DRAG_ATTR_STATUS } = DFLEX_ATTRS_STATUS;

function domEventUpdater(
  DOM: HTMLElement,
  dflexEvent: DFlexEvents,
  eventName: DFlexEventNames,
): void {
  DOM.dispatchEvent(dflexEvent);

  const isDragMovementEvent = dflexEvent.detail.category === DRAG_CAT;

  if (!isDragMovementEvent) {
    return;
  }

  const isMutationEvent =
    eventName === ON_COMMITTED || eventName === ON_TRANSFORMED;

  if (isMutationEvent) {
    return;
  }

  switch (eventName) {
    case ON_ENTER_CONTAINER:
      // Remove attr.
      DRAG_ATTR_STATUS[OUT_CONTAINER] = false;
      updateDOMAttr<DragAttr>(DOM, OUT_CONTAINER, true);

      break;

    case ON_ENTER_THRESHOLD:
      // Remove attr.
      DRAG_ATTR_STATUS[OUT_THRESHOLD] = false;
      updateDOMAttr<DragAttr>(DOM, OUT_THRESHOLD, true);

      break;

    case ON_OUT_CONTAINER:
      DRAG_ATTR_STATUS[OUT_CONTAINER] = true;
      updateDOMAttr<DragAttr>(DOM, OUT_CONTAINER, false);
      break;

    case ON_OUT_THRESHOLD:
      DRAG_ATTR_STATUS[OUT_THRESHOLD] = true;
      updateDOMAttr<DragAttr>(DOM, OUT_THRESHOLD, false);

      break;

    default:
      if (__DEV__) {
        throw new Error(`Unexpected event name: ${eventName}`);
      }
      break;
  }
}

function dispatchDFlexEvent(
  DOM: HTMLElement,
  eventType: DragMovedEventNames,
  payload: PayloadDragMoved,
): void;

function dispatchDFlexEvent(
  DOM: HTMLElement,
  eventType: typeof DFLEX_EVENTS.DRAG_EVENT.ON_COMMITTED,
  payload: PayloadDragCommitted,
): void;

function dispatchDFlexEvent(
  DOM: HTMLElement,
  eventType: InteractivityEventNames,
  payload: PayloadInteractivity,
): void;

function dispatchDFlexEvent(
  DOM: HTMLElement,
  eventType: SiblingsEventNames,
  payload: PayloadSiblings,
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
    PayloadDragged | PayloadInteractivity | PayloadSiblings
  >(eventName, emittedEvent);

  domEventUpdater(DOM, dflexEvent, eventName);
}

function DFlexEvent(dispatcher: HTMLElement) {
  function dispatch(
    eventType: DragMovedEventNames,
    payload: PayloadDragMoved,
  ): void;

  function dispatch(
    eventType: DragMutationEventNames,
    payload: PayloadDragCommitted,
  ): void;

  function dispatch(
    eventName: InteractivityEventNames,
    payload: PayloadInteractivity,
  ): void;

  function dispatch(
    eventName: SiblingsEventNames,
    payload: PayloadSiblings,
  ): void;

  function dispatch(
    eventName: DFlexEventNames,
    payload: DFlexEventPayloads,
  ): void {
    dispatchDFlexEvent(dispatcher, eventName, payload);
  }

  /**
   * Cleans up drag-related attributes.
   * This function iterates over DRAG_ATTR_STATUS and updates corresponding DOM
   * attributes.
   */
  function cleanupAttr(): void {
    (
      Object.keys(DRAG_ATTR_STATUS) as (keyof typeof DRAG_ATTR_STATUS)[]
    ).forEach((key) => {
      if (DRAG_ATTR_STATUS[key]) {
        updateDOMAttr<DragAttr>(dispatcher, key, true);
      }
    });
  }

  return {
    dispatch,
    cleanupAttr,
  };
}

export default DFlexEvent;
