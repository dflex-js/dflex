export interface Dimensions {
  height: number;
  width: number;
}

export interface RectDimensions extends Dimensions {
  top: number;
  left: number;
}

export interface RectBoundaries {
  top: number;
  left: number;
  bottom: number;
  right: number;
}

export type Direction = 1 | -1;

/** Single Axis. */
export type Axis = "x" | "y";

/** Bi-directional Axis. */
export type Axes = Axis | "z";
