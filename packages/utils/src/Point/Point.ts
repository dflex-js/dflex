import type { IPoint } from "./types";

class Point<T = number> implements IPoint<T> {
  x!: T;

  y!: T;

  constructor(x: T, y: T) {
    this.setAxes(x, y);
  }

  setAxes(x: T, y: T) {
    this.x = x;
    this.y = y;
  }

  clone(target: IPoint<T>) {
    this.setAxes(target.x, target.y);
  }

  isEqual(target: IPoint<T>) {
    return this.x === target.x && this.y === target.y;
  }
}

export default Point;
