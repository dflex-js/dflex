import Box from "./Box";

class BoxNum extends Box<number> {
  /**
   * True when it's not intersected with other box.
   *
   * @param box
   * @returns
   */
  isNotIntersect(box: BoxNum): boolean {
    return (
      this.top > box.bottom ||
      this.right < box.left ||
      this.bottom < box.top ||
      this.left > box.right
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
    return this.bottom >= box.top || this.top <= box.bottom;
  }
}

export default BoxNum;
