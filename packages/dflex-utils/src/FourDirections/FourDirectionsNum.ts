import { PointNum } from "../Point";

class FourDirectionsNum {
  outVertical: PointNum;

  outHorizontal: PointNum;

  constructor() {
    this.outHorizontal = new PointNum(0, 0);
    this.outVertical = new PointNum(0, 0);
  }

  reset(): void {
    this.outHorizontal.setAxes(0, 0);
    this.outVertical.setAxes(0, 0);
  }
}

export default FourDirectionsNum;
