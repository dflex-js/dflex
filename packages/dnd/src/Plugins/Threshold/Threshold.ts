/* eslint-disable max-classes-per-file */
import { AxesCoordinates, AxesCoordinatesInterface, Rect } from "@dflex/utils";
import type {
  ThresholdInterface,
  ThresholdPointInterface,
  ThresholdCoordinate,
  ThresholdPercentages,
} from "./types";

class ThresholdPoint implements ThresholdPointInterface {
  max: number;

  min: number;

  constructor(max: number, min: number) {
    this.max = max;
    this.min = min;
  }
}

class Threshold implements ThresholdInterface {
  percentages: ThresholdInterface["percentages"];

  private pixels!: AxesCoordinatesInterface;

  main!: ThresholdCoordinate;

  constructor(
    percentages: ThresholdPercentages,
    rect: Rect,
    { isContainer }: { isContainer: boolean }
  ) {
    this.percentages = percentages;

    this.setMainThreshold(rect, isContainer);
  }

  private setPixels({ width, height }: Rect) {
    const x = Math.round((this.percentages.horizontal * width) / 100);

    const y = Math.round((this.percentages.vertical * height) / 100);

    this.pixels = new AxesCoordinates(x, y);
  }

  getThreshold(rect: Rect, isContainer: boolean) {
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
  }
}

export default Threshold;
