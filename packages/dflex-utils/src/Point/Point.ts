import AxesPoint from "./AxesPoint";

class Point<T> extends AxesPoint<T> {
  /**
   * Assigns the given values to the local instance.
   *
   * @param x
   * @param y
   */
  setAxes(x: T, y: T): void {
    this.x = x;
    this.y = y;
  }

  /**
   * Clone a given point into local instance.
   *
   * @param target
   */
  clone(target: Point<T> | AxesPoint<T>): void {
    this.setAxes(target.x, target.y);
  }

  /**
   * Get local instance of point.
   *
   * @returns
   */
  getInstance(): AxesPoint<T> {
    return {
      x: this.x,
      y: this.y,
    };
  }

  /**
   *  True when both axes match the same value.
   *
   * @param target
   * @returns
   */
  isInstanceEqual(target: Point<T> | AxesPoint<T>): boolean {
    return this.x === target.x && this.y === target.y;
  }

  /**
   * True when both axes match the same value.
   *
   * @param x
   * @param y
   * @returns
   */
  isEqual(x: T, y: T): boolean {
    return this.x === x && this.y === y;
  }

  /**
   * True when both axes doesn't match the given value.
   *
   * @param x
   * @param y
   * @returns
   */
  isNotEqual(x: T, y: T): boolean {
    return this.x !== x || this.y !== y;
  }
}

export default Point;
