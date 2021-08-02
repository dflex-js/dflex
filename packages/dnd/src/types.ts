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
  threshold: Partial<ThresholdPercentages>;
}

export interface ScrollOptWithThreshold extends ScrollOptWithoutThreshold {
  threshold: ThresholdPercentages;
}

export interface FinalScrollOpt {
  speed: number;
  enable: boolean;
  threshold: ThresholdPercentages;
}

export interface FinalDndOpts {
  threshold: ThresholdPercentages;
  restrictions: Restrictions;
  scroll: ScrollOptWithThreshold;
}

export interface DndOpts {
  threshold?: Partial<ThresholdPercentages>;
  restrictions?: Partial<Restrictions>;
  scroll?: Partial<ScrollOptWithPartialThreshold>;
}
