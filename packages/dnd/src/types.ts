import type { ThresholdPercentages } from "./Draggable";

export interface Restrictions {
  allowLeavingFromTop: boolean;
  allowLeavingFromBottom: boolean;
  allowLeavingFromLeft: boolean;
  allowLeavingFromRight: boolean;
}

export interface DndOpts {
  thresholds: ThresholdPercentages;
  restrictions: Restrictions;
}
