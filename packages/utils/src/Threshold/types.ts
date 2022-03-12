import type { Rect } from "../types";

export interface ThresholdPercentages {
  /** vertical threshold in percentage from 0-100 */
  vertical: number;

  /** horizontal threshold in percentage from 0-100 */
  horizontal: number;
}

export interface ThresholdPointInterface {
  max: number;
  min: number;
}

export interface ThresholdCoordinate {
  top: ThresholdPointInterface;
  left: ThresholdPointInterface;
}

export interface ThresholdInterface {
  main: ThresholdCoordinate;
  getThreshold(rect: Rect, isContainer: boolean): ThresholdCoordinate;
  setMainThreshold(rect: Rect, isContainer: boolean): void;
}
