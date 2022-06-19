import type {
  Dimensions,
  RectBoundaries,
  RectDimensions,
  IPointNum,
  IPointAxes,
  IScroll,
} from "@dflex/utils";

export interface IDFlexContainer {
  /**
   * Preserve the last element position in the list .
   * Usage: Getting this position when the dragged is going back from the tail.
   */
  readonly lastElmPosition: IPointNum;

  /** Strict Rect for siblings containers. */
  readonly boundaries: RectBoundaries;

  /** Numbers of total columns and rows each container has.  */
  readonly grid: IPointNum;

  /**
   * Origin length for container before being transformed used to prevent
   * layout shift.
   * */
  originLength: number;

  /** Container scroll instance.  */
  scroll: IScroll;
  registerNewElm(
    offset: RectDimensions,
    unifiedContainerDimensions?: Dimensions
  ): void;
  resetIndicators(): void;
  preservePosition(position: IPointAxes | null): void;
}
