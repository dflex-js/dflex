import Point from "./Point";
import type { IPointAxes } from "./types";

class PointNum extends Point<number> {
  increase(point: IPointAxes) {
    this.x += point.x;
    this.y += point.y;
  }

  decrease(point: IPointAxes) {
    this.x -= point.x;
    this.y -= point.y;
  }

  multiplyAll(val: number) {
    this.x *= val;
    this.y *= val;
  }

  getMultiplied(val: number) {
    return { x: this.x * val, y: this.y * val };
  }
}

export default PointNum;
