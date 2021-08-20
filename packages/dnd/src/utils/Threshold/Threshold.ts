/**
 * Copyright (c) Jalal Maskoun.
 *
 * This source code is licensed under the AGPL3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { ThresholdInterface, ThresholdMatrix } from "./types";

class Threshold implements ThresholdInterface {
  thresholdPercentages: ThresholdInterface["thresholdPercentages"];

  thresholdPixels!: ThresholdInterface["thresholdPixels"];

  constructor(
    thresholdInput: ThresholdInterface["thresholdPercentages"],
    width: number,
    height: number
  ) {
    this.thresholdPercentages = thresholdInput;

    this.setThresholdPixels(width, height);
  }

  setThresholdPixels(width: number, height: number) {
    const x = Math.round((this.thresholdPercentages.horizontal * width) / 100);

    const y = Math.round((this.thresholdPercentages.vertical * height) / 100);

    this.thresholdPixels = { x, y };
  }

  getThresholdMatrix(
    top: number,
    left: number,
    height?: number
  ): ThresholdMatrix {
    const { x, y } = this.thresholdPixels;

    /**
     * When going up, currentTop decreases (-vertical).
     */
    const maxTop = top - y;

    /**
     * When going left, currentLeft decreases (-horizontal).
     */
    const maxLeft = left - x;

    /**
     * When going right, currentLeft increases (+horizontal) with droppable
     * taking into considerations (+ horizontal).
     */
    const maxRight = left + x;

    /**
     * If height, the threshold is relative to the container. Otherwise, it's
     * relative to the element.
     */
    const maxBottom = height ? height - y : top + y;

    return {
      maxBottom,
      maxTop,
      maxLeft,
      maxRight,
    };
  }
}

export default Threshold;
