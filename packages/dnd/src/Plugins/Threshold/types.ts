import { Rect } from "packages/core-instance/src/types";

export interface ThresholdPercentages {
  /** vertical threshold in percentage from 0-100 */
  vertical: number;

  /** horizontal threshold in percentage from 0-100 */
  horizontal: number;
}

/**
 * Threshold in pixel relevant to input percentages.
 */
export interface ThresholdInPixels {
  x: number;
  y: number;
}

/**
 * Four directions threshold.
 */
export interface ThresholdMatrix {
  maxBottom: number;
  maxTop: number;
  maxLeft: number;
  maxRight: number;
}

export interface ThresholdInterface {
  thresholdPercentages: ThresholdPercentages;
  thresholdPixels: ThresholdInPixels;
  thresholdMatrix: ThresholdMatrix;
  getThresholdMatrix(
    top: number,
    left: number,
    height?: number,
    relativeToViewport?: boolean
  ): ThresholdMatrix;
  updateElementThresholdMatrix(
    elementRect: Rect,
    relativeToContainer: boolean,
    relativeToViewport?: boolean
  ): void;
}
