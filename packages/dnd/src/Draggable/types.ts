/* eslint-disable no-unused-vars */
import type { CoreInstanceInterface, Offset } from "@dflex/core-instance";
import type { ELmBranch } from "@dflex/dom-gen";
import type { AbstractDraggableInterface } from "@dflex/draggable";

export interface ThresholdPercentages {
  vertical: number;
  horizontal: number;
}

export interface TempOffset {
  currentLeft: number;
  currentTop: number;
}

export interface Threshold {
  maxBottom: number;
  maxTop: number;
  maxLeft: number;
  maxRight: number;
}

export interface Thresholds {
  siblings: { [sk: string]: Threshold };
  dragged: Threshold;
}

export interface DraggableDnDBase
  extends AbstractDraggableInterface<CoreInstanceInterface> {
  tempIndex: number;
  dragID: string;

  parentsList: ELmBranch | null;
  siblingsList: ELmBranch | null;
  activeParent: CoreInstanceInterface | null;

  thresholds: Thresholds;

  isOutActiveParent: boolean;
  thresholdsPercentages: ThresholdPercentages;
  setThreshold(
    top: number,
    left: number,
    height?: number,
    siblingsK?: string
  ): void;
}

export interface DraggableDnD extends DraggableDnDBase {
  innerOffsetX: number;
  innerOffsetY: number;
  tempOffset: TempOffset;
  prevY: number;
  numberOfElementsTransformed: number;
  isMovingDownPrev: boolean;
  isMovingDown: boolean;
  isOutHorizontal: boolean;
  dragAt(x: number, y: number): void;
  incNumOfElementsTransformed(effectedElemDirection: number): void;
  setDraggedMovingDown(y: number): void;
  isDraggedOut(id?: string): boolean;
  isDraggedLeavingFromTop(): boolean;
  isDraggedLeavingFromEnd(): boolean;
  isSiblingsTransformed(): boolean;
  endDragging(topDifference: number): void;
}
