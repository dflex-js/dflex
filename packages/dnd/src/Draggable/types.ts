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

export interface SiblingsThresholdMatrix {
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

export interface DraggableDnDInterface
  extends AbstractDraggableInterface<CoreInstanceInterface> {
  readonly operationID: string;
  readonly threshold: ThresholdInterface;
  readonly layoutThresholds: SiblingsThresholdMatrix;
  readonly innerOffset: AxesCoordinatesInterface;
  readonly offsetPlaceholder: AxesCoordinatesInterface;
  readonly indexPlaceholder: number;
  setOfTransformedIds?: Set<string>;
  siblingsContainer: CoreInstanceInterface | null;
  scroll: ScrollOptWithThreshold;
  readonly occupiedOffset: AxesCoordinatesInterface;
  readonly occupiedTranslate: AxesCoordinatesInterface;
  readonly mousePoints: AxesCoordinatesInterface;
  readonly numberOfElementsTransformed: number;
  readonly isViewportRestricted: boolean;
  readonly isMovingDown: boolean;
  readonly isMovingLeft: boolean;
  readonly isDraggedOutPosition: AxesCoordinatesBoolInterface;
  readonly isDraggedOutContainer: AxesCoordinatesBoolInterface;
  readonly isDraggedPositionFixed: boolean;
  setDraggedTempIndex(i: number): void;
  dragAt(x: number, y: number): void;
  updateNumOfElementsTransformed(effectedElemDirection: number): void;
  setDraggedMovementDirection(coordinate: number, axes: Axes): void;
  /**
   * Check if the dragged out self position or parent container and set the
   * necessary flags.
   */
  isOutThreshold(siblingsK?: string): boolean;

  /** Checks if dragged index is first the mouse going up. Valid only if dragged
   * is out self threshold.
   */
  isLeavingFromHead(): boolean;

  /** Checks if dragged index is last the mouse going down. Valid only if dragged
   * is out self threshold.
   */
  isLeavingFromTail(): boolean;
  isNotSettled(): boolean;
  endDragging(isFallback: boolean): void;
}
