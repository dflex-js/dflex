/**
 * Copyright (c) Jalal Maskoun.
 *
 * This source code is licensed under the AGPL3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { CoreInstanceInterface } from "@dflex/core-instance";

class AutoScroll {
  parent: CoreInstanceInterface;

  speed: number;

  direction: 1 | -1;

  maxScrollArea: {
    x: number;
    y: number;
  };

  constructor(parent: CoreInstanceInterface) {
    this.parent = parent;
    this.speed = 0;
    this.direction = 1;

    this.maxScrollArea = {
      x: 0,
      y: 0,
    };
  }

  setMaxScrollArea() {
    this.maxScrollArea = {
      x: this.parent.scrollWidth! - this.parent.clientWidth!,
      y: this.parent.scrollHeight! - this.parent.clientHeight!,
    };
  }

  getPosition() {
    const { scrollTop, scrollLeft } = this.parent.ref;

    const isTop = scrollTop <= 0;
    const isBottom = scrollTop >= this.maxScrollArea.y;

    const isLeft = scrollLeft <= 0;
    const isRight = scrollLeft >= this.maxScrollArea.x;
  }

  scrollBy() {}
}

export default AutoScroll;
