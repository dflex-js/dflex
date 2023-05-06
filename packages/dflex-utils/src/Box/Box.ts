import type { AxesPoint } from "../Point";
import type { Axis, Direction } from "../types";
import AbstractBox from "./AbstractBox";

/** Four direction instance - clockwise */
class Box<T> extends AbstractBox<T> {
  clone(box: AbstractBox<T>): void {
    this.top = box.top;
    this.right = box.right;
    this.bottom = box.bottom;
    this.left = box.left;
  }

  /**
   * Set all directions.
   *
   * @param top
   * @param right
   * @param bottom
   * @param left
   */
  setBox(top: T, right: T, bottom: T, left: T): this {
    this.top = top;
    this.right = right;
    this.bottom = bottom;
    this.left = left;

    return this;
  }

  /**
   * Get an instance of FourDirections.
   *
   * @returns
   */
  getBox(): AbstractBox<T> {
    return {
      top: this.top,
      right: this.right,
      bottom: this.bottom,
      left: this.left,
    };
  }

  /**
   * Set one axis only.
   *
   * @param axis
   * @param x
   * @param y
   */
  setByAxis(axis: Axis, x: T, y: T): void {
    switch (axis) {
      case "x": {
        this.left = x;
        this.right = y;
        break;
      }
      default:
        this.top = x;
        this.bottom = y;
        break;
    }
  }

  /**
   * Set one direction only.
   *
   * @param axis
   * @param direction
   * @param value
   */
  setOne(axis: Axis, direction: Direction, value: T): void {
    switch (axis) {
      case "x": {
        if (direction === -1) {
          this.left = value;
        } else {
          this.right = value;
        }
        break;
      }
      default:
        if (direction === -1) {
          this.top = value;
        } else {
          this.bottom = value;
        }
        break;
    }
  }

  /**
   * Get the value of one direction.
   *
   * @param axis
   * @param direction
   * @returns
   */
  getOne(axis: Axis, direction: Direction): T {
    switch (axis) {
      case "x":
        return direction === -1 ? this.left : this.right;
      default:
        return direction === -1 ? this.top : this.bottom;
    }
  }

  setPositionInstance(point: AxesPoint<T>) {
    this.top = point.y;
    this.left = point.x;
  }

  setPosition(x: T, y: T) {
    this.top = y;
    this.left = x;
  }

  hasEqualPosition(x: T, y: T): boolean {
    return this.top === y || this.left === x;
  }

  /**
   * Get starting point instance.
   *
   * @returns
   */
  getPosition(): AxesPoint<T> {
    return {
      x: this.left,
      y: this.top,
    };
  }
}

export default Box;
