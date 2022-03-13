import type {
  ThresholdInterface,
  Rect,
  ThresholdPercentages,
} from "@dflex/utils";

export interface ScrollInput {
  element: HTMLElement;
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
