import type { Axis, AxesPoint } from "@dflex/utils";
import DFlexCoreNode from "./DFlexCoreElement";

class DFlexElement extends DFlexCoreNode {
  static getRectByAxis(axis: Axis) {
    return axis === "x" ? "width" : "height";
  }

  static getDistance(
    currentPosition: AxesPoint,
    elm: DFlexElement,
    axis: Axis
  ) {
    let diff = currentPosition[axis] - elm.rect[axis === "x" ? "left" : "top"];

    diff += elm.translate![axis];

    return diff;
  }

  static getDisplacement(
    currentPosition: AxesPoint,
    elm: DFlexElement,
    axis: Axis
  ) {
    const diff = axis === "x" ? elm.rect.right : elm.rect.bottom;

    return currentPosition[axis] - diff;
  }

  getRectDiff(elm: this, axis: Axis) {
    const rectType = DFlexElement.getRectByAxis(axis);

    return this.rect[rectType] - elm.rect[rectType];
  }

  getDisplacement(elm: this, axis: Axis): number {
    return DFlexElement.getDisplacement(this.rect.getPosition(), elm, axis);
  }

  getDistance(elm: this, axis: Axis): number {
    return DFlexElement.getDistance(this.rect.getPosition(), elm, axis);
  }
}

export default DFlexElement;
