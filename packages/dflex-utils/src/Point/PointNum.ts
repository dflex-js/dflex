import Point from "./Point";
import type { AxesPoint } from "./types";

class PointNum extends Point<number> {
  increase(point: AxesPoint) {
    this.x += point.x;
    this.y += point.y;
  }

  decrease(point: AxesPoint) {
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
