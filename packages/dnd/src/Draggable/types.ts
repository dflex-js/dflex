/**
 * Copyright (c) Jalal Maskoun.
 *
 * This source code is licensed under the AGPL3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { CoreInstanceInterface, Rect } from "@dflex/core-instance";
import type { AbstractDraggableInterface } from "@dflex/draggable";
import type { ThresholdInPixels, ScrollOptWithThreshold } from "../types";

export interface Threshold {
  maxBottom: number;
  maxTop: number;
  maxLeft: number;
  maxRight: number;
}

export interface LayoutThresholds {
  siblings: { [sk: string]: Threshold };
  dragged: Threshold;
}

export interface TempOffset {
  currentLeft: number;
  currentTop: number;
}

export interface TempTranslate {
  translateX: number;
  translateY: number;
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

export interface DraggableBaseInterface
  extends AbstractDraggableInterface<CoreInstanceInterface> {
  tempIndex: number;
  operationID: string;
  thresholds: LayoutThresholds;
  isOutActiveParent: boolean;
  draggedThreshold: ThresholdInPixels;
  scroll: ScrollOptWithThreshold;
  isViewportRestricted: boolean;
  seDraggedThreshold(relativeTo: Rect): void;
  setThreshold(
    top: number,
    left: number,
    height?: number,
    siblingsK?: string
  ): void;
}

export interface DraggableDnDInterface extends DraggableBaseInterface {
  innerOffsetX: number;
  innerOffsetY: number;
  tempOffset: TempOffset;
  occupiedOffset: TempOffset;
  occupiedTranslate: TempTranslate;
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
