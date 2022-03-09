import type { AxesCoordinatesInterface, Axes } from "@dflex/utils";
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
  readonly isDraggedOutPosition: AxesCoordinatesInterface<boolean>;
  readonly isOutSiblingsHorizontally: boolean;
  readonly isDraggedPositionFixed: boolean;
  isOutActiveSiblingsContainer: boolean;
  setDraggedTempIndex(i: number): void;
  dragAt(x: number, y: number): void;
  updateNumOfElementsTransformed(effectedElemDirection: number): void;
  setDraggedMovementDirection(coordinate: number, axes: Axes): void;
  isOutThreshold(siblingsK?: string): boolean;
  isLeavingFromTop(): boolean;
  isLeavingFromBottom(): boolean;
  isNotSettled(): boolean;
  endDragging(isFallback: boolean): void;
}
