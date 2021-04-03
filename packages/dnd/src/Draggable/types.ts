/* eslint-disable no-unused-vars */
import type { CoreInstanceInterface, Offset } from "@dflex/core-instance";
import type { ELmBranch } from "@dflex/dom-gen";
import type { AbstractDraggableInterface } from "@dflex/draggable";

export interface ThresholdPercentages {
  vertical: number;
  horizontal: number;
}

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
  allowLeavingFromTop: boolean;
  allowLeavingFromBottom: boolean;
  allowLeavingFromLeft: boolean;
  allowLeavingFromRight: boolean;
}

export interface DraggableOpts {
  restrictions: Restrictions;
  thresholds: ThresholdPercentages;
}

export interface DraggableBaseInterface
  extends AbstractDraggableInterface<CoreInstanceInterface> {
  tempIndex: number;
  operationID: string;

  opts: DraggableOpts;

  parentsList: ELmBranch | null;
  siblingsList: ELmBranch | null;
  activeParent: CoreInstanceInterface | null;

  thresholds: LayoutThresholds;

  isOutActiveParent: boolean;
  thresholdsPercentages: ThresholdPercentages;
  setThreshold(
    top: number,
    left: number,
    height?: number,
    siblingsK?: string
  ): void;
}

export interface DraggableDnDInterface extends DraggableBaseInterface {
  // innerOffsetX: number;
  // innerOffsetY: number;
  tempOffset: TempOffset;
  // occupiedOffset: TempOffset;
  // occupiedTranslate: TempTranslate;
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
  // getLastElmIndex(): number;
  // isLastELm(): boolean;

  endDragging(topDifference: number): void;
}
