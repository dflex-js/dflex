import { PointNum } from "../Point";
import type { IPointNum } from "../Point";

import type { RectDimensions, RectBoundaries, Dimensions } from "../types";

import FourDirectionsBool from "./FourDirectionsBool";
import type {
  ThresholdInterface,
  ThresholdPercentages,
  ThresholdsStore,
  LayoutPositionStatus,
} from "./types";
import { combineKeys, dirtyAssignBiggestRect } from "../collections";

class Threshold implements ThresholdInterface {
  thresholds: ThresholdsStore;

  private _pixels!: IPointNum;

  private _percentages: ThresholdPercentages;

  isOut: LayoutPositionStatus;

  constructor(percentages: ThresholdPercentages) {
    this._percentages = percentages;
    this.thresholds = {};
    this.isOut = {};
  }

  private _setPixels({ width, height }: RectDimensions) {
    const x = Math.round((this._percentages.horizontal * width) / 100);
    const y = Math.round((this._percentages.vertical * height) / 100);

    this._pixels = new PointNum(x, y);
  }

  private _initIndicators(key: string) {
    const hasInstance = this.isOut[key] instanceof FourDirectionsBool;

    if (hasInstance) {
      this.isOut[key].reset();

      return;
    }

    this.isOut[key] = new FourDirectionsBool();
  }

  private _getScrollThreshold(rect: RectDimensions) {
    const { top, left, height, width } = rect;

    const { x, y } = this._pixels;

    return {
      left: Math.abs(left - x),
      right: left - x + width,
      top: Math.abs(top - y),
      bottom: height - y,
    };
  }

  setScrollThreshold(key: string, rect: RectDimensions) {
    this._setPixels(rect);

    this.thresholds[key] = this._getScrollThreshold(rect);

    this._initIndicators(key);
  }

  private _getThreshold(rect: RectBoundaries) {
    const { top, left, bottom, right } = rect;

    const { x, y } = this._pixels;

    return {
      left: left - x,
      right: right + x,
      top: top - y,
      bottom: bottom + y,
    };
  }

  /** Assign threshold property and create new instance for is out indicators */
  private _createThreshold(key: string, rect: RectBoundaries) {
    this.thresholds[key] = this._getThreshold(rect);
    this._initIndicators(key);
  }

  setMainThreshold(key: string, rect: RectDimensions) {
    this._setPixels(rect);

    const { top, left, height, width } = rect;

    this._createThreshold(key, {
      top,
      left,
      bottom: top + height,
      right: left + width,
    });
  }

  private _addDepthThreshold(key: string, depth: number) {
    const dp = `${depth}`;

    if (!this.thresholds[dp]) {
      this._createThreshold(dp, {
        ...this.thresholds[key],
      });

      return;
    }

    const $ = this.thresholds[depth];

    dirtyAssignBiggestRect($, this.thresholds[key]);
  }

  setContainerThreshold(
    key: string,
    depth: number,
    rect: RectBoundaries,
    unifiedContainerDimensions: Dimensions
  ) {
    this._createThreshold(key, rect);

    const { top, left } = rect;
    const { height, width } = unifiedContainerDimensions;

    const composedK = combineKeys(depth, key);

    this._createThreshold(composedK, {
      left,
      top,
      right: left + width,
      bottom: top + height,
    });

    this._addDepthThreshold(composedK, depth);
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

  destroy() {
    // @ts-expect-error
    this.thresholds = null;
    // @ts-expect-error
    this.isOut = null;
  }
}

export default Threshold;
