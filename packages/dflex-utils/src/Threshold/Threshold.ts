/* eslint-disable max-classes-per-file */
import { PointNum } from "../Point";

import type {
  RectDimensions,
  RectBoundaries,
  Dimensions,
  Axis,
  Direction,
} from "../types";

import { FourDirectionsBool } from "../FourDirections";

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
    console.log(
      "file: Threshold.ts ~ line 185 ~ unifiedContainerDimensions",
      unifiedContainerDimensions
    );

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

  getThresholdByDirection(
    axis: Axis,
    direction: Direction,
    key: string
  ): number {
    const { top, left, bottom, right } = this.thresholds[key];

    return axis === "x"
      ? direction === -1
        ? left
        : right
      : direction === -1
      ? top
      : bottom;
  }

  /**
   * Check if the element is out of the threshold from given axis.
   *
   * Note: This method checks and sets so the result is always preserved.
   *
   *
   * @param axis
   * @param key
   * @param startingPos
   * @param endingPos
   * @returns
   */
  isOutThresholdByAxis(
    axis: Axis,
    key: string,
    startingPos: number,
    endingPos: number
  ): boolean {
    const { left, right, top, bottom } = this.thresholds[key];

    if (axis === "x") {
      this.isOut[key].setByAxis(axis, startingPos < left, endingPos > right);
    }

    if (axis === "y") {
      this.isOut[key].setByAxis(axis, startingPos < top, endingPos > bottom);
    }

    return this.isOut[key].isOneTruthyByAxis(axis);
  }

  /**
   * Check if the element is out of the threshold from one direction based only
   * on axis and element direction.
   *
   * Note: This method checks and sets so the result is always preserved
   *
   * @param axis
   * @param direction
   * @param key
   * @param startingPos
   * @param endingPos
   * @returns
   */
  isOutThresholdByDirection(
    axis: Axis,
    direction: Direction,
    key: string,
    startingPos: number,
    endingPos: number
  ): boolean {
    const { left, right, top, bottom } = this.thresholds[key];
    console.log("file: Threshold.ts ~ line 254 ~ top", top);

    const is =
      axis === "x"
        ? direction === -1
          ? startingPos < left
          : endingPos > right
        : direction === -1
        ? startingPos < top
        : endingPos > bottom;

    this.isOut[key].setOne(axis, direction, is);

    return is;
  }

  /**
   * Check if the element is out of the threshold from all directions.
   *
   * Note: This method checks and sets so the result is always preserved.
   *
   * @param key
   * @param top
   * @param right
   * @param bottom
   * @param left
   * @returns
   */
  isOutThreshold(
    key: string,
    top: number,
    right: number,
    bottom: number,
    left: number
  ): boolean {
    const ref = this.thresholds[key];

    this.isOut[key].setAll(
      top < ref.top,
      right > ref.right,
      bottom > ref.bottom,
      left < ref.left
    );

    return this.isOut[key].isOneTruthy();
  }

  /**
   * Check if the element is out of the threshold from all directions.
   *
   * Note: This method doesn't preserve the result.
   *
   * @param key
   * @param top
   * @param right
   * @param bottom
   * @param left
   * @returns
   */
  isShallowOutThreshold(
    key: string,
    top: number,
    right: number,
    bottom: number,
    left: number
  ): boolean {
    const ref = this.thresholds[key];

    return (
      top < ref.top ||
      right > ref.right ||
      bottom > ref.bottom ||
      left < ref.left
    );
  }

  destroy(): void {
    // Object.keys(this.thresholds).forEach((key) => {
    //   delete this.thresholds[key];
    // });
    // Object.keys(this.isOut).forEach((key) => {
    //   delete this.isOut[key];
    // });
  }
}

export default DFlexThreshold;
