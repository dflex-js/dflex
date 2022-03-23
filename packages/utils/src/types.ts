export interface RectDimensions {
  top: number;
  left: number;
  height: number;
  width: number;
}

export interface RectBoundaries {
  top: number;
  left: number;
  bottom: number;
  right: number;
}

export type Direction = 1 | -1;

/** How the element movement effects the siblings direction */
export interface EffectedElemDirection {
  x: Direction;
  y: Direction;
}

export type Axis = "x" | "y";

export interface Coordinates {
  x: number;
  y: number;
}
