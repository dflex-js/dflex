import { DFLEX_LISTENERS_CAT, LayoutStates, MutationStates } from "./constants";

export type LayoutState = (typeof LayoutStates)[keyof typeof LayoutStates];

export type MutationState =
  (typeof MutationStates)[keyof typeof MutationStates];

export type DFlexLayoutStateNotification = {
  type: typeof DFLEX_LISTENERS_CAT.LAYOUT_CAT;
  status: LayoutState;
  payload?: never;
};

export type DFlexElmMutationNotification = {
  type: typeof DFLEX_LISTENERS_CAT.MUTATION_CAT;
  status: MutationState;
  payload: {
    target: HTMLElement; // HTML element container.
    ids: string[]; // Committed Elements' id in order.
  };
};

export type DFlexErrorNotification = {
  type: typeof DFLEX_LISTENERS_CAT.ERROR_CAT;
  error: Error;
};

export type DFlexListenerNotifications =
  | DFlexLayoutStateNotification
  | DFlexElmMutationNotification
  | DFlexErrorNotification;
