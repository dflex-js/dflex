import { AbstractCoordinates } from "../AxesCoordinates";
import type { GridPointInterface } from "./types";

class GridPoint
  extends AbstractCoordinates<number>
  implements GridPointInterface
{
  row: number;

  column: number;

  constructor(x: number, y: number) {
    super(x, y);

    this.row = this.prop1;
    this.column = this.prop2;
  }
}

export default GridPoint;
