import type { AxesPoint } from "./types";

class Point<T = number> {
  x!: T;

  y!: T;

  constructor(x: T, y: T) {
    this.setAxes(x, y);
  }

  setAxes(x: T, y: T) {
    this.x = x;
    this.y = y;
  }

  clone(target: Point<T> | AxesPoint<T>) {
    this.setAxes(target.x, target.y);
  }

  getInstance() {
    return {
      x: this.x,
      y: this.y,
    };
  }

  isEqual(target: Point<T> | AxesPoint<T>) {
    return this.x === target.x && this.y === target.y;
  }
}

export default Point;
