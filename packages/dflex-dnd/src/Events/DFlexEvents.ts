/* eslint-disable no-unused-vars */
/* eslint-disable no-redeclare */
import {
  DragEventNames,
  InteractivityEventNames,
  SiblingsEventNames,
  PayloadDraggedEvent,
  PayloadInteractivityEvent,
  PayloadSiblingsEvent,
  DFlexEvents,
  DFlexEventNames,
  DFlexEventPayload,
} from "./constants";

const EVT_CONFIG = {
  bubbles: true,
  cancelable: true,
  composed: true,
};

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
  payload: DFlexEventPayload,
): void;

function dispatchDFlexEvent(
  DOM: HTMLElement,
  eventName: DFlexEventNames,
  payload: DFlexEventPayload,
): void {
  const emittedEvent = Object.assign(EVT_CONFIG, { detail: payload });

  if (__DEV__) {
    Object.freeze(emittedEvent);
  }

  const event: DFlexEvents = new CustomEvent<
    PayloadDraggedEvent | PayloadInteractivityEvent | PayloadSiblingsEvent
  >(eventName, {
    detail: payload,
  });

  DOM.dispatchEvent(event);
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
    payload: DFlexEventPayload,
  ): void {
    dispatchDFlexEvent(dispatcher, eventName, payload);
  }

  return {
    dispatch,
  };
}

export default DFlexEvent;
