import type { Axis, AxesPoint } from "@dflex/utils";
import DFlexCoreNode from "./DFlexCoreNode";

class DFlexNode extends DFlexCoreNode {
  static getRectByAxis(axis: Axis) {
    return axis === "x" ? "width" : "height";
  }

  static getDistance(currentPosition: AxesPoint, elm: DFlexNode, axis: Axis) {
    let diff = currentPosition[axis] - elm.currentPosition[axis];

    diff += elm.translate![axis];

    return diff;
  }

  static getDisplacement(
    currentPosition: AxesPoint,
    elm: DFlexNode,
    axis: Axis
  ) {
    const diff = axis === "x" ? elm.getRectRight() : elm.getRectBottom();

    return currentPosition[axis] - diff;
  }

  isPositionedUnder(elmY: number) {
    return elmY <= this.currentPosition.y;
  }

  isPositionedLeft(elmX: number) {
    return elmX <= this.currentPosition.x;
  }

  hasSamePosition(elm: this, axis: Axis) {
    return this.currentPosition[axis] === elm.currentPosition[axis];
  }

  getRectBottom() {
    return this.currentPosition.y + this.initialOffset.height;
  }

  getRectRight() {
    return this.currentPosition.x + this.initialOffset.width;
  }

  getRectDiff(elm: this, axis: Axis) {
    const rectType = DFlexNode.getRectByAxis(axis);

    return this.initialOffset[rectType] - elm.initialOffset[rectType];
  }

  getDisplacement(elm: this, axis: Axis): number {
    return DFlexNode.getDisplacement(this.currentPosition, elm, axis);
  }

  getDistance(elm: this, axis: Axis): number {
    return DFlexNode.getDistance(this.currentPosition, elm, axis);
  }
}

export default DFlexNode;
