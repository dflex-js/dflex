import { CoreInstanceInterface } from "@dflex/core-instance/src/pkgTypes";
import { ELmBranch } from "@dflex/dom-gen/src/pkgTypes";
import {
  AbstractDraggableInterface,
  DraggedElm,
} from "@dflex/draggable/src/pkTypes";

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
  parents: { [id: string]: ThresholdContent };
  dragged: Threshold;
}

export interface DraggableDnDBase
  extends AbstractDraggableInterface<CoreInstanceInterface> {
  tempIndex: number;
  dragID: string;

  parentsList: ELmBranch | null;
  siblingsList: ELmBranch;

  thresholds: Thresholds;

  isSingleton: boolean;
  isOrphan: boolean;
  isOutActiveParent: boolean;
  setThreshold(droppable: CoreInstanceInterface, isParent?: boolean): void;
}

export interface DraggableDnD extends DraggableDnDBase {
  innerOffsetX: number;
  innerOffsetY: number;
  tempOffset: TempOffset;
  prevX: number;
  prevY: number;
  numberOfElementsTransformed: number;
  inc: number;
  isMovingDownPrev: boolean;
  isMovingDown: boolean;
  isOutHorizontal: boolean;
  dragAt(x: number, y: number): void;
  incNumOfElementsTransformed(): void;
  setDraggedMovingDown(y: number): void;
  toggleElementsTransformedInc(): void;
  isDraggedOut(id?: string): boolean;
  isDraggedVerticallyInsideList(): boolean;
  isDraggedLeavingFromTop(): boolean;
  isDraggedLeavingFromEnd(): boolean;
  isSiblingsTransformed(): boolean;
  endDragging(topDifference: number): void;
}
