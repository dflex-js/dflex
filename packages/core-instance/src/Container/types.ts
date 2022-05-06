import type {
  Dimensions,
  RectBoundaries,
  RectDimensions,
  IPointNum,
  IPointAxes,
  IScroll,
  Axis,
} from "@dflex/utils";

export interface IContainer {
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
  registerNewElm(
    offset: RectDimensions,
    unifiedContainerDimensions?: Dimensions
  ): void;
  appendElmToContainer(offset: RectDimensions, axis: Axis): void;
  resetIndicators(): void;
  preservePosition(position: IPointAxes | null): void;
}
