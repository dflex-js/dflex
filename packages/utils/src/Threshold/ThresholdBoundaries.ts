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

  isInsideFromTop: boolean;

  isInsideFromBottom: boolean;

  isInsideFromLeft: boolean;

  isInsideFromRight: boolean;

  constructor(
    percentages: ThresholdPercentages,
    rect: Rect,
    { isContainer }: { isContainer: boolean }
  ) {
    super(percentages, rect, { isContainer });

    this.layout = {};

    this.isInsideFromTop = false;
    this.isInsideFromBottom = false;
    this.isInsideFromLeft = false;
    this.isInsideFromRight = false;
  }

  addNewLayout(key: string, rect: Rect) {
    this.layout[key] = this.getThreshold(rect, true);
  }

  isInsideTop(y: number, sk?: string) {
    const { top } = sk ? this.layout[sk] : this.main;

    this.isInsideFromTop = y >= top.min;

    return this.isInsideFromTop;
  }

  isInsideBottom(y: number, sk?: string) {
    const { top } = sk ? this.layout[sk] : this.main;

    this.isInsideFromBottom = y <= top.max;

    return this.isInsideFromBottom;
  }

  isInsideYThreshold(y: number, sk?: string) {
    return this.isInsideTop(y, sk) || this.isInsideBottom(y, sk);
  }

  isInsideLeft(x: number, sk?: string) {
    const { left } = sk ? this.layout[sk] : this.main;

    this.isInsideFromLeft = x >= left.min;

    return this.isInsideFromLeft;
  }

  isInsideRight(x: number, sk?: string) {
    const { left } = sk ? this.layout[sk] : this.main;

    this.isInsideFromRight = x <= left.max;

    return this.isInsideFromRight;
  }

  isInsideXThreshold(x: number, sk?: string) {
    return this.isInsideLeft(x, sk) || this.isInsideRight(x, sk);
  }
}

export default ThresholdBoundaries;
