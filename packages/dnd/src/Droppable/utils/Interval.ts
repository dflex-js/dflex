/**
 * Copyright (c) Jalal Maskoun.
 *
 * This source code is licensed under the AGPL3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

class Interval {
  intervalID: number | null;

  constructor() {
    this.intervalID = 0;
  }

  set(cb: Function, delay: number) {
    this.intervalID = setInterval(cb, delay);
  }

  clear() {
    clearInterval(this.intervalID!);
    this.intervalID = null;
  }
}

export default Interval;
