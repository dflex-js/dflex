import { getDirectionTypeByAxis } from "../collections";
import { AxesPoint } from "../Point";
import { Axis } from "../types";
import type AbstractBox from "./AbstractBox";
import Box from "./Box";

class BoxNum extends Box<number> {
  private _isUnder(box: AbstractBox): boolean {
    return this.top >= box.bottom;
  }

  private _isAbove(box: AbstractBox): boolean {
    return this.bottom <= box.top;
  }

  private _isOnLeft(box: AbstractBox): boolean {
    return this.right <= box.left;
  }

  private _isOneRight(box: AbstractBox): boolean {
    return this.left >= box.right;
  }

  /**
   * True when it's not intersected with other box.
   *
   * @param box
   * @returns
   */
  isNotIntersect(box: AbstractBox): boolean {
    return (
      this._isUnder(box) ||
      this._isOnLeft(box) ||
      this._isAbove(box) ||
      this._isOneRight(box)
    );
  }

  /**
   * True when it's intersected with other box.
   *
   * @param box
   * @returns
   */
  isIntersect(box: AbstractBox): boolean {
    return !this.isNotIntersect(box);
  }

  getSurroundingBox(box: AbstractBox): AbstractBox {
    // Determine the coordinates of the new box
    const left = Math.min(box.left, this.left);
    const top = Math.min(box.top, this.top);

    const right = Math.max(box.right, this.right);
    const bottom = Math.max(box.bottom, this.bottom);

    // Create and return the new box
    return {
      left,
      top,
      right,
      bottom,
    };
  }

  /**
   * True when it's inside of other box.
   *
   * @param box
   * @returns
   */
  isInside(box: AbstractBox): boolean {
    return (
      this.top >= box.top &&
      this.right <= box.right &&
      this.bottom <= box.bottom &&
      this.left >= box.left
    );
  }

  isPositionedY(box: AbstractBox): boolean {
    return this._isUnder(box) || this._isAbove(box);
  }

  assignBiggestBox(box: AbstractBox): void {
    const { top, left, right, bottom } = box;

    if (left < this.left) {
      this.left = left;
    }

    if (top < this.top) {
      this.top = top;
    }

    if (right > this.right) {
      this.right = right;
    }

    if (bottom > this.bottom) {
      this.bottom = bottom;
    }
  }

  getDirectionDiff(axis: Axis, point: AxesPoint): number {
    const directionType = getDirectionTypeByAxis(axis);

    const diff = this[directionType] - point[axis];

    return Math.abs(diff);
  }
}

export default BoxNum;
