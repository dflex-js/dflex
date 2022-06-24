const ON_OUT_CONTAINER = "$onDragOutContainer";
const ON_OUT_THRESHOLD = "$onDragOutThreshold";
const ON_DRAG_OVER = "$onDragOver";
const ON_DRAG_LEAVE = "$onDragLeave";
const ON_LIFT_UP = "$onLiftUpSiblings";
const ON_MOVE_DOWN = "$onMoveDownSiblings";

export const DRAG_EVT = Object.freeze({
  ON_OUT_CONTAINER,
  ON_OUT_THRESHOLD,
});

export const INTERACTIVITY_EVT = Object.freeze({
  ON_DRAG_OVER,
  ON_DRAG_LEAVE,
});

export const SIBLINGS_EVT = Object.freeze({
  ON_LIFT_UP,
  ON_MOVE_DOWN,
});

export const DFLEX_EVENTS = Object.freeze({
  ...DRAG_EVT,
  ...INTERACTIVITY_EVT,
  ...SIBLINGS_EVT,
});
