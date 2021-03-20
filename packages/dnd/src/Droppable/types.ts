import type { DraggableDnDInterface } from "../Draggable";

export interface DroppableInterface {
  draggable: DraggableDnDInterface;
  topDifference: number;
  leftDifference: number;
  isListLocked: boolean;
  prevIsListLocked: boolean;
  droppableIndex: number;
  isFoundBreakingPoint: boolean;
}
