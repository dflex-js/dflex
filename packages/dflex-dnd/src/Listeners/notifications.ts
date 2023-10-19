import { DFLEX_LISTENERS_CAT } from "./constants";

import {
  DFlexLayoutStateNotification,
  DFlexMutationNotification,
} from "./types";

import type DFlexListeners from "./DFlexListeners";

const { LAYOUT_CAT, MUTATION_CAT } = DFLEX_LISTENERS_CAT;

function notifyLayoutStateListeners(
  listeners: ReturnType<typeof DFlexListeners>,
  status: DFlexLayoutStateNotification["status"],
): void {
  listeners.notify({
    type: LAYOUT_CAT,
    status,
  });
}

function notifyMutationListeners(
  listeners: ReturnType<typeof DFlexListeners>,
  ids: DFlexMutationNotification["payload"]["ids"],
  target: DFlexMutationNotification["payload"]["target"],
): void {
  listeners.notify({
    type: MUTATION_CAT,
    payload: {
      ids,
      target,
    },
  });
}

export { notifyLayoutStateListeners, notifyMutationListeners };
