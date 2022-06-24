import type {
  IPointNum,
  ThresholdInterface,
  ThresholdCoordinate,
  IMigration,
} from "@dflex/utils";
import type { IDFlexNode } from "@dflex/core-instance";
import type { IDFlexBaseDraggable } from "@dflex/draggable";

import type { ContainersTransition, ScrollOpts } from "../types";
import { dispatchDFlexEvent } from "../DnDStore";

export interface SiblingsThreshold {
  [sk: string]: ThresholdCoordinate;
}

export interface IDraggableAxes extends IDFlexBaseDraggable<IDFlexNode> {
  /** Dragged threshold  */
  readonly threshold: ThresholdInterface;

  readonly innerOffset: IPointNum;

  /** Dragged position for both X and Y.  */
  readonly positionPlaceholder: IPointNum;

  readonly migration: IMigration;

  /** grid placeholder for dragged grid position. */
  readonly gridPlaceholder: IPointNum;

  /** Restrict dragged movement inside viewport.  */
  readonly isViewportRestricted: boolean;

  readonly events: ReturnType<typeof dispatchDFlexEvent>;

  dragAt(x: number, y: number): void;

  /**
   * Check if the dragged out self position or parent container and set the
   * necessary flags.
   */
  isOutThreshold(SK?: string): boolean;
  isOutThreshold(SK: string, useInsertionThreshold: true): boolean;

  /** Has moved without settling inside new position. */
  isNotSettled(): boolean;
}

export interface IDraggableInteractive extends IDraggableAxes {
  readonly containersTransition: ContainersTransition;
  readonly scroll: ScrollOpts;
  readonly occupiedPosition: IPointNum;
  readonly occupiedTranslate: IPointNum;
  readonly isDraggedPositionFixed: boolean;
  setDraggedTempIndex(i: number): void;
  endDragging(isFallback: boolean): void;
}
