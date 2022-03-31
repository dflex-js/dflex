import type {
  IPointNum,
  IPointBool,
  ThresholdInterface,
  ThresholdCoordinate,
} from "@dflex/utils";
import type { CoreInstanceInterface } from "@dflex/core-instance";
import type { AbstractDraggableInterface } from "@dflex/draggable";

import type { ScrollOptWithThreshold } from "../types";

export interface SiblingsThreshold {
  [sk: string]: ThresholdCoordinate;
}

export interface Restrictions {
  self: {
    readonly allowLeavingFromTop: boolean;
    readonly allowLeavingFromBottom: boolean;
    readonly allowLeavingFromLeft: boolean;
    readonly allowLeavingFromRight: boolean;
  };
  container: {
    readonly allowLeavingFromTop: boolean;
    readonly allowLeavingFromBottom: boolean;
    readonly allowLeavingFromLeft: boolean;
    readonly allowLeavingFromRight: boolean;
  };
}

export interface DraggableAxesInterface
  extends AbstractDraggableInterface<CoreInstanceInterface> {
  /** Dragged threshold  */
  readonly threshold: ThresholdInterface;

  readonly innerOffset: IPointNum;

  /** Dragged position for both X and Y.  */
  readonly positionPlaceholder: IPointNum;

  /** Temporary index for dragged  */
  readonly indexPlaceholder: number;

  /** Siblings key holder. Also, it's always defined until introducing actions. */
  readonly siblingsKeyPlaceholder: string;

  /** grid placeholder for dragged grid position. */
  readonly gridPlaceholder: IPointNum;

  /** Restrict dragged movement inside viewport.  */
  readonly isViewportRestricted: boolean;

  /**
   * If the dragged is moving opposite to the center X/Y point(0.0).
   * Far from Y, is moving down.
   * Far from X, is moving right.
   */
  readonly isMovingAwayFrom: IPointBool;

  dragAt(x: number, y: number): void;

  /**
   * Check if the dragged out self position or parent container and set the
   * necessary flags.
   */
  isOutThreshold(siblingsK?: string): boolean;

  /** Has moved without settling inside new position. */
  isNotSettled(): boolean;
}

export interface DraggableInteractiveInterface extends DraggableAxesInterface {
  readonly operationID: string;
  setOfTransformedIds?: Set<string>;
  siblingsContainer: CoreInstanceInterface | null;
  scroll: ScrollOptWithThreshold;
  readonly occupiedOffset: IPointNum;
  readonly occupiedTranslate: IPointNum;
  readonly numberOfElementsTransformed: number;
  readonly isDraggedPositionFixed: boolean;
  setDraggedTempIndex(i: number): void;
  updateNumOfElementsTransformed(effectedElemDirection: number): void;
  endDragging(isFallback: boolean): void;
}
