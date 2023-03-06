import Point from "./Point";
import type AxesPoint from "./AxesPoint";
import { AbstractBox, BoxNum } from "../Box";
import type { Axis } from "../types";

class PointNum extends Point<number> {
  /**
   * Increase the current point by the given another point.
   *
   * @param point
   */
  increase(point: AxesPoint): void {
    this.x += point.x;
    this.y += point.y;
  }

  /**
   * Multiplies the point by the given value.
   *
   * @param val
   */
  // multiplyAll(val: number): void {
  //   this.x *= val;
  //   this.y *= val;
  // }

  /**
   * Gets new instance of PointNum multiplied by the given value.
   *
   * @param val
   * @returns
   */
  getMultiplied(val: number): AxesPoint {
    return { x: this.x * val, y: this.y * val };
  }

  composeBox(box: AbstractBox, isInner: boolean): BoxNum {
    const { top, left, bottom, right } = box;

    return isInner
      ? new BoxNum(top + this.y, right - this.x, bottom - this.y, left + this.x)
      : new BoxNum(
          top - this.y,
          right + this.x,
          bottom + this.y,
          left - this.x
        );
  }

  onSameAxis(axis: Axis, point: AxesPoint): boolean {
    return axis === "y" ? point.x === this.x : point.y === this.y;
  }
}

export default PointNum;
