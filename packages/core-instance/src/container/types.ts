import type { RectBoundaries, IPointNum, RectDimensions } from "@dflex/utils";

export interface IContainer {
  readonly boundaries: RectBoundaries;
  readonly grid: IPointNum;
  readonly gridContainer: IPointNum;

  setGrid(grid: IPointNum, rect: RectDimensions): void;
  setBoundaries(rect: RectDimensions): void;
}
