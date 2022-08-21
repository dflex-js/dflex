/** Four direction instance - clockwise */
class AbstractBox<T = number> {
  /** Minimal `Y` coordinate */
  top!: T;

  /** Maximal `X` coordinate */
  right!: T;

  /** Maximal `Y` coordinate */
  bottom!: T;

  /** Minimal `X` coordinate */
  left!: T;

  /**
   *
   * @param top - minimal y coordinate
   * @param right - maximal x coordinate
   * @param bottom - maximal y coordinate
   * @param left - minimal x coordinate
   */
  constructor(top: T, right: T, bottom: T, left: T) {
    this.top = top;
    this.right = right;
    this.bottom = bottom;
    this.left = left;
  }
}

export default AbstractBox;
