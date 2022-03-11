import type {
  AxesCoordinatesInterface,
  AxesCoordinatesBoolInterface,
  ThresholdLayoutInterface,
} from "@dflex/utils";

import type { CoreInstanceInterface } from "@dflex/core-instance";

import type { AbstractDraggableInterface } from "@dflex/draggable";

import type { ScrollOptWithThreshold } from "../types";

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
  readonly threshold: ThresholdLayoutInterface;

  readonly innerOffset: AxesCoordinatesInterface;

  /** Dragged position for both X and Y.  */
  readonly positionPlaceholder: AxesCoordinatesInterface;

  /** Temporary index for dragged  */
  readonly indexPlaceholder: number;

  /** Previous X and Y are used to calculate mouse directions. */
  readonly mousePoints: AxesCoordinatesInterface;

  /** Restrict dragged movement inside viewport.  */
  readonly isViewportRestricted: boolean;

  /**
   * If the dragged is moving opposite to the center X/Y point(0.0).
   * Far from Y, is moving down.
   * Far from X, is moving right.
   */
  readonly isMovingAwayFrom: AxesCoordinatesBoolInterface;

  dragAt(x: number, y: number): void;

  /**
   * Check if the dragged coordinates are out of self position or parent
   * container and set the necessary flags.
   */
  isInThreshold(siblingsK?: string): boolean;

  /**
   * Checks if dragged index is first the mouse going up. Valid only if dragged
   * is out self threshold.
   */
  isLeavingFromHead(): boolean;

  /**
   * Checks if dragged index is last the mouse going down. Valid only if dragged
   * is out self threshold.
   */
  isLeavingFromTail(): boolean;

  /**
   * Has moved without settling inside new position.
   * Note: The tail element is currently excluded.
   */
  isNotSettled(): boolean;
}

export interface DraggableInteractiveInterface extends DraggableAxesInterface {
  readonly operationID: string;
  setOfTransformedIds?: Set<string>;
  siblingsContainer: CoreInstanceInterface | null;
  scroll: ScrollOptWithThreshold;
  readonly occupiedOffset: AxesCoordinatesInterface;
  readonly occupiedTranslate: AxesCoordinatesInterface;
  readonly numberOfElementsTransformed: number;
  readonly isDraggedPositionFixed: boolean;
  setDraggedTempIndex(i: number): void;
  updateNumOfElementsTransformed(effectedElemDirection: number): void;
  endDragging(isFallback: boolean): void;
}
