/* eslint-disable max-classes-per-file */
import { AxesCoordinates, AxesCoordinatesInterface, Rect } from "@dflex/utils";
import type {
  ThresholdInterface,
  ThresholdMatrix,
  ThresholdPointInterface,
  IMain,
  ThresholdPercentages,
} from "./types";

class ThresholdPoint implements ThresholdPointInterface {
  max: number;

  min: number;

  constructor(max: number, min: number) {
    this.max = max;
    this.min = min;
  }
}

class Threshold implements ThresholdInterface {
  percentages: ThresholdInterface["percentages"];

  private pixels!: AxesCoordinatesInterface;

  thresholdMatrix!: ThresholdInterface["thresholdMatrix"];

  main!: IMain;

  constructor(
    percentages: ThresholdPercentages,
    rect: Rect,
    { isContainer }: { isContainer: boolean }
  ) {
    this.percentages = percentages;

    this.setPixels(rect);
    this.setMainThreshold(rect, isContainer);
  }

  private setPixels({ width, height }: Rect) {
    const x = Math.round((this.percentages.horizontal * width) / 100);

    const y = Math.round((this.percentages.vertical * height) / 100);

    this.pixels = new AxesCoordinates(x, y);
  }

  setMainThreshold(rect: Rect, isContainer: boolean) {
    const { top, left, height } = rect;

    const { x, y } = this.pixels;

    const leftThresholdPoint = new ThresholdPoint(
      left - x,
      isContainer ? Math.abs(height - y) : left + x
    );

    const topThresholdPoint = new ThresholdPoint(top - y, top + y);

    this.main = {
      left: leftThresholdPoint,
      top: topThresholdPoint,
    };
  }

  getThresholdMatrix(
    top: number,
    left: number,
    height?: number,
    relativeToViewport?: boolean
  ): ThresholdMatrix {
    const { x, y } = this.pixels;

    /**
     * When going up, currentTop decreases (-vertical).
     */
    let maxTop = top - y;

    /**
     * When going left, currentLeft decreases (-horizontal).
     */
    let maxLeft = left - x;

    /**
     * When going right, currentLeft increases (+horizontal) with droppable
     * taking into considerations (+ horizontal).
     */
    const maxRight = left + x;

    /**
     * If height, the threshold is relative to the container. Otherwise, it's
     * relative to the element.
     */
    let maxBottom = height ? height - y : top + y;

    if (relativeToViewport) {
      /**
       * Values should always be positive. This is true for scrolling threshold.
       */
      maxTop = Math.abs(maxTop);
      maxLeft = Math.abs(maxLeft);
      maxBottom = Math.abs(maxBottom);
    }

    return {
      maxBottom,
      maxTop,
      maxLeft,
      maxRight,
    };
  }

  updateElementThresholdMatrix(
    elementRect: Rect,
    relativeToContainer: boolean,
    relativeToViewport: boolean
  ) {
    const { height, top, left } = elementRect;

    this.setPixels(elementRect);

    this.thresholdMatrix = this.getThresholdMatrix(
      top,
      left,
      relativeToContainer ? height : undefined,
      relativeToViewport
    );
  }
}

export default Threshold;
