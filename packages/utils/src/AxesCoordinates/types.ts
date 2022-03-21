export interface AxesCoordinatesInterface<T = number> {
  x: T;
  y: T;
  setAxes(x: T, y: T): void;
  clone(target: AxesCoordinatesInterface<T>): void;
  isEqual(target: AxesCoordinatesInterface<T>): boolean;
}

export interface AxesCoordinatesNumInterface
  extends AxesCoordinatesInterface<number> {
  increase(x: number, y: number): void;
  decrease(x: number, y: number): void;
}

export interface AxesCoordinatesBoolInterface
  extends AxesCoordinatesInterface<boolean> {
  /** True when one of the axes is true. */
  isOneTruthy(): boolean;
  /** True if both axes are false. */
  isAllFalsy(): boolean;
  /** Set both axes to false. */
  setFalsy(): void;
}
