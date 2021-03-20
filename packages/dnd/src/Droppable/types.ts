import type { DraggableDnDInterface } from "../Draggable";

export interface Restrictions {
  allowLeavingFromTop: boolean;
  allowLeavingFromBottom: boolean;
  allowLeavingFromLeft: boolean;
  allowLeavingFromRight: boolean;
}

export interface DroppableOpts {
  restrictions: Restrictions;
}

export interface DroppableInterface {
  draggable: DraggableDnDInterface;
  topDifference: number;
  leftDifference: number;
  isListLocked: boolean;
  prevIsListLocked: boolean;
  droppableIndex: number;
  isFoundBreakingPoint: boolean;
}
