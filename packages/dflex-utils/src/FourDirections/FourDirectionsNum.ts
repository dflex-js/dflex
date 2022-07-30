import FourDirections from "./FourDirections";

class FourDirectionsNum extends FourDirections<number> {
  constructor() {
    super(0, 0, 0, 0);
  }

  reset(): void {
    this.setAll(0, 0, 0, 0);
  }
}

export default FourDirectionsNum;
