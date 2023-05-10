import type AbstractBox from "./AbstractBox";
import Box from "./Box";
import BoxBool from "./BoxBool";

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

  isIntersect(box: AbstractBox): boolean {
    const isIntersect = !(
      this._isAbove(box) ||
      this._isOneRight(box) ||
      this._isUnder(box) ||
      this._isOnLeft(box)
    );

    return isIntersect;
  }

  isNotIntersect(box: AbstractBox): boolean {
    return !this.isIntersect(box);
  }

  isOutside(box: AbstractBox, outsideBox?: BoxBool): boolean {
    if (outsideBox) {
      outsideBox.setBox(false, false, false, false);
    }

    if (this._isAbove(box)) {
      if (outsideBox) {
        outsideBox.top = true;
      }
      return true;
    }

    if (this._isOneRight(box)) {
      if (outsideBox) {
        outsideBox.right = true;
      }
      return true;
    }

    if (this._isUnder(box)) {
      if (outsideBox) {
        outsideBox.bottom = true;
      }
      return true;
    }

    if (this._isOnLeft(box)) {
      if (outsideBox) {
        outsideBox.left = true;
      }
      return true;
    }

    return false;
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
}

export default BoxNum;
