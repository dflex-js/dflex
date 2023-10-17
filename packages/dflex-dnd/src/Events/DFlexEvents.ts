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
  DragEventNames,
  InteractivityEventNames,
  SiblingsEventNames,
  PayloadDragged,
  PayloadInteractivity,
  PayloadSiblings,
  DFlexEvents,
  DFlexEventNames,
  DFlexEventPayloads,
  DragAttr,
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

const { DRAG_ATTR_STATUS } = DFLEX_ATTRS_STATUS;

function domEventUpdater(
  DOM: HTMLElement,
  dflexEvent: DFlexEvents,
  eventName: DFlexEventNames,
): void {
  DOM.dispatchEvent(dflexEvent);

  if (dflexEvent.detail.type === DRAG_CAT) {
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
}

function dispatchDFlexEvent(
  DOM: HTMLElement,
  eventType: DragEventNames,
  payload: PayloadDragged,
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
    eventName: InteractivityEventNames,
    payload: PayloadInteractivity,
  ): void;

  function dispatch(eventName: DragEventNames, payload: PayloadDragged): void;

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

  function cleanup(): void {
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
    cleanup,
  };
}

export default DFlexEvent;
