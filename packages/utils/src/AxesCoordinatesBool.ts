import AxesCoordinates from "./AxesCoordinates";
import type { AxesCoordinatesBoolInterface } from "./types";

class AxesCoordinatesBool
  extends AxesCoordinates<boolean>
  implements AxesCoordinatesBoolInterface
{
  isOneTruthy() {
    return this.x || this.y;
  }

  isAllFalsy() {
    return !this.x && !this.y;
  }
}

export default AxesCoordinatesBool;
