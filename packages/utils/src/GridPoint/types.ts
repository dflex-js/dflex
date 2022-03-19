import { AbstractCoordinatesInterface } from "../AxesCoordinates";

export interface GridPointInterface
  extends AbstractCoordinatesInterface<number> {
  row: number;
  column: number;
}
