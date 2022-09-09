import type { Axis } from "../types";
import Box from "./Box";

class BoxBool extends Box<boolean> {
  constructor(top: boolean, right: boolean, bottom: boolean, left: boolean) {
    super(top, right, bottom, left);
    Object.seal(this);
  }

  /**
   * Reset all directions to false.
   *
   * @returns
   */
  setFalsy(): this {
    this.setBox(false, false, false, false);

    return this;
  }

  /**
   * True when one of two directions in a given axis is true.
   *
   * @param axis
   * @returns
   */
  isOneTruthyByAxis(axis: Axis): boolean {
    switch (axis) {
      case "x":
        return this.left || this.right;
      default:
        return this.top || this.bottom;
    }
  }

  /**
   * True when one of four directions is true.
   *
   * @returns
   */
  isOneTruthy(): boolean {
    return this.left || this.right || this.top || this.bottom;
  }
}

export default BoxBool;
