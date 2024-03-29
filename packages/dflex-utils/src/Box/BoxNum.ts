import { Axis } from "../types";
import type AbstractBox from "./AbstractBox";
import Box from "./Box";
import BoxBool from "./BoxBool";

class BoxNum extends Box<number> {
  // Outside box checkers.
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

  // Outside threshold checkers.
  private _isAboveThresholdTop(threshold: AbstractBox): boolean {
    return this.top < threshold.top;
  }

  private _isRightOfThresholdRight(threshold: AbstractBox): boolean {
    return this.right > threshold.right;
  }

  private _isBelowThresholdBottom(threshold: AbstractBox): boolean {
    return this.bottom > threshold.bottom;
  }

  private _isLeftOfThresholdLeft(threshold: AbstractBox): boolean {
    return this.left < threshold.left;
  }

  // Inside threshold checkers.
  private _isBelowOrEqualThresholdTop(threshold: AbstractBox): boolean {
    return this.top >= threshold.top;
  }

  private _isLeftOrEqualThresholdRight(threshold: AbstractBox): boolean {
    return this.right <= threshold.right;
  }

  private _isAboveOrEqualThresholdBottom(threshold: AbstractBox): boolean {
    return this.bottom <= threshold.bottom;
  }

  private _isRightOrEqualThresholdLeft(threshold: AbstractBox): boolean {
    return this.left >= threshold.left;
  }

  isBoxIntersect(box: AbstractBox): boolean {
    const isIntersect = !(
      this._isAbove(box) ||
      this._isOneRight(box) ||
      this._isUnder(box) ||
      this._isOnLeft(box)
    );

    return isIntersect;
  }

  // isNotIntersect(box: AbstractBox): boolean {
  //   return !this.isBoxIntersect(box);
  // }

  // isOutsideBox(box: AbstractBox, outsideBox?: BoxBool): boolean {
  //   if (outsideBox) {
  //     outsideBox.setBox(false, false, false, false);
  //   }

  //   if (this._isAbove(box)) {
  //     if (outsideBox) {
  //       outsideBox.top = true;
  //     }
  //     return true;
  //   }

  //   if (this._isOneRight(box)) {
  //     if (outsideBox) {
  //       outsideBox.right = true;
  //     }
  //     return true;
  //   }

  //   if (this._isUnder(box)) {
  //     if (outsideBox) {
  //       outsideBox.bottom = true;
  //     }
  //     return true;
  //   }

  //   if (this._isOnLeft(box)) {
  //     if (outsideBox) {
  //       outsideBox.left = true;
  //     }
  //     return true;
  //   }

  //   return false;
  // }

  isOutThreshold(
    threshold: AbstractBox,
    preservedBoxResult: BoxBool,
    axis: Axis | null,
  ) {
    preservedBoxResult.setBox(false, false, false, false);

    if (axis) {
      if (axis === "y") {
        const isAbove = this._isAboveThresholdTop(threshold);
        const isBelow = this._isBelowThresholdBottom(threshold);

        if (isAbove) {
          preservedBoxResult.top = true;
        }

        if (isBelow) {
          preservedBoxResult.bottom = true;
        }

        return isAbove || isBelow;
      }

      const isLeft = this._isLeftOfThresholdLeft(threshold);
      const isRight = this._isRightOfThresholdRight(threshold);

      if (isLeft) {
        preservedBoxResult.left = true;
      }

      if (isRight) {
        preservedBoxResult.right = true;
      }

      return isLeft || isRight;
    }

    if (this._isAboveThresholdTop(threshold)) {
      preservedBoxResult.top = true;

      return true;
    }

    if (this._isRightOfThresholdRight(threshold)) {
      preservedBoxResult.right = true;

      return true;
    }

    if (this._isBelowThresholdBottom(threshold)) {
      preservedBoxResult.bottom = true;

      return true;
    }

    if (this._isLeftOfThresholdLeft(threshold)) {
      preservedBoxResult.left = true;

      return true;
    }

    return false;
  }

  isInsideThreshold(threshold: AbstractBox): boolean {
    return (
      this._isBelowOrEqualThresholdTop(threshold) &&
      this._isLeftOrEqualThresholdRight(threshold) &&
      this._isAboveOrEqualThresholdBottom(threshold) &&
      this._isRightOrEqualThresholdLeft(threshold)
    );
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
}

export default BoxNum;
