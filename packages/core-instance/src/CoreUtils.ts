import type { Axis } from "@dflex/utils";
import Core from "./Core";
import type { ICoreUtils } from "./types";

class CoreUtils extends Core implements ICoreUtils {
  isPositionedUnder(elmY: number) {
    return elmY < this.currentPosition.y;
  }

  isPositionedLeft(elmX: number) {
    return elmX < this.currentPosition.x;
  }

  hasSamePosition(elm: this, axis: Axis) {
    return this.currentPosition[axis] === elm.currentPosition[axis];
  }

  getRectBottom() {
    return this.currentPosition.y + this.offset.height;
  }

  getRectRight() {
    return this.currentPosition.x + this.offset.width;
  }
}

export default CoreUtils;
