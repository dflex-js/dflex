import type { Axis, AxesPoint } from "@dflex/utils";
import DFlexCoreNode from "./DFlexCoreElement";

// TODO: Remove this class and depend entirely on Box/Rect classes instead.
class DFlexElement extends DFlexCoreNode {
  static getDistance(
    currentPosition: AxesPoint,
    elm: DFlexElement,
    axis: Axis
  ) {
    let diff = currentPosition[axis] - elm.rect[axis === "x" ? "left" : "top"];

    diff += elm._translate![axis];

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

  getDisplacement(elm: this, axis: Axis): number {
    return DFlexElement.getDisplacement(this.rect.getPosition(), elm, axis);
  }

  getDistance(elm: this, axis: Axis): number {
    return DFlexElement.getDistance(this.rect.getPosition(), elm, axis);
  }
}

export default DFlexElement;
