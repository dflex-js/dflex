export interface Dimensions {
  height: number;
  width: number;
}

export interface RectDimensions extends Dimensions {
  top: number;
  left: number;
}

export type Direction = 1 | -1;

/** Single Axis. */
export type Axis = "x" | "y";

/** Bi-directional Axis. */
export type Axes = Axis | "z";
