import type { Axis, Dimensions } from "../types";
import BoxNum from "./BoxNum";

export type BoxRectAbstract = {
  top: number;
  left: number;
  bottom: number;
  right: number;
  width: number;
  height: number;
};

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
    Object.seal(this);
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
    width: number
  ): this {
    this.top = top;
    this.left = left;
    this.width = width;
    this.height = height;
    this.right = left + width;
    this.bottom = top + height;

    return this;
  }

  /**
   * Update the box offset by axis.
   *
   * @param axis
   * @param value
   * @returns
   */
  setAxis(axis: Axis, value: number): this {
    switch (axis) {
      case "x": {
        this.left = value;
        this.right = this.width + value;
        break;
      }
      default: {
        this.top = value;
        this.bottom = this.height + value;
        break;
      }
    }

    return this;
  }

  /**
   * Update the box offset.
   *
   * @param x
   * @param y
   * @returns
   */
  setAxes(x: number, y: number): this {
    this.left = x;
    this.right = this.width + x;
    this.top = y;
    this.bottom = this.height + y;

    return this;
  }

  getDimensions(): Dimensions {
    return {
      height: this.height,
      width: this.width,
    };
  }

  /**
   *
   * @returns
   */
  getRect(): BoxRectAbstract {
    return {
      ...this.getBox(),
      height: this.height,
      width: this.width,
    };
  }
}

export default BoxRect;
