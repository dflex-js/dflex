/**
 * Copyright (c) Jalal Maskoun.
 *
 * This source code is licensed under the AGPL3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
import type { Restrictions } from "./Draggable";
import { ThresholdInterface } from "./utils/Threshold";

export interface ScrollOptWithoutThreshold {
  enable: boolean;
  initialSpeed: number;
}

export interface ScrollOptWithPartialThreshold
  extends ScrollOptWithoutThreshold {
  threshold: Partial<ThresholdInterface["thresholdPercentages"]>;
}

export interface ScrollOptWithThreshold extends ScrollOptWithoutThreshold {
  threshold: ThresholdInterface["thresholdPercentages"];
}

export interface RestrictionsStatus {
  isContainerRestricted: boolean;
  isSelfRestricted: boolean;
}

export interface FinalDndOpts {
  threshold: ThresholdInterface["thresholdPercentages"];
  restrictions: Restrictions;
  restrictionsStatus: RestrictionsStatus;
  scroll: ScrollOptWithThreshold;
}

export interface DndOpts {
  threshold?: Partial<ThresholdInterface["thresholdPercentages"]>;
  restrictions?: {
    self?: Partial<Restrictions["self"]>;
    container?: Partial<Restrictions["container"]>;
  };
  scroll?: Partial<ScrollOptWithPartialThreshold>;
}
