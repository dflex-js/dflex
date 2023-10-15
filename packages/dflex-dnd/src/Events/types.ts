import { DFLEX_EVENTS, DFLEX_EVENTS_CAT, DFLEX_ATTRS } from "./constants";

const { DRAG_EVENT, INTERACTIVITY_EVENT, SIBLINGS_EVENT } = DFLEX_EVENTS;
const { DRAG_CAT, INTERACTIVITY_CAT, SIBLINGS_CAT } = DFLEX_EVENTS_CAT;
const { DRAG_ATTR } = DFLEX_ATTRS;

export type DragEventNames = (typeof DRAG_EVENT)[keyof typeof DRAG_EVENT];

export type InteractivityEventNames =
  (typeof INTERACTIVITY_EVENT)[keyof typeof INTERACTIVITY_EVENT];

export type SiblingsEventNames =
  (typeof SIBLINGS_EVENT)[keyof typeof SIBLINGS_EVENT];

export type DragAttr = (typeof DRAG_ATTR)[keyof typeof DRAG_ATTR];

/**
 * All available DFlex event names.
 */
export type DFlexEventNames =
  | DragEventNames
  | InteractivityEventNames
  | SiblingsEventNames;

export type PayloadDraggedEvent = {
  type: typeof DRAG_CAT;
  /** Returns element id in the registry */
  id: string;
  /** Returns dragged temp index */
  index: number;
};

export type PayloadInteractivityEvent = {
  type: typeof INTERACTIVITY_CAT;
  /** Returns element id in the registry */
  id: string;
  /** Returns element current index */
  index: number;
  /** Returns the element that triggered the event */
  target: HTMLElement;
};

export type PayloadSiblingsEvent = {
  type: typeof SIBLINGS_CAT;
  /** Returns the index where the dragged left */
  from: number;
  /** Returns the last index effected of the dragged leaving/entering */
  to: number;
  /** Returns an array of sibling ids in order */
  siblings: string[];
};

export type DFlexEventPayloads =
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
