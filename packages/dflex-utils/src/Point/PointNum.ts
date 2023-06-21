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
  _increase(point: AxesPoint): this {
    this.x += point.x;
    this.y += point.y;

    return this;
  }

  _composeBox(box: AbstractBox, isInner: boolean): BoxNum {
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

  _onSameAxis(axis: Axis, point: AxesPoint): boolean {
    return axis === "y" ? point.x === this.x : point.y === this.y;
  }
}

export default PointNum;
