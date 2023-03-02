import type AbstractBox from "./AbstractBox";
import Box from "./Box";

class BoxNum extends Box<number> {
  clone(box: AbstractBox) {
    this.left = box.left;
    this.top = box.top;
    this.right = box.right;
    this.bottom = box.bottom;
  }

  hasSamePoint(box: AbstractBox) {
    return this.left === box.left && this.top === box.top;
  }

  isUnder(box: AbstractBox) {
    return this.top > box.bottom;
  }

  isAbove(box: AbstractBox) {
    return this.bottom < box.top;
  }

  isOnLeft(box: AbstractBox) {
    return this.right < box.left;
  }

  isOneRight(box: AbstractBox) {
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
      this.isUnder(box) ||
      this.isOnLeft(box) ||
      this.isAbove(box) ||
      this.isOneRight(box)
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
  isInside(box: AbstractBox): boolean {
    return (
      this.top >= box.top &&
      this.right <= box.right &&
      this.bottom <= box.bottom &&
      this.left >= box.left
    );
  }

  /**
   * True when it's outside of other box.
   *
   * @param box
   * @returns
   */
  isOutside(box: AbstractBox): boolean {
    return !this.isInside(box);
  }

  isPositionedY(box: AbstractBox) {
    return (
      (this.isUnder(box) || this.isAbove(box)) &&
      !this.isOnLeft(box) &&
      !this.isOneRight(box)
    );
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
