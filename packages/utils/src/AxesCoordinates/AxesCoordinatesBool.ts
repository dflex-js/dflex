import Point from "./AxesCoordinates";
import type { IPointBool } from "./types";

class PointBool extends Point<boolean> implements IPointBool {
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
