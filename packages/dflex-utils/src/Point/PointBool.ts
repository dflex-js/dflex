import Point from "./Point";

class PointBool extends Point<boolean> {
  isOneTruthy() {
    return this.x || this.y;
  }

  isAllFalsy() {
    return !this.x && !this.y;
  }

  setFalsy() {
    this.x = false;
    this.y = false;
  }
}

export default PointBool;
