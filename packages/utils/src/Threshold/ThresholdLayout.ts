/* eslint-disable max-classes-per-file */
import ThresholdIndicators from "./Indicators";
import Threshold from "./Threshold";
import type {
  LayoutThresholdInterface,
  ThresholdPercentages,
  ThresholdLayoutInterface,
  ThresholdCoordinate,
} from "./types";

import type { Rect } from "../types";

class ThresholdLayout extends Threshold implements ThresholdLayoutInterface {
  private layoutThreshold: {
    [key: string]: ThresholdCoordinate;
  };

  layout: LayoutThresholdInterface;

  constructor(
    percentages: ThresholdPercentages,
    rect: Rect,
    { isContainer }: { isContainer: boolean }
  ) {
    super(percentages, rect, { isContainer });

    this.layoutThreshold = {};
    this.layout = {};
  }

  addNewLayout(key: string, rect: Rect) {
    this.layoutThreshold[key] = this.getThreshold(rect, true);
    this.layout[key] = new ThresholdIndicators(this.layoutThreshold[key]);
  }
}

export default ThresholdLayout;
