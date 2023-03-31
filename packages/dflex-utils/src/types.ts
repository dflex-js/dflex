export interface Dimensions {
  height: number;
  width: number;
}

export type Direction = 1 | -1;

/** Single Axis. */
export type Axis = "x" | "y";

export const BOTH_AXIS: readonly Axis[] = Object.freeze(["x", "y"]);
