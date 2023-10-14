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

const DRAG_EVENT = {
  ON_OUT_CONTAINER,
  ON_OUT_THRESHOLD,
} as const;

const INTERACTIVITY_EVENT = {
  ON_DRAG_OVER,
  ON_DRAG_LEAVE,
} as const;

const SIBLINGS_EVENT = {
  ON_LIFT_UP,
  ON_MOVE_DOWN,
} as const;

/** DFlex events types */
const DFLEX_EVENTS = {
  DRAG_EVENT,
  INTERACTIVITY_EVENT,
  SIBLINGS_EVENT,
} as const;

/** DFlex events categories */
const DFLEX_EVENTS_CAT = {
  DRAG_CAT: "drag",
  INTERACTIVITY_CAT: "interactivity",
  SIBLINGS_CAT: "siblings",
} as const;

const { freeze } = Object;

// Always freeze it.
freeze(DFLEX_EVENTS);
freeze(DFLEX_EVENTS_CAT);

export { DFLEX_EVENTS, DFLEX_EVENTS_CAT };
