import { CoreInstanceInterface } from "packages/coreInstance/src/types";
import {
  AbstractDraggableInterface,
  DraggedElm,
} from "packages/draggable/src/types";

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

  parentsList: CoreInstanceInterface | null;
  siblingsList;

  thresholds: Thresholds;

  isSingleton: boolean;
  isOrphan: boolean;
  isOutActiveParent: boolean;
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
}
