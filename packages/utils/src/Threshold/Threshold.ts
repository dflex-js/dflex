import {
  AxesCoordinates,
  AxesCoordinatesInterface,
  AxesFourCoordinatesBool,
} from "../AxesCoordinates";
import { Rect } from "../types";
import type {
  ThresholdInterface,
  ThresholdPercentages,
  ThresholdsStore,
  LayoutPositionStatus,
} from "./types";

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

  private getScrollThreshold(rect: Rect) {
    /**
     * Note: Height for container represent the lowest element bottom.
     */
    const { top, left, height, width } = rect;

    const { x, y } = this.pixels;

    return {
      left: Math.abs(left - x),
      right: left - x + width,
      top: Math.abs(top - y),
      bottom: height - y,
    };
  }

  setScrollThreshold(key: string, rect: Rect) {
    this.setPixels(rect);

    this.thresholds[key] = this.getScrollThreshold(rect);

    if (!this.isOut[key]) {
      this.isOut[key] = new AxesFourCoordinatesBool();
    } else {
      this.isOut[key].reset();
    }
  }

  private getThreshold(rect: Rect, isContainer: boolean) {
    /**
     * Note:
     * Height = Bottom, for container represent the lowest element bottom.
     * width = Right, for container represent the rightest element right.
     */
    const { top, left, height, width } = rect;
    console.log("file: Threshold.ts ~ line 72 ~ height", height, height + top);

    const { x, y } = this.pixels;
    console.log("file: Threshold.ts ~ line 72 ~ x", x);

    return {
      left: left - x,
      right: isContainer ? left + width + x : width + left + x,
      top: top - y,
      bottom: isContainer ? height + y : height + top + y,
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
    const { left, right } = this.thresholds[key];

    this.isOut[key].setOutX({
      left: x < left,
      right: x + 170 > right,
    });

    return this.isOut[key].isOutX();
  }

  isOutThresholdV(key: string, y: number) {
    const { top, bottom } = this.thresholds[key];

    this.isOut[key].setOutY({
      up: y < top,
      down: y + 50 > bottom,
    });

    console.log(
      "file: Threshold.ts ~ line 113 ~  top, bottom ",
      key,
      y,
      top,
      bottom,
      this.isOut[key].isOutY()
    );

    return this.isOut[key].isOutY();
  }
}

export default Threshold;
