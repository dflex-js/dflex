import type { Axis } from "@dflex/utils";
import NodeCore from "./Core";
import type { INode } from "./types";

class CoreUtils extends NodeCore implements INode {
  isConnected() {
    return this.ref!.isConnected;
  }

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

  getDistance(elm: this, axis: Axis) {
    const diff = axis === "x" ? elm.getRectRight() : elm.getRectBottom();

    return this.currentPosition[axis] - diff;
  }

  getOffset() {
    return {
      width: this.offset.width,
      height: this.offset.height,
      top: this.currentPosition.y,
      left: this.currentPosition.x,
    };
  }
}

export default CoreUtils;
