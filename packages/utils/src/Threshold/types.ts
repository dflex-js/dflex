import { AxesFourCoordinatesBool } from "../AxesCoordinates";
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

export interface ThresholdsStore {
  [key: string]: ThresholdCoordinate;
}

export interface LayoutPositionStatus {
  [key: string]: AxesFourCoordinatesBool;
}

export interface ThresholdInterface {
  thresholds: ThresholdsStore;
  isOut: LayoutPositionStatus;
  setThreshold(
    key: string,
    rect: Rect,
    isContainer: boolean,
    isUpdatePixels?: boolean
  ): void;
  isOutThresholdH(key: string, x: number): boolean;
  isOutThresholdV(key: string, y: number): boolean;
}
