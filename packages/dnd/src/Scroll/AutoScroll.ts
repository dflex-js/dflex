/**
 * Copyright (c) Jalal Maskoun.
 *
 * This source code is licensed under the AGPL3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable class-methods-use-this */

import type { CoreInstanceInterface } from "@dflex/core-instance";
import type { ScrollOpt } from "./types";

class AutoScroll {
  parent: CoreInstanceInterface;

  speed: number;

  direction: 1 | -1;

  maxScrollArea: {
    x: number;
    y: number;
  };

  constructor(parent: CoreInstanceInterface, opt: ScrollOpt) {
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

  isParenOverflow() {
    const parentBottom = this.parent.offset.top + this.parent.offset.height;

    const elemOverflowX = parentBottom > window.innerHeight;
    const elemOverflowY = this.parent.offset.top < 0;
    const isElmOverflow = elemOverflowX || elemOverflowY;

    return isElmOverflow;
  }

  scroll(clientX: number, clientY: number) {
    console.log("am in");

    const speed = 6;
    const sensitivity = 50;

    const documentScrollingElement = getDocumentScrollingElement();

    if (
      this.parent.ref !== document.body &&
      this.parent.ref !== document.documentElement &&
      !this.isParenOverflow()
    ) {
      console.log("am in 2");

      const { top, left, height, width } = this.parent.offset;

      if (top + height - clientY < sensitivity) {
        this.parent.ref.scrollTop += speed;
      } else if (clientY - top < sensitivity) {
        this.parent.ref.scrollTop -= speed;
      }

      if (left + width - clientX < sensitivity) {
        this.parent.ref.scrollLeft += speed;
      } else if (clientX - left < sensitivity) {
        this.parent.ref.scrollLeft -= speed;
      }
    } else {
      const { innerHeight, innerWidth } = window;

      if (clientY < sensitivity) {
        documentScrollingElement.scrollTop -= speed;
      } else if (innerHeight - clientY < sensitivity) {
        documentScrollingElement.scrollTop += speed;
      }

      if (clientX < sensitivity) {
        documentScrollingElement.scrollLeft -= speed;
      } else if (innerWidth - clientX < sensitivity) {
        documentScrollingElement.scrollLeft += speed;
      }
    }
  }
}

function getDocumentScrollingElement() {
  return document.scrollingElement || document.documentElement;
}

export default AutoScroll;
