/* eslint-disable max-classes-per-file */
import { PointNum } from "../Point";

import type { Dimensions, Axis, Direction } from "../types";

import { AbstractBox, BoxBool, BoxRectAbstract } from "../Box";

import { dirtyAssignBiggestRect } from "../collections";

export interface ThresholdPercentages {
  /** vertical threshold in percentage from 0-100 */
  vertical: number;

  /** horizontal threshold in percentage from 0-100 */
  horizontal: number;
}

class DFlexThreshold {
  readonly thresholds: Record<string, AbstractBox>;

  private _pixels!: PointNum;

  private _percentages: ThresholdPercentages;

  isOut: Record<string, BoxBool>;

  constructor(percentages: ThresholdPercentages) {
    this._percentages = percentages;
    this.thresholds = {};
    this.isOut = {};
  }

  private _setPixels({ width, height }: Dimensions): void {
    const x = Math.round((this._percentages.horizontal * width) / 100);
    const y = Math.round((this._percentages.vertical * height) / 100);

    this._pixels = new PointNum(x, y);
  }

  private _getThreshold(rect: AbstractBox, isInner: boolean): AbstractBox {
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
    rect: AbstractBox,
    isInner: boolean
  ): void {
    const threshold = this._getThreshold(rect, isInner);

    if (__DEV__) {
      if (this.thresholds[key]) {
        throw new Error(`Threshold ${key} already exists`);
      }
    }

    this.thresholds[key] = Object.seal(threshold);

    this.isOut[key] = new BoxBool(false, false, false, false);
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
   * @param boxRect
   * @param isInner
   */
  setMainThreshold(
    key: string,
    boxRect: BoxRectAbstract,
    isInner: boolean
  ): void {
    this._setPixels(boxRect);

    this._createThreshold(key, boxRect, isInner);
  }

  /**
   * Update existing threshold with new dimensions.
   *
   * @param key
   * @param rect
   * @param isInner
   */
  updateMainThreshold(key: string, rect: AbstractBox, isInner: boolean): void {
    const threshold = this._getThreshold(rect, isInner);

    if (__DEV__) {
      if (!this.thresholds[key]) {
        throw new Error(`Threshold ${key} does not exist.`);
      }
    }

    Object.assign(this.thresholds[key], threshold);

    this.isOut[key].setFalsy();
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
    containerRect: AbstractBox,
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

    this.isOut[key].setBox(
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
    Object.keys(this.thresholds).forEach((key) => {
      delete this.thresholds[key];
    });
    Object.keys(this.isOut).forEach((key) => {
      delete this.isOut[key];
    });
  }
}

export default DFlexThreshold;
