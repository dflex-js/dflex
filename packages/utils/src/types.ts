export interface Rect {
  height: number;
  width: number;
  left: number;
  top: number;
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

export interface AxesCoordinatesBoolInterface
  extends AxesCoordinatesInterface<boolean> {
  /** True when one of the axes is true. */
  isOneTruthy(): boolean;
  /** Both axes are false. */
  isAllFalsy(): boolean;
}
