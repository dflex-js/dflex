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

type PayloadCommitted = {
  /** Targeted elements */
  element: HTMLElement;

  /** Indicates if the element is being dragged */
  isDragged: boolean;

  indexes: {
    /** The initial index of the moved element. */
    initial: number;

    /** The index where it was inserted in the receiving container. */
    inserted: number;
  };

  containers: {
    /** The container from which the element originated. */
    original: HTMLElement;

    /** The container where the element is now located. */
    receiving: HTMLElement;
  };
};

export type DFlexLayoutStateNotification = {
  type: typeof DFLEX_LISTENERS_CAT.LAYOUT_CAT;

  /** The current status of the layout. */
  status: LayoutState;
};

export type DFlexCommittedNotification = {
  type: typeof DFLEX_LISTENERS_CAT.COMMIT_CAT;
  payload: PayloadCommitted;
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
  | DFlexCommittedNotification
  | DFlexMutationNotification
  | DFlexErrorNotification;
