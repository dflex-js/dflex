import type { Axis, IPointAxes } from "@dflex/utils";
import NodeCore from "./Core";
import type { INode } from "./types";

class CoreUtils extends NodeCore implements INode {
  static getRectByAxis(axis: Axis) {
    return axis === "x" ? "width" : "height";
  }

  static getDistance(currentPosition: IPointAxes, elm: INode, axis: Axis) {
    let diff = currentPosition[axis] - elm.currentPosition[axis];

    diff += elm.translate[axis];

    return diff;
  }

  getRectBottom() {
    return this.currentPosition.y + this.offset.height;
  }

  getRectRight() {
    return this.currentPosition.x + this.offset.width;
  }

  getRectDiff(elm: this, axis: Axis) {
    const rectType = CoreUtils.getRectByAxis(axis);

    return this.offset[rectType] - elm.offset[rectType];
  }

  getDisplacement(elm: this, axis: Axis) {
    const diff = axis === "x" ? elm.getRectRight() : elm.getRectBottom();

    return this.currentPosition[axis] - diff;
  }

  getDistance(elm: this, axis: Axis) {
    let diff = this.currentPosition[axis] - elm.currentPosition[axis];

    diff += elm.translate[axis];

    return diff;
  }

  getOffset() {
    return {
      width: this.offset.width,
      height: this.offset.height,
      top: this.currentPosition.y,
      left: this.currentPosition.x,
    };
  }

  getFullRect() {
    return {
      ...this.getOffset(),
      bottom: this.getRectBottom(),
      right: this.getRectRight(),
    };
  }

  isConnected() {
    return this.ref!.isConnected;
  }

  isPositionedUnder(elmY: number) {
    return elmY < this.currentPosition.y;
  }

  isPositionedLeft(elmX: number) {
    return elmX < this.currentPosition.x;
  }

  isWeakPositionContaining(elm: this) {
    return (
      this.offset.width >= elm.offset.width &&
      this.currentPosition.x <= elm.currentPosition.x &&
      this.offset.height >= elm.offset.height &&
      this.currentPosition.y <= elm.currentPosition.y
    );
  }

  hasSamePosition(elm: this, axis: Axis) {
    return this.currentPosition[axis] === elm.currentPosition[axis];
  }
}

export default CoreUtils;
