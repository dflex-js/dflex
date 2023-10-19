import type { DFlexElement } from "@dflex/core-instance";

import { DFLEX_EVENTS_CAT } from "./constants";

import type {
  PayloadDragMoved,
  PayloadDragCommitted,
  PayloadInteractivity,
  PayloadSiblings,
} from "./types";

import type { DFlexDnDStore } from "../LayoutManager";

const { INTERACTIVITY_CAT, SIBLINGS_CAT, DRAG_CAT } = DFLEX_EVENTS_CAT;

function createInteractivityPayload(
  dflexELm: DFlexElement,
  store: DFlexDnDStore,
): PayloadInteractivity {
  const {
    id,
    VDOMOrder: { self: index },
  } = dflexELm;

  const target = store.interactiveDOM.get(dflexELm.id)!;

  return {
    type: INTERACTIVITY_CAT,
    timestamp: Date.now(),
    id,
    index,
    target,
  };
}

function createSiblingsPayload({
  from,
  to,
  siblings,
}: Omit<PayloadSiblings, "type" | "timestamp">): PayloadSiblings {
  return {
    type: SIBLINGS_CAT,
    timestamp: Date.now(),
    from,
    to,
    siblings,
  };
}

function createDragMovedPayload({
  id,
  index,
}: Omit<PayloadDragMoved, "type" | "timestamp">): PayloadDragMoved {
  return {
    type: DRAG_CAT,
    timestamp: Date.now(),
    id,
    index,
  };
}

function createDragCommittedPayload({
  element,
  indexes,
  containers,
}: Omit<PayloadDragCommitted, "type" | "timestamp">): PayloadDragCommitted {
  console.log({
    type: DRAG_CAT,
    timestamp: Date.now(),
    containers,
    element,
    indexes,
  });
  return {
    type: DRAG_CAT,
    timestamp: Date.now(),
    containers,
    element,
    indexes,
  };
}

export {
  createInteractivityPayload,
  createSiblingsPayload,
  createDragMovedPayload,
  createDragCommittedPayload,
};
