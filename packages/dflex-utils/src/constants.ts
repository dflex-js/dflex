export const AXIS = Object.freeze({
  X: "x",
  Y: "y",
});

export type Axis = (typeof AXIS)[keyof typeof AXIS];

/** Bi-directional Axis. */
export type Axes = Axis | "z";
