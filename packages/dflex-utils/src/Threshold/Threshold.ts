import { PointNum } from "../Point";

import type { RectDimensions, RectBoundaries, Dimensions } from "../types";

import FourDirectionsBool from "./FourDirectionsBool";

import { dirtyAssignBiggestRect } from "../collections";

export interface ThresholdPercentages {
  /** vertical threshold in percentage from 0-100 */
  vertical: number;

  /** horizontal threshold in percentage from 0-100 */
  horizontal: number;
}

class DFlexThreshold {
  readonly thresholds: Record<string, RectBoundaries>;

  private _pixels!: PointNum;

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
    isInner: boolean
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

    if (__DEV__) {
      if (this.thresholds[key]) {
        throw new Error(`Threshold ${key} already exists`);
      }
    }

    this.thresholds[key] = Object.seal(threshold);

    this.isOut[key] = new FourDirectionsBool();
  }

  private _addDepthThreshold(key: string, depth: number): void {
    const dp = `${depth}`;

    if (!this.thresholds[dp]) {
      this._createThreshold(
        dp,
        {
          ...this.thresholds[key],
        },
        false
      );

      return;
    }

    const $ = this.thresholds[depth];

    dirtyAssignBiggestRect($, this.thresholds[key]);
  }

  setMainThreshold(key: string, rect: RectDimensions, isInner: boolean): void {
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

  /**
   * Assign outer threshold for the container. Along with another threshold
   * called insertion threshold which defines the area where the element can be
   * inserted during the migration taking into consideration the biggest hight
   * and width for the depth by using `unifiedContainerDimensions`. And create
   * accumulated depth threshold.
   *
   * @param SK
   * @param childDepth
   * @param containerRect
   * @param unifiedContainerDimensions
   */
  setContainerThreshold(
    SK: string,
    insertionLayerKey: string,
    childDepth: number,
    containerRect: RectBoundaries,
    unifiedContainerDimensions: Dimensions
  ): void {
    // Regular threshold.
    this._createThreshold(SK, containerRect, false);

    const { top, left } = containerRect;
    const { height, width } = unifiedContainerDimensions;

    // Insertion threshold.
    this._createThreshold(
      insertionLayerKey,
      {
        left,
        top,
        right: left + width,
        bottom: top + height,
      },
      false
    );

    // Accumulated depth threshold. Accumulation based on insertion layer.
    this._addDepthThreshold(insertionLayerKey, childDepth);
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
    Object.keys(this.thresholds).forEach((key) => {
      delete this.thresholds[key];
    });

    Object.keys(this.isOut).forEach((key) => {
      delete this.isOut[key];
    });
  }
}

export default DFlexThreshold;
