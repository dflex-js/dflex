import { Rect } from "@dflex/utils";
import Threshold from "./Threshold";
import {
  ThresholdPercentages,
  LayoutThresholdInterface,
  ThresholdBoundariesInterface,
} from "./types";

class ThresholdBoundaries
  extends Threshold
  implements ThresholdBoundariesInterface
{
  layout: LayoutThresholdInterface;

  constructor(
    percentages: ThresholdPercentages,
    rect: Rect,
    { isContainer }: { isContainer: boolean }
  ) {
    super(percentages, rect, { isContainer });

    this.layout = {};
  }

  addNewLayout(key: string, rect: Rect) {
    this.layout[key] = this.getThreshold(rect, true);
  }
}

export default ThresholdBoundaries;
