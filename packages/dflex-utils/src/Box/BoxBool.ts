import type { Axis, Direction } from "../types";
import Box from "./Box";

class BoxBool extends Box<boolean> {
  constructor(top: boolean, right: boolean, bottom: boolean, left: boolean) {
    super(top, right, bottom, left);

    if (__DEV__) {
      Object.seal(this);
    }
  }

  /**
   * Reset all directions to false.
   *
   * @returns
   */
  _setFalsy(): this {
    this._setBox(false, false, false, false);

    return this;
  }

  /**
   * True when one of two directions in a given axis is true.
   *
   * @param axis
   * @returns
   */
  _isTruthyByAxis(axis: Axis): boolean {
    switch (axis) {
      case "x":
        return this.left || this.right;
      default:
        return this.top || this.bottom;
    }
  }

  _isTruthyOnSide(axis: Axis, direction: Direction) {
    switch (axis) {
      case "x":
        return direction === 1 ? this.right : this.left;
      default:
        return direction === 1 ? this.bottom : this.top;
    }
  }

  /**
   * True when one of four directions is true.
   *
   * @returns
   */
  _isTruthy(): boolean {
    return this.left || this.right || this.top || this.bottom;
  }
}

export default BoxBool;
