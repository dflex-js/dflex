import type { Axis } from "../types";
import FourDirections from "./FourDirections";

class FourDirectionsBool extends FourDirections<boolean> {
  constructor() {
    super(false, false, false, false);
  }

  reset(): void {
    this.setAll(false, false, false, false);
  }

  isOneTruthy(axis: Axis): boolean {
    switch (axis) {
      case "x":
        return this.left || this.right;
      default:
        return this.top || this.bottom;
    }
  }
}

export default FourDirectionsBool;
