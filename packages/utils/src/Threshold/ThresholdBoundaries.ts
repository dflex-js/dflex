import { Rect } from "@dflex/utils";
import Threshold from "./Threshold";
import { ThresholdPercentages } from "./types";

class ThresholdBoundaries extends Threshold {
  constructor(
    percentages: ThresholdPercentages,
    rect: Rect,
    { isContainer }: { isContainer: boolean }
  ) {
    super(percentages, rect, { isContainer });
  }
}

export default ThresholdBoundaries;
