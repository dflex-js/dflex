import Box from "./Box";

class BoxNum extends Box<number> {
  clone(box: BoxNum) {
    this.left = box.left;
    this.top = box.top;
    this.right = box.right;
    this.bottom = box.bottom;
  }

  hasSamePoint(box: BoxNum) {
    return this.left === box.left && this.top === box.top;
  }

  isUnder(box: BoxNum) {
    return this.top > box.bottom;
  }

  isAbove(box: BoxNum) {
    return this.bottom < box.top;
  }

  isOnLeft(box: BoxNum) {
    return this.right < box.left;
  }

  isOneRight(box: BoxNum) {
    return this.left > box.right;
  }

  /**
   * True when it's not intersected with other box.
   *
   * @param box
   * @returns
   */
  isNotIntersect(box: BoxNum): boolean {
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
  isIntersect(box: BoxNum): boolean {
    return !this.isNotIntersect(box);
  }

  /**
   * True when it's inside of other box.
   *
   * @param box
   * @returns
   */
  isInside(box: BoxNum): boolean {
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
  isOutside(box: BoxNum): boolean {
    return !this.isInside(box);
  }

  isPositionedY(box: BoxNum) {
    return (
      (this.isUnder(box) || this.isAbove(box)) &&
      !this.isOnLeft(box) &&
      !this.isOneRight(box)
    );
  }
}

export default BoxNum;
