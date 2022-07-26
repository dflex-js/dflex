import { PointNum } from "../Point";

class FourDirectionsNum {
  verticalDistance: PointNum;

  horizontalDistance: PointNum;

  constructor() {
    this.horizontalDistance = new PointNum(0, 0);
    this.verticalDistance = new PointNum(0, 0);
  }

  reset(): void {
    this.horizontalDistance.setAxes(0, 0);
    this.verticalDistance.setAxes(0, 0);
  }
}

export default FourDirectionsNum;
