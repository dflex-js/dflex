import type { Axis, AxesPoint } from "@dflex/utils";
import DFlexCoreNode from "./DFlexCoreNode";

class DFlexNode extends DFlexCoreNode {
  static getRectByAxis(axis: Axis) {
    return axis === "x" ? "width" : "height";
  }

  static getDistance(currentPosition: AxesPoint, elm: DFlexNode, axis: Axis) {
    let diff = currentPosition[axis] - elm.rect[axis === "x" ? "left" : "top"];

    diff += elm.translate![axis];

    return diff;
  }

  static getDisplacement(
    currentPosition: AxesPoint,
    elm: DFlexNode,
    axis: Axis
  ) {
    const diff = axis === "x" ? elm.rect.right : elm.rect.bottom;

    return currentPosition[axis] - diff;
  }

  getRectDiff(elm: this, axis: Axis) {
    const rectType = DFlexNode.getRectByAxis(axis);

    return this.rect[rectType] - elm.rect[rectType];
  }

  getDisplacement(elm: this, axis: Axis): number {
    return DFlexNode.getDisplacement(this.rect.getPosition(), elm, axis);
  }

  getDistance(elm: this, axis: Axis): number {
    return DFlexNode.getDistance(this.rect.getPosition(), elm, axis);
  }
}

export default DFlexNode;
