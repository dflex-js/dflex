import type { ThresholdInterface, ThresholdPercentages } from "../Threshold";
import type { RectDimensions } from "../types";

export interface ScrollInput {
  element: HTMLElement;
  requiredBranchKey: string;
  scrollEventCallback:
    | ((SK: string, isCalledFromScroll: true) => unknown)
    | null;
}

export interface IScroll {
  threshold: ThresholdInterface | null;
  scrollRect: RectDimensions;
  scrollX: number;
  scrollY: number;
  scrollHeight: number;
  scrollWidth: number;
  hasOverflowX: boolean;
  hasOverflowY: boolean;
  allowDynamicVisibility: boolean;
  scrollContainerRef: HTMLElement;
  hasDocumentAsContainer: boolean;
  scrollEventCallback: ScrollInput["scrollEventCallback"];
  hasThrottledFrame: number | null;
  getMaximumScrollContainerLeft(): number;
  getMaximumScrollContainerTop(): number;
  isElementVisibleViewportX(currentLeft: number): boolean;
  isElementVisibleViewportY(currentTop: number): boolean;
  setThresholdMatrix(threshold: ThresholdPercentages): void;
  destroy(): void;
}
