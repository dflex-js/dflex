import type {
  AxesCoordinatesInterface,
  AxesCoordinatesBoolInterface,
  Axes,
} from "@dflex/utils";
import type { CoreInstanceInterface } from "@dflex/core-instance";
import type { AbstractDraggableInterface } from "@dflex/draggable";

import type { ScrollOptWithThreshold } from "../types";

import type {
  ThresholdInterface,
  ThresholdCoordinate,
} from "../Plugins/Threshold";

export interface SiblingsThreshold {
  [sk: string]: ThresholdCoordinate;
}

export interface Restrictions {
  self: {
    allowLeavingFromTop: boolean;
    allowLeavingFromBottom: boolean;
    allowLeavingFromLeft: boolean;
    allowLeavingFromRight: boolean;
  };
  container: {
    allowLeavingFromTop: boolean;
    allowLeavingFromBottom: boolean;
    allowLeavingFromLeft: boolean;
    allowLeavingFromRight: boolean;
  };
}

export interface DraggableAxesInterface
  extends AbstractDraggableInterface<CoreInstanceInterface> {
  readonly threshold: ThresholdInterface;
  readonly layoutThresholds: SiblingsThreshold;
  readonly innerOffset: AxesCoordinatesInterface;
  readonly offsetPlaceholder: AxesCoordinatesInterface;
  readonly indexPlaceholder: number;

  /** Previous X and Y are used to calculate mouse directions. */
  readonly mousePoints: AxesCoordinatesInterface;
  readonly isViewportRestricted: boolean;

  /**
   * If the dragged is moving opposite to the center X/Y.
   * Far from Y, is moving down.
   * Far from X, is moving right.
   */
  readonly isMovingAwayFrom: AxesCoordinatesBoolInterface;
  readonly isDraggedOutPosition: AxesCoordinatesBoolInterface;
  readonly isDraggedOutContainer: AxesCoordinatesBoolInterface;
  dragAt(x: number, y: number): void;
  /**
   * Check if the dragged out self position or parent container and set the
   * necessary flags.
   */
  isOutThreshold(siblingsK?: string): boolean;

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
