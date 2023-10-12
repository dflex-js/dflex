/* eslint-disable no-unused-vars */
/**
 * Drag event name constants
 */
const ON_OUT_CONTAINER = "$onDragOutContainer";
const ON_OUT_THRESHOLD = "$onDragOutThreshold";

/**
 * Interactivity event name constants
 */
const ON_DRAG_OVER = "$onDragOver";
const ON_DRAG_LEAVE = "$onDragLeave";

/**
 * Sibling event name constants
 */
const ON_LIFT_UP = "$onLiftUpSiblings";
const ON_MOVE_DOWN = "$onMoveDownSiblings";

export const DRAG_EVENT = {
  ON_OUT_CONTAINER,
  ON_OUT_THRESHOLD,
} as const;

export const INTERACTIVITY_EVENT = {
  ON_DRAG_OVER,
  ON_DRAG_LEAVE,
} as const;

export const SIBLINGS_EVENT = {
  ON_LIFT_UP,
  ON_MOVE_DOWN,
} as const;

export interface Events {
  drag: typeof DRAG_EVENT;

  interactivity: typeof INTERACTIVITY_EVENT;

  siblings: typeof SIBLINGS_EVENT;
}

export type DragEventNames = (typeof DRAG_EVENT)[keyof typeof DRAG_EVENT];

export type InteractivityEventNames =
  (typeof INTERACTIVITY_EVENT)[keyof typeof INTERACTIVITY_EVENT];

export type SiblingsEventNames =
  (typeof SIBLINGS_EVENT)[keyof typeof SIBLINGS_EVENT];

/**
 * All available DFlex event names.
 */
export type DFlexEventNames =
  | DragEventNames
  | InteractivityEventNames
  | SiblingsEventNames;

export type PayloadDraggedEvent = {
  type: "drag";
  /** Returns element id in the registry */
  id: string;
  /** Returns dragged temp index */
  index: number;
};

export type PayloadInteractivityEvent = {
  type: "interactivity";
  /** Returns element id in the registry */
  id: string;
  /** Returns element current index */
  index: number;
  /** Returns the element that triggered the event */
  target: HTMLElement;
};

export type PayloadSiblingsEvent = {
  type: "siblings";
  /** Returns the index where the dragged left */
  from: number;
  /** Returns the last index effected of the dragged leaving/entering */
  to: number;
  /** Returns an array of sibling ids in order */
  siblings: string[];
};

export type DFlexEventPayload =
  | PayloadDraggedEvent
  | PayloadInteractivityEvent
  | PayloadSiblingsEvent;

/**
 * Event fired when drag exits threshold or container.
 * Contains drag event payload.
 */
export type DFlexDraggedEvent = CustomEvent<PayloadDraggedEvent>;

/**
 * Event fired when drag enters or leaves an element.
 * Contains interactivity event payload.
 */
export type DFlexInteractivityEvent = CustomEvent<PayloadInteractivityEvent>;

/**
 * Event fired when drag triggers sibling rearrangement.
 * Contains sibling event payload.
 */
export type DFlexSiblingsEvent = CustomEvent<PayloadSiblingsEvent>;

/**
 * Union of all DFlex drag, interactivity and sibling events.
 */
export type DFlexEvents = CustomEvent<
  PayloadDraggedEvent | PayloadInteractivityEvent | PayloadSiblingsEvent
>;

export type DFlexEventsMap = {
  [K in DragEventNames]: DFlexDraggedEvent;
} & {
  [K in InteractivityEventNames]: DFlexInteractivityEvent;
} & {
  [K in SiblingsEventNames]: DFlexSiblingsEvent;
};
