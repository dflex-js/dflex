import type { AxesCoordinatesInterface } from "./types";

class AxesCoordinates<T = number> implements AxesCoordinatesInterface<T> {
  x!: T;

  y!: T;

  constructor(x: T, y: T) {
    this.setAxes(x, y);
  }

  setAxes(x: T, y: T) {
    this.x = x;
    this.y = y;
  }

  clone(target: AxesCoordinatesInterface<T>) {
    this.setAxes(target.x, target.y);
  }

  isEqual(target: AxesCoordinatesInterface<T>) {
    return this.x === target.x && this.y === target.y;
  }
}

export default AxesCoordinates;
