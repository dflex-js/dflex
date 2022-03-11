/* eslint-disable max-classes-per-file */
import { AxesCoordinates } from "../AxesCoordinates";
import type { AxesCoordinatesInterface } from "../AxesCoordinates";

import type {
  ThresholdInterface,
  ThresholdPointInterface,
  ThresholdCoordinate,
  ThresholdPercentages,
  IndicatorsInterface,
} from "./types";

import type { Rect } from "../types";

import ThresholdLayout from "./Indicators";

class ThresholdPoint implements ThresholdPointInterface {
  max: number;

  min: number;

  constructor(max: number, min: number) {
    this.max = max;
    this.min = min;
  }
}

class Threshold implements ThresholdInterface {
  private percentages: ThresholdPercentages;

  private pixels!: AxesCoordinatesInterface;

  private main!: ThresholdCoordinate;

  indicators: IndicatorsInterface;

  constructor(
    percentages: ThresholdPercentages,
    rect: Rect,
    { isContainer }: { isContainer: boolean }
  ) {
    this.percentages = percentages;
    this.indicators = new ThresholdLayout(this.main);
    this.setMainThreshold(rect, isContainer);
  }

  private setPixels({ width, height }: Rect) {
    const x = Math.round((this.percentages.horizontal * width) / 100);

    const y = Math.round((this.percentages.vertical * height) / 100);

    this.pixels = new AxesCoordinates(x, y);
  }

  protected getThreshold(rect: Rect, isContainer: boolean) {
    const { top, left, height } = rect;

    const { x, y } = this.pixels;

    const leftThresholdPoint = new ThresholdPoint(left - x, left + x);

    const topThresholdPoint = new ThresholdPoint(
      top - y,
      isContainer ? Math.abs(height - y) : top + y
    );

    return {
      left: leftThresholdPoint,
      top: topThresholdPoint,
    };
  }

  setMainThreshold(rect: Rect, isContainer: boolean) {
    this.setPixels(rect);
    this.main = this.getThreshold(rect, isContainer);
    this.indicators.set(this.main);
  }
}

export default Threshold;
