/* eslint-disable max-classes-per-file */
import {
  AxesCoordinates,
  AxesCoordinatesInterface,
  AxesFourCoordinatesBool,
} from "../AxesCoordinates";
import { Rect } from "../types";
import type {
  ThresholdInterface,
  ThresholdPointInterface,
  ThresholdPercentages,
  ThresholdsStore,
  LayoutPositionStatus,
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
  private pixels!: AxesCoordinatesInterface;

  thresholds: ThresholdsStore;

  private percentages: ThresholdPercentages;

  isOut: LayoutPositionStatus;

  constructor(percentages: ThresholdPercentages) {
    this.percentages = percentages;

    this.thresholds = {};
    this.isOut = {};
  }

  private setPixels({ width, height }: Rect) {
    const x = Math.round((this.percentages.horizontal * width) / 100);

    const y = Math.round((this.percentages.vertical * height) / 100);

    this.pixels = new AxesCoordinates(x, y);
  }

  private getThreshold(rect: Rect, isContainer: boolean) {
    const { top, left, height } = rect;

    const { x, y } = this.pixels;

    const leftThresholdPoint = new ThresholdPoint(left - x, left + x);

    const topThresholdPoint = new ThresholdPoint(
      top - y,
      isContainer ? Math.abs(height + y) : top + y
    );

    return {
      left: leftThresholdPoint,
      top: topThresholdPoint,
    };
  }

  setThreshold(
    key: string,
    rect: Rect,
    isContainer: boolean,
    isUpdatePixels: boolean = false
  ) {
    if (!isContainer || isUpdatePixels) {
      this.setPixels(rect);
    }

    this.thresholds[key] = this.getThreshold(rect, isContainer);

    if (!this.isOut[key]) {
      this.isOut[key] = new AxesFourCoordinatesBool();
    } else {
      this.isOut[key].reset();
    }
  }

  isOutThresholdH(key: string, x: number) {
    const { left } = this.thresholds[key];

    this.isOut[key].setOutX({
      left: x < left.max,
      right: x > left.min,
    });

    return this.isOut[key].isOutX();
  }

  isOutThresholdV(key: string, y: number) {
    const { top } = this.thresholds[key];

    this.isOut[key].setOutY({
      up: y < top.max,
      down: y > top.min,
    });

    return this.isOut[key].isOutY();
  }
}

export default Threshold;
