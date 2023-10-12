import type { DFlexElement } from "@dflex/core-instance";

import { EVENT_TYPES } from "./constants";

import type {
  PayloadDraggedEvent,
  PayloadInteractivityEvent,
  PayloadSiblingsEvent,
} from "./constants";

import type { DFlexDnDStore } from "../LayoutManager";

const { INTERACTIVITY_EVENT, SIBLINGS_EVENT, DRAG_EVENT } = EVENT_TYPES;

function createInteractivityPayload(
  dflexELm: DFlexElement,
  store: DFlexDnDStore,
): PayloadInteractivityEvent {
  const {
    id,
    VDOMOrder: { self: index },
  } = dflexELm;

  const target = store.interactiveDOM.get(dflexELm.id)!;

  return {
    type: INTERACTIVITY_EVENT,
    id,
    index,
    target,
  };
}

function createSiblingsPayload({
  from,
  to,
  siblings,
}: Omit<PayloadSiblingsEvent, "type">): PayloadSiblingsEvent {
  return {
    type: SIBLINGS_EVENT,
    from,
    to,
    siblings,
  };
}

function createDragPayload({
  id,
  index,
}: Omit<PayloadDraggedEvent, "type">): PayloadDraggedEvent {
  return {
    type: DRAG_EVENT,
    id,
    index,
  };
}

export { createInteractivityPayload, createSiblingsPayload, createDragPayload };
