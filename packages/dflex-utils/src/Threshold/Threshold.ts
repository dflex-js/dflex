import { PointNum } from "../Point";
import type { IPointNum } from "../Point";

import type { RectDimensions, RectBoundaries, Dimensions } from "../types";

import FourDirectionsBool from "./FourDirectionsBool";

import { combineKeys, dirtyAssignBiggestRect } from "../collections";

type ThresholdCoordinate = {
  top: number;
  left: number;
  right: number;
  bottom: number;
};

export interface ThresholdPercentages {
  /** vertical threshold in percentage from 0-100 */
  vertical: number;

  /** horizontal threshold in percentage from 0-100 */
  horizontal: number;
}

class Threshold {
  readonly thresholds: Record<string, ThresholdCoordinate>;

  private _pixels!: IPointNum;

  private _percentages: ThresholdPercentages;

  isOut: Record<string, FourDirectionsBool>;

  constructor(percentages: ThresholdPercentages) {
    this._percentages = percentages;
    this.thresholds = {};
    this.isOut = {};
  }

  private _setPixels({ width, height }: RectDimensions): void {
    const x = Math.round((this._percentages.horizontal * width) / 100);
    const y = Math.round((this._percentages.vertical * height) / 100);

    this._pixels = new PointNum(x, y);
  }

  /** Assign threshold property and create new instance for is out indicators */
  private _createThreshold(
    key: string,
    rect: RectBoundaries,
    isInner?: true
  ): void {
    const { top, left, bottom, right } = rect;

    const { x, y } = this._pixels;

    const threshold = isInner
      ? {
          left: left + x,
          right: right - x,
          top: top + y,
          bottom: bottom - y,
        }
      : {
          left: left - x,
          right: right + x,
          top: top - y,
          bottom: bottom + y,
        };

    this.thresholds[key] = Object.seal(threshold);

    this.isOut[key] = new FourDirectionsBool();
  }

  private _addDepthThreshold(key: string, depth: number): void {
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

  setMainThreshold(key: string, rect: RectDimensions, isInner?: true): void {
    this._setPixels(rect);

    const { top, left, height, width } = rect;

    const rectBoundaries = {
      top,
      left,
      right: left + width,
      bottom: top + height,
    };

    this._createThreshold(key, rectBoundaries, isInner);
  }

  setContainerThreshold(
    key: string,
    depth: number,
    rect: RectBoundaries,
    unifiedContainerDimensions: Dimensions
  ): void {
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

  isOutThresholdH(key: string, XLeft: number, XRight: number): boolean {
    const { left, right } = this.thresholds[key];

    this.isOut[key].setOutX(XLeft < left, XRight > right);

    return this.isOut[key].isOutX();
  }

  isOutThresholdV(key: string, YTop: number, YBottom: number): boolean {
    const { top, bottom } = this.thresholds[key];

    this.isOut[key].setOutY(YTop < top, YBottom > bottom);

    return this.isOut[key].isOutY();
  }

  destroy(): void {
    // @ts-expect-error
    this.thresholds = null;
    // @ts-expect-error
    this.isOut = null;
  }
}

export default Threshold;
