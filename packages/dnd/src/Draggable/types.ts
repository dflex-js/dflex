/**
 * Copyright (c) Jalal Maskoun.
 *
 * This source code is licensed under the AGPL3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { CoreInstanceInterface } from "@dflex/core-instance";
import type { AbstractDraggableInterface, Coordinates } from "@dflex/draggable";

import type { ScrollOptWithThreshold } from "../types";

import type { ThresholdInterface, ThresholdMatrix } from "../utils/Threshold";

export interface SiblingsThresholdMatrix {
  [sk: string]: ThresholdMatrix;
}

export interface TempOffset {
  currentLeft: number;
  currentTop: number;
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
  tempIndex: number;
  operationID: string;
  scroll: ScrollOptWithThreshold;
  isViewportRestricted: boolean;
  threshold: ThresholdInterface;
  layoutThresholds: SiblingsThresholdMatrix;
  innerOffsetX: number;
  innerOffsetY: number;
  tempOffset: TempOffset;
  occupiedOffset: TempOffset;
  occupiedTranslate: Coordinates;
  prevY: number;
  numberOfElementsTransformed: number;
  isMovingDown: boolean;
  isOutPositionHorizontally: boolean;
  isOutSiblingsHorizontally: boolean;
  dragAt(x: number, y: number): void;
  incNumOfElementsTransformed(effectedElemDirection: number): void;
  setDraggedMovingDown(y: number): void;
  isOutThreshold(siblingsK?: string): boolean;
  isLeavingFromTop(): boolean;
  isLeavingFromBottom(): boolean;
  isNotSettled(): boolean;
  endDragging(isFallback: boolean): void;
}
