/* eslint-disable max-classes-per-file */
import { AbstractAxesCoordinates } from "./AbstractAxesCoordinates";
import type { AxesCoordinatesInterface } from "./types";

class AxesCoordinates<T = number>
  extends AbstractAxesCoordinates<T>
  implements AxesCoordinatesInterface<T>
{
  x!: T;

  y!: T;

  constructor(x: T, y: T) {
    super(x, y);

    this.x = this.prop1;
    this.y = this.prop2;
  }
}

export default AxesCoordinates;
