import { getDimensionTypeByAxis, getStartingPointByAxis } from "../collections";
import { AxesPoint } from "../Point";
import BoxNum from "./BoxNum";

import type { Axis, Dimensions } from "../types";
import type AbstractBox from "./AbstractBox";

export type AbstractBoxRect = AbstractBox & Dimensions;

class BoxRect extends BoxNum {
  width: number;

  height: number;

  /**
   * clockwise
   *
   * @param top
   * @param right
   * @param bottom
   * @param left
   */
  constructor(top: number, right: number, bottom: number, left: number) {
    super(top, right, bottom, left);

    this.width = right - left;
    this.height = bottom - top;

    if (__DEV__) {
      Object.seal(this);
    }
  }

  /**
   *
   * @param top
   * @param left
   * @param height
   * @param width
   * @returns
   */
  _setByPointAndDimensions(
    top: number,
    left: number,
    height: number,
    width: number
  ): void {
    this.top = top;
    this.left = left;
    this.width = width;
    this.height = height;

    this.right = left + width;
    this.bottom = top + height;
  }

  /**
   * Update the box point position.
   *
   * @param x
   * @param y
   * @returns
   */
  _setAxes(x: number, y: number): void {
    this.left = x;
    this.right = this.width + x;
    this.top = y;
    this.bottom = this.height + y;
  }

  /**
   * Gets the width/height difference between two boxes based on axis.
   *
   * @param axis
   * @param box
   * @returns
   */
  _getDimensionDiff(axis: Axis, box: AbstractBoxRect): number {
    const dimensionType = getDimensionTypeByAxis(axis);

    return this[dimensionType] - box[dimensionType];
  }

  /**
   * Gets the  left/top difference between two points based on axis.
   *
   * @param axis
   * @param point
   * @returns
   */
  _getPositionDiff(axis: Axis, point: AxesPoint): number {
    const directionType = getStartingPointByAxis(axis);

    return this[directionType] - point[axis];
  }
}

export default BoxRect;
