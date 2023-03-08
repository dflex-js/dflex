import type AbstractBox from "./AbstractBox";
import Box from "./Box";

class BoxNum extends Box<number> {
  private _isUnder(box: AbstractBox) {
    return this.top > box.bottom;
  }

  private _isAbove(box: AbstractBox) {
    return this.bottom < box.top;
  }

  private _isOnLeft(box: AbstractBox) {
    return this.right < box.left;
  }

  private _isOneRight(box: AbstractBox) {
    return this.left > box.right;
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

  /**
   * True when it's inside of other box.
   *
   * @param box
   * @returns
   */
  // isInside(box: AbstractBox): boolean {
  //   return (
  //     this.top >= box.top &&
  //     this.right <= box.right &&
  //     this.bottom <= box.bottom &&
  //     this.left >= box.left
  //   );
  // }

  isPositionedY(box: AbstractBox) {
    return this._isUnder(box) || this._isAbove(box);
  }

  assignBiggestBox(box: AbstractBox) {
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
