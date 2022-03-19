export interface AbstractCoordinatesInterface<T> {
  setAxes(x: T, y: T): void;
  clone(target: AxesCoordinatesInterface<T>): void;
  isEqual(target: AxesCoordinatesInterface<T>): boolean;
}

export interface AxesCoordinatesInterface<T = number>
  extends AbstractCoordinatesInterface<T> {
  x: T;
  y: T;
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
