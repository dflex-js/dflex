/* eslint-disable no-unused-vars */

// Drag events
const ON_OUT_CONTAINER = "$onDragOutContainer";
const ON_OUT_THRESHOLD = "$onDragOutThreshold";
const ON_ENTER_CONTAINER = "$onDragEnterContainer";
const ON_ENTER_THRESHOLD = "$onDragEnterThreshold";

// Prefixed attributes
const DRAG_PREFIX = "dragged";

// DOM attributes
const OUT_CONTAINER = `${DRAG_PREFIX}-out-container`;
const OUT_THRESHOLD = `${DRAG_PREFIX}-out-threshold`;

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
  ON_ENTER_CONTAINER,
  ON_ENTER_THRESHOLD,
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

const DRAG_ATTR = {
  OUT_CONTAINER,
  OUT_THRESHOLD,
} as const;

const DRAG_ATTR_STATUS: Record<
  (typeof DRAG_ATTR)[keyof typeof DRAG_ATTR],
  boolean
> = {
  [OUT_CONTAINER]: false,
  [OUT_THRESHOLD]: false,
};

/** DFlex DOM attributes types */
const DFLEX_ATTRS = {
  DRAG_ATTR,
} as const;

const DFLEX_ATTRS_STATUS = {
  DRAG_ATTR_STATUS,
};

const { freeze, seal } = Object;

// Always freeze it.
freeze(DFLEX_EVENTS);
freeze(DFLEX_EVENTS_CAT);
freeze(DFLEX_ATTRS);

if (__DEV__) {
  seal(DFLEX_ATTRS_STATUS);
}

export { DFLEX_EVENTS, DFLEX_EVENTS_CAT, DFLEX_ATTRS, DFLEX_ATTRS_STATUS };
