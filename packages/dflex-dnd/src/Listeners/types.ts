import { DFLEX_LISTENERS_CAT, LayoutStates } from "./constants";

export type LayoutState = (typeof LayoutStates)[keyof typeof LayoutStates];

type PayloadMutation = {
  /**
   * Represents the container where the element is now located after the
   * mutation.
   * */
  target: HTMLElement;

  /**
   * Contains an ordered list of IDs representing the committed elements.
   * These IDs are listed in the sequence in which the elements were committed.
   */
  ids: string[];
};

export type DFlexLayoutStateNotification = {
  type: typeof DFLEX_LISTENERS_CAT.LAYOUT_CAT;

  /** The current status of the layout. */
  status: LayoutState;
};

export type DFlexMutationNotification = {
  type: typeof DFLEX_LISTENERS_CAT.MUTATION_CAT;
  payload: PayloadMutation;
};

export type DFlexErrorNotification = {
  type: typeof DFLEX_LISTENERS_CAT.ERROR_CAT;
  error: Error;
};

export type DFlexListenerNotifications =
  | DFlexLayoutStateNotification
  | DFlexMutationNotification
  | DFlexErrorNotification;
