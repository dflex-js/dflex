import type { RectBoundaries, RectDimensions } from "../types";
import FourDirectionsBool from "./FourDirectionsBool";

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
  top: number;
  left: number;
  right: number;
  bottom: number;
}

export interface ThresholdsStore {
  [key: string]: ThresholdCoordinate;
}

export interface LayoutPositionStatus {
  [key: string]: FourDirectionsBool;
}

export interface ThresholdInterface {
  thresholds: ThresholdsStore;
  isOut: LayoutPositionStatus;
  setMainThreshold(id: string, rect: RectDimensions): void;
  /** Creates container threshold and detection area threshold using depth as a key. */
  setContainerThreshold(SK: string, depth: number, rect: RectBoundaries): void;
  /** Should be called after initiating depth threshold. */
  setContainerDirectionalThreshold(SK: string, depth: number): void;
  setScrollThreshold(key: string, rect: RectDimensions): void;
  isOutThresholdH(key: string, XLeft: number, XRight: number): boolean;
  isOutThresholdV(key: string, YTop: number, YBottom: number): boolean;
  destroy(): void;
}
