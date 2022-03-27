import Point from "./Point";

class PointNum extends Point<number> {
  increase(x: number, y: number) {
    this.x += x;
    this.y += y;
  }

  decrease(x: number, y: number) {
    this.x -= x;
    this.y -= y;
  }

  multiplyAll(value: number) {
    this.x *= value;
    this.y *= value;
  }
}

export default PointNum;
