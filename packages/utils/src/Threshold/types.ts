import type { Rect } from "@dflex/utils";

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

export interface IndicatorsInterface {
  isInTop: boolean;
  isInBottom: boolean;
  isInLeft: boolean;
  isInRight: boolean;
  isInsideTop(y: number): boolean;
  isInsideBottom(y: number): boolean;
  isInsideYThreshold(y: number): boolean;
  isInsideLeft(x: number): boolean;
  isInsideRight(x: number): boolean;
  isInsideXThreshold(x: number): boolean;
  isInsideThreshold(x: number, y: number): boolean;
  set($: ThresholdCoordinate): void;
}

export interface ThresholdInterface {
  indicators: IndicatorsInterface;
  setMainThreshold(rect: Rect, isContainer: boolean): void;
}

export interface LayoutThresholdInterface {
  [key: string]: IndicatorsInterface;
}

export interface ThresholdLayoutInterface extends ThresholdInterface {
  layout: LayoutThresholdInterface;

  /** Calculate and store the threshold for layout. */
  addNewLayout(key: string, rect: Rect): void;
}
