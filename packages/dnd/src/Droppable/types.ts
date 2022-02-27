/** Negative for up and right */
export type Direction = 1 | -1;

export type Axes = "x" | "y";

export interface EffectedElemDirection {
  x: Direction;
  y: Direction;
}

export interface DistanceCalculatorInterface {}
