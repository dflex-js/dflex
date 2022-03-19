import { AxesCoordinatesInterface } from "./types";

export class AbstractAxesCoordinates<T> {
  protected prop1!: T;

  protected prop2!: T;

  constructor(x: T, y: T) {
    this.prop1 = x;
    this.prop2 = y;
  }

  setAxes(x: T, y: T) {
    this.prop1 = x;
    this.prop2 = y;
  }

  clone(target: AxesCoordinatesInterface<T>) {
    this.setAxes(target.x, target.y);
  }

  isEqual(target: AxesCoordinatesInterface<T>) {
    return this.prop1 === target.x && this.prop2 === target.y;
  }
}

export default AbstractAxesCoordinates;
