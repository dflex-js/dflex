import Point from "./Point";

class PointBool extends Point<boolean> {
  isOneTruthy(): boolean {
    return this.x || this.y;
  }

  isAllFalsy(): boolean {
    return !this.x && !this.y;
  }

  setFalsy(): void {
    this.x = false;
    this.y = false;
  }
}

export default PointBool;
