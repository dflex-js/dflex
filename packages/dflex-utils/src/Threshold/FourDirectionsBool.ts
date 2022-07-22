import { PointBool } from "../Point";

class FourDirectionsBool {
  outVertical: PointBool;

  outHorizontal: PointBool;

  constructor() {
    this.outHorizontal = new PointBool(false, false);
    this.outVertical = new PointBool(false, false);
  }

  reset(): void {
    this.outHorizontal.setFalsy();
    this.outVertical.setFalsy();
  }
}

export default FourDirectionsBool;
