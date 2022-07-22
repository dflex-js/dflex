/* eslint-disable max-classes-per-file */
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

function getBoundariesFromDimensions(rect: RectDimensions): RectBoundaries {
  return {
    top: rect.top,
    left: rect.left,
    bottom: rect.top + rect.height,
    right: rect.left + rect.width,
  };
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

  private _getThreshold(
    rect: RectBoundaries,
    isInner: boolean
  ): RectBoundaries {
    const { x, y } = this._pixels;

    const { top, left, bottom, right } = rect;

    return isInner
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
  }

  /** Assign threshold property and create new instance for is out indicators */
  private _createThreshold(
    key: string,
    rect: RectBoundaries,
    isInner: boolean
  ): void {
    const threshold = this._getThreshold(rect, isInner);

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

  /**
   * Set the main threshold for the element based on the element's dimensions
   * and threshold types. For dragged and containers threshold type is outer
   * `isInner=false` and for the rest of the elements `isInner=true.`
   * Note: Duplicate threshold keys will throw an error.
   *
   * @param key
   * @param rect
   * @param isInner
   */
  setMainThreshold(key: string, rect: RectDimensions, isInner: boolean): void {
    this._setPixels(rect);

    this._createThreshold(key, getBoundariesFromDimensions(rect), isInner);
  }

  /**
   * Update existing threshold with new dimensions.
   *
   * @param key
   * @param rect
   * @param isInner
   */
  updateMainThreshold(
    key: string,
    rect: RectDimensions,
    isInner: boolean
  ): void {
    const threshold = this._getThreshold(
      getBoundariesFromDimensions(rect),
      isInner
    );

    if (__DEV__) {
      if (!this.thresholds[key]) {
        throw new Error(`Threshold ${key} does not exist.`);
      }
    }

    Object.assign(this.thresholds[key], threshold);

    this.isOut[key].reset();
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

  isOutLeftThreshold(key: string, XLeft: number): boolean {
    const { left } = this.thresholds[key];

    const is = XLeft < left;

    this.isOut[key].outHorizontal.setAxes(is, this.isOut[key].outHorizontal.y);

    return is;
  }

  isOutRightThreshold(key: string, XRight: number): boolean {
    const { right } = this.thresholds[key];

    const is = XRight > right;

    this.isOut[key].outHorizontal.setAxes(this.isOut[key].outHorizontal.x, is);

    return is;
  }

  isOutTopThreshold(key: string, YTop: number): boolean {
    const { top } = this.thresholds[key];

    const is = YTop < top;

    this.isOut[key].outVertical.setAxes(is, this.isOut[key].outVertical.y);

    return is;
  }

  isOutBottomThreshold(key: string, YBottom: number): boolean {
    const { bottom } = this.thresholds[key];

    const is = YBottom > bottom;

    this.isOut[key].outVertical.setAxes(this.isOut[key].outVertical.x, is);

    return is;
  }

  isOutThresholdH(key: string, XLeft: number, XRight: number): boolean {
    const { left, right } = this.thresholds[key];

    this.isOut[key].outHorizontal.setAxes(XLeft < left, XRight > right);

    return this.isOut[key].outHorizontal.isOneTruthy();
  }

  isOutThresholdV(key: string, YTop: number, YBottom: number): boolean {
    const { top, bottom } = this.thresholds[key];

    this.isOut[key].outVertical.setAxes(YTop < top, YBottom > bottom);

    return this.isOut[key].outVertical.isOneTruthy();
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
