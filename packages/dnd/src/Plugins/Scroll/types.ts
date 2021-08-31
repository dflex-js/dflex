/**
 * Copyright (c) Jalal Maskoun.
 *
 * This source code is licensed under the AGPL3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Rect } from "packages/core-instance/src/types";
import type { ThresholdInterface } from "../Threshold";

export interface ScrollInput {
  element: Element;
  requiredBranchKey: string;
  scrollEventCallback:
    | ((SK: string, isCalledFromScroll: true) => unknown)
    | null;
}

export interface ScrollInterface {
  threshold: ThresholdInterface | null;
  scrollRect: Rect;
  scrollX: number;
  scrollY: number;
  scrollHeight: number;
  scrollWidth: number;
  hasOverflowX: boolean;
  hasOverflowY: boolean;
  allowDynamicVisibility: boolean;
  scrollContainer: Element;
  hasDocumentAsContainer: boolean;
  scrollEventCallback: ScrollInput["scrollEventCallback"];
  hasThrottledFrame: number | null;
  getMaximumScrollContainerLeft(): number;
  getMaximumScrollContainerTop(): number;
  isElementVisibleViewportX(currentLeft: number): boolean;
  isElementVisibleViewportY(currentTop: number): boolean;
  setThresholdMatrix(
    threshold: ThresholdInterface["thresholdPercentages"]
  ): void;
  destroy(): void;
}
