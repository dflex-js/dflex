/**
 * Copyright (c) Jalal Maskoun.
 *
 * This source code is licensed under the AGPL3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Threshold from "../../src/utils/Threshold";

describe("Threshold", () => {
  it("Has the right instance", () => {
    const thresholdPercentages = { vertical: 60, horizontal: 60 };

    const threshold = new Threshold(thresholdPercentages, 200, 100);

    expect(threshold).toMatchSnapshot();
  });
});
