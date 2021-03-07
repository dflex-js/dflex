import { DraggableDnD } from "../Draggable/types";

export interface DroppableInterface {
  draggable: DraggableDnD;
  topDifference: number;
  leftDifference: number;
  effectedElemDirection: number;
  isListLocked: boolean;
  prevIsListLocked: boolean;
  isOutStatusHorizontally: boolean;
  droppableIndex: number;
  isFoundBreakingPoint: boolean;
}
