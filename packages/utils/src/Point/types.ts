/** X/Y object without the class instance. */
export interface IPointAxes<T = number> {
  x: T;
  y: T;
}
export interface IPoint<T = number> {
  x: T;
  y: T;
  setAxes(x: T, y: T): void;
  clone(target: IPointAxes<T>): void;
  getInstance(): IPointAxes<T>;
  isEqual(target: IPointAxes<T>): boolean;
}

export interface IPointNum extends IPoint<number> {
  increase(point: IPointAxes): void;
  decrease(point: IPointAxes): void;
  multiplyAll(val: number): void;

  /** Multiply the value with instance and return the result without mutation. */
  getMultiplied(val: number): IPointAxes;
}

export interface IPointBool extends IPoint<boolean> {
  /** True when one of the axes is true. */
  isOneTruthy(): boolean;
  /** True if both axes are false. */
  isAllFalsy(): boolean;
  /** Set both axes to false. */
  setFalsy(): void;
}
