/**
 * Copyright (c) Jalal Maskoun.
 *
 * This source code is licensed under the AGPL3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { TrackerInterface } from "./types";

class Tracker implements TrackerInterface {
  travelID: number;

  /**
   * Creates an instance of Tracker.
   */
  constructor() {
    this.travelID = 0;
  }

  /**
   * Increment travels and return the last one.
   */
  newTravel() {
    this.travelID += 1;

    return `${this.travelID}`;
  }
}

export default Tracker;
