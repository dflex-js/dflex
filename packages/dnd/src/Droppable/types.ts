import type { DraggableDnDInterface } from "../Draggable";

export interface DroppableInterface {
  draggable: DraggableDnDInterface;
  elmYSpace: number;
  leftDifference: number;
  isListLocked: boolean;
  droppableIndex: number;
  isFoundBreakingPoint: boolean;
}
