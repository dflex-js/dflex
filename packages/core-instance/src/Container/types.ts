import type {
  RectBoundaries,
  RectDimensions,
  IPointNum,
  IScroll,
} from "@dflex/utils";

export interface IContainer {
  isInitiated: boolean;
  /** Strict Rect for siblings containers. */
  readonly boundaries: RectBoundaries;
  /** Numbers of total columns and rows each container has.  */
  readonly grid: IPointNum;
  /** Numbers of columns with each rows each container has.  */
  readonly gridContainer: IPointNum;
  /** Container scroll instance.  */
  scroll: IScroll;
  setGrid(grid: IPointNum, rect: RectDimensions): void;
  setBoundaries(rect: RectDimensions): void;
}
