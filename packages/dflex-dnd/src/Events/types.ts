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

export type PayloadDragged = {
  /** Represents the main category of the drag event. */
  type: typeof DRAG_CAT;

  /** Indicates the timestamp when the event occurred. */
  timestamp: number;

  /** Contains the unique identifier of the dragged element in the registry. */
  id: string;

  /** Indicates the temporary index of the dragged element. */
  index: number;
};

export type PayloadInteractivity = {
  /** Represents the main category of the interactivity event. */
  type: typeof INTERACTIVITY_CAT;

  /** Indicates the timestamp when the event occurred. */
  timestamp: number;

  /** Contains the unique identifier of the element in the registry. */
  id: string;

  /** Indicates the current index of the element. */
  index: number;

  /** Refers to the HTML element that triggered the event. */
  target: HTMLElement;
};

export type PayloadSiblings = {
  /** Represents the main category of the siblings event. */
  type: typeof SIBLINGS_CAT;

  /** Indicates the timestamp when the event occurred. */
  timestamp: number;

  /** Indicates the index where the dragged element left. */
  from: number;

  /**
   * Indicates the last index affected by the dragged element leaving/entering.
   * */
  to: number;

  /** Contains an ordered array of sibling IDs. */
  siblings: string[];
};

export type DFlexEventPayloads =
  | PayloadDragged
  | PayloadInteractivity
  | PayloadSiblings;

/**
 * Custom Event representing a dragged element event.
 * Triggered when drag exits/enters threshold or container.
 */
export type DFlexDraggedEvent = CustomEvent<PayloadDragged>;

/**
 * Custom Event representing an interactivity event during drag.
 * Triggered when drag enters or leaves an element.
 */
export type DFlexInteractivityEvent = CustomEvent<PayloadInteractivity>;

/**
 * Custom Event representing a sibling rearrangement event.
 * Triggered when drag triggers sibling rearrangement.
 */
export type DFlexSiblingsEvent = CustomEvent<PayloadSiblings>;

/**
 * Union type of all DFlex drag, interactivity, and sibling events.
 */
export type DFlexEvents = CustomEvent<
  PayloadDragged | PayloadInteractivity | PayloadSiblings
>;

export type DFlexEventsMap = {
  [K in DragEventNames]: DFlexDraggedEvent;
} & {
  [K in InteractivityEventNames]: DFlexInteractivityEvent;
} & {
  [K in SiblingsEventNames]: DFlexSiblingsEvent;
};
