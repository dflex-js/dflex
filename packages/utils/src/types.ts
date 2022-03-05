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

export interface AxesCoordinatesInterface<T = number> {
  x: T;
  y: T;
  setAxes(x: T, y: T): void;
  clone(target: AxesCoordinatesInterface<T>): void;
  isEqual(target: AxesCoordinatesInterface<T>): boolean;
}
