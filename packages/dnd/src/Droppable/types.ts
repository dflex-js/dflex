import { DraggableDnD } from "../Draggable";

export interface DroppableInterface {
  draggable: DraggableDnD;
  topDifference: number;
  leftDifference: number;
  isListLocked: boolean;
  prevIsListLocked: boolean;
  droppableIndex: number;
  isFoundBreakingPoint: boolean;
}
