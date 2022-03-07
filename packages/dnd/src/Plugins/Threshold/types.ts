import type { Rect } from "@dflex/utils";

export interface ThresholdPercentages {
  /** vertical threshold in percentage from 0-100 */
  vertical: number;

  /** horizontal threshold in percentage from 0-100 */
  horizontal: number;
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

export interface ThresholdPointInterface {
  max: number;
  min: number;
}

export interface IMain {
  top: ThresholdPointInterface;
  left: ThresholdPointInterface;
}

export interface ThresholdInterface {
  percentages: ThresholdPercentages;
  thresholdMatrix: ThresholdMatrix;
  main: IMain;
  setMainThreshold(rect: Rect, isContainer: boolean): void;
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
