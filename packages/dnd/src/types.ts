/**
 * Copyright (c) Jalal Maskoun.
 *
 * This source code is licensed under the AGPL3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
import type { ThresholdPercentages, Restrictions } from "./Draggable";

export interface DndObjectOpts {
  thresholds?: Partial<ThresholdPercentages>;
  restrictions?: Partial<Restrictions>;
}

export interface DndOpts extends DndObjectOpts {
  autoScroll?: boolean;
}
