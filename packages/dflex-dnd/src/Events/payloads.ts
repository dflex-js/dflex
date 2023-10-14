import type { DFlexElement } from "@dflex/core-instance";

import { DFLEX_EVENTS_CAT } from "./constants";

import type {
  PayloadDraggedEvent,
  PayloadInteractivityEvent,
  PayloadSiblingsEvent,
} from "./types";

import type { DFlexDnDStore } from "../LayoutManager";

const { INTERACTIVITY_CAT, SIBLINGS_CAT, DRAG_CAT } = DFLEX_EVENTS_CAT;

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
    type: INTERACTIVITY_CAT,
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
    type: SIBLINGS_CAT,
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
    type: DRAG_CAT,
    id,
    index,
  };
}

export { createInteractivityPayload, createSiblingsPayload, createDragPayload };
