export interface IPoint<T = number> {
  x: T;
  y: T;
  setAxes(x: T, y: T): void;
  clone(target: IPoint<T>): void;
  isEqual(target: IPoint<T>): boolean;
}

export interface IPointNum extends IPoint<number> {
  increase(x: number, y: number): void;
  decrease(x: number, y: number): void;
  multiplyAll(value: number): void;
}

export interface IPointBool extends IPoint<boolean> {
  /** True when one of the axes is true. */
  isOneTruthy(): boolean;
  /** True if both axes are false. */
  isAllFalsy(): boolean;
  /** Set both axes to false. */
  setFalsy(): void;
}
