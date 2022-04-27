import type {
  RectBoundaries,
  RectDimensions,
  IPointNum,
  IPointAxes,
  IScroll,
} from "@dflex/utils";

export interface IContainer {
  /**
   * For restoring element position when necessary without knowing element id.
   * E.g. when element is removed from branch and we need to know the position
   * the element was in before it was removed.
   */
  // readonly firstElmPosition?: IPointNum | null;

  /**
   * Preserve the last element position in the list .
   * Usage: Getting this position when the dragged is going back from the tail.
   */
  readonly lastElmPosition: IPointNum;

  /** Strict Rect for siblings containers. */
  readonly boundaries: RectBoundaries;
  /** Numbers of total columns and rows each container has.  */
  readonly grid: IPointNum;

  /** Container scroll instance.  */
  scroll: IScroll;
  setGrid(grid: IPointNum, rect: RectDimensions): void;
  setBoundaries(rect: RectDimensions): void;
  preservePosition(
    position: IPointAxes | null,
    type: "firstElmPosition" | "lastElmPosition"
  ): void;
}
