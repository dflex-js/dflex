import type { DFlexElement } from "@dflex/core-instance";

import { DFLEX_EVENTS_CAT } from "./constants";

import type {
  DragMovedEventNames,
  DragMutationEventNames,
  InteractivityEventNames,
  PayloadDragCommitted,
  PayloadDragMoved,
  PayloadSiblings,
  SiblingsEventNames,
} from "./types";

import type { DFlexDnDStore } from "../LayoutManager";
import DFlexEvent from "./DFlexEvents";

const { INTERACTIVITY_CAT, SIBLINGS_CAT, DRAG_CAT } = DFLEX_EVENTS_CAT;

function emitInteractivityEvent(
  events: ReturnType<typeof DFlexEvent>,
  type: InteractivityEventNames,
  dflexELm: DFlexElement,
  store: DFlexDnDStore,
): void {
  const {
    id,
    VDOMOrder: { self: index },
  } = dflexELm;

  const target = store.interactiveDOM.get(dflexELm.id)!;

  events.dispatch(type, {
    category: INTERACTIVITY_CAT,
    timestamp: Date.now(),
    id,
    index,
    target,
  });
}

function emitSiblingsEvent(
  events: ReturnType<typeof DFlexEvent>,
  type: SiblingsEventNames,
  { from, to, siblings }: Omit<PayloadSiblings, "category" | "timestamp">,
): void {
  events.dispatch(type, {
    category: SIBLINGS_CAT,
    timestamp: Date.now(),
    from,
    to,
    siblings,
  });
}

function emitDragMovedEvent(
  events: ReturnType<typeof DFlexEvent>,
  type: DragMovedEventNames,
  { id, index }: Omit<PayloadDragMoved, "category" | "timestamp">,
): void {
  events.dispatch(type, {
    category: DRAG_CAT,
    timestamp: Date.now(),
    id,
    index,
  });
}

function emitDragCommittedEvent(
  events: ReturnType<typeof DFlexEvent>,
  type: DragMutationEventNames,
  {
    element,
    indexes,
    containers,
  }: Omit<PayloadDragCommitted, "category" | "timestamp">,
): void {
  events.dispatch(type, {
    category: DRAG_CAT,
    timestamp: Date.now(),
    containers,
    element,
    indexes,
  });
}

export {
  emitInteractivityEvent,
  emitSiblingsEvent,
  emitDragMovedEvent,
  emitDragCommittedEvent,
};
