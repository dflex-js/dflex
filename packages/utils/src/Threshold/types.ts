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

export interface ThresholdInterface {
  main: ThresholdCoordinate;
  // getThreshold(rect: Rect, isContainer: boolean): ThresholdCoordinate;
  setMainThreshold(rect: Rect, isContainer: boolean): void;
}

export interface LayoutThresholdInterface {
  [key: string]: ThresholdCoordinate;
}

export interface ThresholdBoundariesInterface extends ThresholdInterface {
  /** Store for layout threshold. */
  layout: LayoutThresholdInterface;

  isInsideFromTop: boolean;

  isInsideFromBottom: boolean;

  isInsideFromLeft: boolean;

  isInsideFromRight: boolean;

  /** Calculate and store the threshold for layout. */
  addNewLayout(key: string, rect: Rect): void;

  isInsideTop(y: number, sk?: string): boolean;
  isInsideBottom(y: number, sk?: string): boolean;
  isInsideYThreshold(y: number, sk?: string): boolean;
  isInsideLeft(x: number, sk?: string): boolean;
  isInsideRight(x: number, sk?: string): boolean;
  isInsideXThreshold(x: number, sk?: string): boolean;
}
