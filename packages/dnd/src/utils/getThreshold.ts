/**
 * Copyright (c) Jalal Maskoun.
 *
 * This source code is licensed under the AGPL3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { ThresholdPercentages, ThresholdInPixels } from "../types";

function getThreshold(
  thresholdInput: ThresholdPercentages,
  containerWidth: number,
  containerHeight: number
): ThresholdInPixels {
  const x = Math.round((thresholdInput.horizontal * containerWidth) / 100);

  const y = Math.round((thresholdInput.vertical * containerHeight) / 100);

  return {
    y,
    x,
  };
}

export default getThreshold;
