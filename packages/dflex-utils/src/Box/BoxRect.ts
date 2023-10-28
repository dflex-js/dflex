/* eslint-disable no-dupe-class-members */
/* eslint-disable no-unused-vars */
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
  setByPointAndDimensions(
    top: number,
    left: number,
    height: number,
    width: number,
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
  setAxes(x: number, y: number): void {
    this.left = x;
    this.right = this.width + x;
    this.top = y;
    this.bottom = this.height + y;
  }

  getInstance(): AbstractBoxRect {
    const { top, left, bottom, right, width, height } = this;

    return { top, left, bottom, right, width, height };
  }

  getViewportPos(
    viewportTop: number,
    viewportLeft: number,
    asBoxNum: true,
  ): BoxNum;

  getViewportPos(
    viewportTop: number,
    viewportLeft: number,
    asBoxNum: false,
  ): AbstractBox & Dimensions;

  /**
   * Converts absolute element position to viewport position based on scroll position.
   * @param viewportTop - The top position of the viewport.
   * @param viewportLeft - The left position of the viewport.
   * @returns The position of the element within the viewport.
   */
  getViewportPos(
    viewportTop: number,
    viewportLeft: number,
    asBoxNum: boolean,
  ): BoxNum | (AbstractBox & Dimensions) {
    const top = viewportTop;
    const right = viewportLeft + this.width;
    const bottom = viewportTop + this.height;
    const left = viewportLeft;

    return asBoxNum
      ? new BoxNum(top, right, bottom, left)
      : {
          top,
          right,
          bottom,
          left,
          height: this.height,
          width: this.width,
        };
  }

  /**
   * Gets the width/height difference between two boxes based on axis.
   *
   * @param axis
   * @param box
   * @returns
   */
  getDimensionDiff(axis: Axis, box: AbstractBoxRect): number {
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
  getPositionDiff(axis: Axis, point: AxesPoint): number {
    const directionType = getStartingPointByAxis(axis);

    return this[directionType] - point[axis];
  }
}

export default BoxRect;
