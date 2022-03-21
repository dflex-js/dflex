import AxesCoordinates from "./AxesCoordinates";

class AxesCoordinatesNum extends AxesCoordinates<number> {
  increase(x: number, y: number) {
    this.x += x;
    this.y += y;
  }

  decrease(x: number, y: number) {
    this.x -= x;
    this.y -= y;
  }
}

export default AxesCoordinatesNum;
