/**
 * Copyright (c) Jalal Maskoun.
 *
 * This source code is licensed under the AGPL3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { ThresholdInterface } from "../Threshold";

export interface ScrollInput {
  scrollEventCallback: Function | null;
}

export interface ScrollInterface {
  threshold: ThresholdInterface | null;
  viewportHeight: number;
  viewportWidth: number;
  scrollEventCallback: Function | null;
  scrollX: number;
  scrollY: number;
  scrollHeight: number;
  scrollContainer: Element;
  hasThrottledFrame: number | null;
  isElementVisibleViewportX(currentLeft: number): boolean;
  isElementVisibleViewportY(currentTop: number): boolean;
  setThresholdMatrix(
    threshold: ThresholdInterface["thresholdPercentages"]
  ): void;
  setScrollContainer(element: Element): void;
  destroy(): void;
}
