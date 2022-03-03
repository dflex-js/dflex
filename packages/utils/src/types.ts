export interface Rect {
  readonly height: number;
  readonly width: number;
  readonly left: number;
  readonly top: number;
}

export type Direction = 1 | -1;

/** How the element movement effects the siblings direction */
export interface EffectedElemDirection {
  x: Direction;
  y: Direction;
}

export type Axes = "x" | "y";
