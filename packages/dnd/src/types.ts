/**
 * Copyright (c) Jalal Maskoun.
 *
 * This source code is licensed under the AGPL3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
import type { ThresholdPercentages, Restrictions } from "./Draggable";

export interface ScrollOptWithoutThreshold {
  speed: number;
  enable: boolean;
}

export interface ScrollOptWithPartialThreshold
  extends ScrollOptWithoutThreshold {
  thresholdPercentage: Partial<ThresholdPercentages>;
}

export interface ScrollOptWithThreshold extends ScrollOptWithoutThreshold {
  thresholdPercentage: ThresholdPercentages;
}

export interface RestrictionsStatus {
  isContainerRestricted: boolean;
  isSelfRestricted: boolean;
}

export interface FinalDndOpts {
  thresholdPercentage: ThresholdPercentages;
  restrictions: Restrictions;
  restrictionsStatus: RestrictionsStatus;
  scroll: ScrollOptWithThreshold;
}

export interface DndOpts {
  thresholdPercentage?: Partial<ThresholdPercentages>;
  restrictions?: {
    self?: Partial<Restrictions["self"]>;
    container?: Partial<Restrictions["container"]>;
  };
  scroll?: Partial<ScrollOptWithPartialThreshold>;
}
