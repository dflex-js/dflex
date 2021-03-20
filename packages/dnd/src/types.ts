import type { ThresholdPercentages } from "./Draggable";
import type { Restrictions } from "./Droppable";

export interface DndOpts {
  thresholds: ThresholdPercentages;
  restrictions: Restrictions;
}
