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
  indexPlaceholder: number;
  operationID: string;
  setOfTransformedIds?: Set<string>;
  siblingsContainer: CoreInstanceInterface | null;
  scroll: ScrollOptWithThreshold;
  threshold: ThresholdInterface;
  layoutThresholds: SiblingsThresholdMatrix;
  innerOffset: AxesCoordinatesInterface;
  offsetPlaceholder: AxesCoordinatesInterface;
  occupiedOffset: AxesCoordinatesInterface;
  occupiedTranslate: AxesCoordinatesInterface;
  mousePoints: AxesCoordinatesInterface;
  numberOfElementsTransformed: number;
  isViewportRestricted: boolean;
  isMovingDown: boolean;
  isMovingLeft: boolean;
  isOutPositionHorizontally: boolean;
  isOutSiblingsHorizontally: boolean;
  isDraggedPositionFixed: boolean;
  isOutActiveSiblingsContainer: boolean;
  dragAt(x: number, y: number): void;
  incNumOfElementsTransformed(effectedElemDirection: number): void;
  setDraggedMovementDirection(coordinate: number, axes: Axes): void;
  isOutThreshold(siblingsK?: string): boolean;
  isLeavingFromTop(): boolean;
  isLeavingFromBottom(): boolean;
  isNotSettled(): boolean;
  endDragging(isFallback: boolean): void;
}
