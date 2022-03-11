import { Rect } from "@dflex/utils";
import Threshold from "./Threshold";
import { ThresholdPercentages, ThresholdBoundariesInterface } from "./types";

class ThresholdBoundaries
  extends Threshold
  implements ThresholdBoundariesInterface
{
  constructor(
    percentages: ThresholdPercentages,
    rect: Rect,
    { isContainer }: { isContainer: boolean }
  ) {
    super(percentages, rect, { isContainer });
  }
}

export default ThresholdBoundaries;
