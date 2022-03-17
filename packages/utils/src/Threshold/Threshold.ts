import {
  AxesCoordinates,
  AxesCoordinatesInterface,
  AxesFourCoordinatesBool,
} from "../AxesCoordinates";
import { RectDimensions, RectBoundaries } from "../types";
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

  private setPixels({ width, height }: RectDimensions) {
    const x = Math.round((this.percentages.horizontal * width) / 100);
    const y = Math.round((this.percentages.vertical * height) / 100);

    this.pixels = new AxesCoordinates(x, y);
  }

  private getScrollThreshold(rect: RectDimensions) {
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

  setScrollThreshold(key: string, rect: RectDimensions) {
    this.setPixels(rect);

    this.thresholds[key] = this.getScrollThreshold(rect);

    if (!this.isOut[key]) {
      this.isOut[key] = new AxesFourCoordinatesBool();
    } else {
      this.isOut[key].reset();
    }
  }

  private getThreshold(rect: RectBoundaries) {
    const { top, left, bottom, right } = rect;
    console.log("file: Threshold.ts ~ line 72 ~ height", bottom);

    const { x, y } = this.pixels;
    console.log("file: Threshold.ts ~ line 72 ~ x", x);

    return {
      left: left - x,
      right: right + x,
      top: top - y,
      bottom: bottom + y,
    };
  }

  setThreshold(
    key: string,
    rect: RectBoundaries | RectDimensions,
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

  isOutThresholdH(key: string, XLeft: number, XRight: number) {
    const { left, right } = this.thresholds[key];

    console.log("file: Threshold.ts ~ line 105 ~ XRight", key, right, XRight);
    this.isOut[key].setOutX({
      left: XLeft < left,
      right: XRight > right,
    });

    return this.isOut[key].isOutX();
  }

  isOutThresholdV(key: string, YTop: number, YBottom: number) {
    const { top, bottom } = this.thresholds[key];

    this.isOut[key].setOutY({
      up: YTop < top,
      down: YBottom > bottom,
    });

    console.log(
      "file: Threshold.ts ~ line 113 ~  top, bottom ",
      key,
      // y,
      top,
      bottom,
      this.isOut[key].isOutY()
    );

    return this.isOut[key].isOutY();
  }
}

export default Threshold;
