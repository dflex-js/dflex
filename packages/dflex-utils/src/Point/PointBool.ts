import Point from "./Point";

class PointBool extends Point<boolean> {
  /**
   * True when both points X and Y are true.
   * @returns
   */
  isOneTruthy(): boolean {
    return this.x || this.y;
  }

  /**
   * True when one point is false.
   * @returns
   */
  isAllFalsy(): boolean {
    return !(this.x || this.y);
  }

  /**
   * Set both x and y to false.
   */
  setFalsy(): void {
    this.x = false;
    this.y = false;
  }
}

export default PointBool;
