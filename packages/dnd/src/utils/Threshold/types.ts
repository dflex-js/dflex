/**
 * Copyright (c) Jalal Maskoun.
 *
 * This source code is licensed under the AGPL3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

export interface ThresholdPercentages {
  vertical: number;
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
  updateElementThresholdMatrix(
    width: number,
    height: number,
    left: number,
    top: number
  ): void;
  getThresholdMatrix(
    top: number,
    left: number,
    height?: number
  ): ThresholdMatrix;
}