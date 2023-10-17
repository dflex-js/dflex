import type { DFlexElement } from "@dflex/core-instance";

import { DFLEX_EVENTS_CAT } from "./constants";

import type {
  PayloadDragged,
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

function createDragPayload({
  id,
  index,
}: Omit<PayloadDragged, "type" | "timestamp">): PayloadDragged {
  return {
    type: DRAG_CAT,
    timestamp: Date.now(),
    id,
    index,
  };
}

export { createInteractivityPayload, createSiblingsPayload, createDragPayload };
