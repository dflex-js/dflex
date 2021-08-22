/**
 * Copyright (c) Jalal Maskoun.
 *
 * This source code is licensed under the AGPL3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Rect } from "packages/core-instance/src/types";
import type { ThresholdInterface, ThresholdMatrix } from "./types";

class Threshold implements ThresholdInterface {
  thresholdPercentages: ThresholdInterface["thresholdPercentages"];

  thresholdPixels!: ThresholdInterface["thresholdPixels"];

  thresholdMatrix!: ThresholdInterface["thresholdMatrix"];

  constructor(thresholdInput: ThresholdInterface["thresholdPercentages"]) {
    this.thresholdPercentages = thresholdInput;
  }

  getThresholdMatrix(
    top: number,
    left: number,
    height?: number,
    relativeToViewport?: boolean
  ): ThresholdMatrix {
    const { x, y } = this.thresholdPixels;

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
    relativeToViewport?: boolean
  ) {
    const { width, height, top, left } = elementRect;

    const x = Math.round((this.thresholdPercentages.horizontal * width) / 100);

    const y = Math.round((this.thresholdPercentages.vertical * height) / 100);

    this.thresholdPixels = { x, y };

    this.thresholdMatrix = this.getThresholdMatrix(
      top,
      left,
      relativeToContainer ? height : undefined,
      relativeToViewport
    );
  }
}

export default Threshold;
