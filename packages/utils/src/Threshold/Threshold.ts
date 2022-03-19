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
  #pixels!: AxesCoordinatesInterface;

  #percentages: ThresholdPercentages;

  thresholds: ThresholdsStore;

  isOut: LayoutPositionStatus;

  constructor(percentages: ThresholdPercentages) {
    this.#percentages = percentages;

    this.thresholds = {};
    this.isOut = {};
  }

  #setPixels({ width, height }: RectDimensions) {
    const x = Math.round((this.#percentages.horizontal * width) / 100);
    const y = Math.round((this.#percentages.vertical * height) / 100);

    this.#pixels = new AxesCoordinates(x, y);
  }

  #initIndicators(key: string) {
    if (!this.isOut[key]) {
      this.isOut[key] = new AxesFourCoordinatesBool();
    } else {
      this.isOut[key].reset();
    }
  }

  private getScrollThreshold(rect: RectDimensions) {
    const { top, left, height, width } = rect;

    const { x, y } = this.#pixels;

    return {
      left: Math.abs(left - x),
      right: left - x + width,
      top: Math.abs(top - y),
      bottom: height - y,
    };
  }

  setScrollThreshold(key: string, rect: RectDimensions) {
    this.#setPixels(rect);

    this.thresholds[key] = this.getScrollThreshold(rect);

    if (!this.isOut[key]) {
      this.isOut[key] = new AxesFourCoordinatesBool();
    } else {
      this.isOut[key].reset();
    }
  }

  private getThreshold(rect: RectBoundaries) {
    const { top, left, bottom, right } = rect;

    const { x, y } = this.#pixels;

    return {
      left: left - x,
      right: right + x,
      top: top - y,
      bottom: bottom + y,
    };
  }

  setMainThreshold(key: string, rect: RectDimensions) {
    this.#setPixels(rect);

    const { top, left, height, width } = rect;

    this.thresholds[key] = this.getThreshold({
      top,
      left,
      bottom: top + height,
      right: left + width,
    });

    this.#initIndicators(key);
  }

  setContainerThreshold(key: string, rect: RectBoundaries) {
    this.thresholds[key] = this.getThreshold(rect);
    this.#initIndicators(key);
  }

  isOutThresholdH(key: string, XLeft: number, XRight: number) {
    const { left, right } = this.thresholds[key];

    this.isOut[key].setOutX(XLeft < left, XRight > right);

    return this.isOut[key].isOutX();
  }

  isOutThresholdV(key: string, YTop: number, YBottom: number) {
    const { top, bottom } = this.thresholds[key];

    this.isOut[key].setOutY(YTop < top, YBottom > bottom);

    return this.isOut[key].isOutY();
  }
}

export default Threshold;
