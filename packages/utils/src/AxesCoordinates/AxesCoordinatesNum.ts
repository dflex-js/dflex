import Point from "./AxesCoordinates";

class PointNum extends Point<number> {
  increase(x: number, y: number) {
    this.x += x;
    this.y += y;
  }

  decrease(x: number, y: number) {
    this.x -= x;
    this.y -= y;
  }
}

export default PointNum;
