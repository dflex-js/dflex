/**
 * Copyright (c) Jalal Maskoun.
 *
 * This source code is licensed under the AGPL3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { DraggableDnDInterface } from "../Draggable";

import store from "../DnDStore";
import Interval from "./utils/Interval";

class Scroll {
  protected draggable: DraggableDnDInterface;

  protected scrollAnimatedFrame: number | null;

  protected isScrollOffsetInitiated: boolean;

  protected scrollYOffset: number;

  protected scrollXOffset: number;

  private scrollSpeed: number;

  private interval: Interval;

  constructor(draggable: DraggableDnDInterface) {
    this.draggable = draggable;

    this.scrollAnimatedFrame = null;

    this.isScrollOffsetInitiated = false;
    this.scrollYOffset = 0;
    this.scrollXOffset = 0;
    this.scrollSpeed = 0;

    this.interval = new Interval();
  }

  private initScrollOffset() {
    this.scrollSpeed = 0;
    this.scrollYOffset = store.scrollY;
    this.scrollXOffset = store.scrollX;
  }

  scrollEnd() {
    // Reset animation flags
    this.scrollAnimatedFrame = null;
    store.hasThrottledFrame = null;
    this.draggable.isViewportRestricted = true;

    if (this.interval.intervalID !== null) {
      this.interval.clear();
    }
  }

  private scrollElementOnY(x: number, y: number, direction: 1 | -1) {
    store.documentScrollingElement.scrollTop += direction * this.scrollSpeed;

    this.draggable.dragAt(
      x,
      y + store.documentScrollingElement.scrollTop - this.scrollYOffset!
    );
  }

  private scrollElementOnX(x: number, y: number, direction: 1 | -1) {
    store.documentScrollingElement.scrollLeft += direction * this.scrollSpeed;

    this.draggable.dragAt(
      x + store.documentScrollingElement.scrollLeft - this.scrollXOffset!,
      y
    );
  }

  private scrollElement(
    x: number,
    y: number,
    direction: 1 | -1,
    on: "scrollElementOnX" | "scrollElementOnY"
  ) {
    if (this.interval.intervalID === null) {
      this.interval.set(() => {
        this.scrollSpeed += this.draggable.scroll.initialSpeed;
      }, this.draggable.scroll.accelerateDuration);
    }

    // Prevent store from implementing any animation response.
    store.hasThrottledFrame = 1;
    this.draggable.isViewportRestricted = false;

    this.scrollAnimatedFrame = requestAnimationFrame(() => {
      if (!this.isScrollOffsetInitiated) {
        this.initScrollOffset();
        this.isScrollOffsetInitiated = true;
      }

      this[on](x, y, direction);

      // Reset animation flags
      this.scrollEnd();
    });
  }

  scroll(x: number, y: number) {
    const { sK } = store.registry[this.draggable.draggedElm.id].keys;

    if (store.siblingsOverflow[sK].y) {
      if (
        y + store.documentScrollingElement.scrollTop - this.scrollYOffset <
          store.siblingsBoundaries[sK].bottom &&
        y >= store.scrollThreshold.maxY
      ) {
        this.scrollElement(x, y, 1, "scrollElementOnY");

        return;
      }

      if (y <= store.scrollThreshold.minY) {
        this.scrollElement(x, y, -1, "scrollElementOnY");

        return;
      }
    }

    if (store.siblingsOverflow[sK].x) {
      if (
        x + store.documentScrollingElement.scrollLeft - this.scrollXOffset <
          store.siblingsBoundaries[sK].minRight &&
        x >= store.scrollThreshold.maxX
      ) {
        this.scrollElement(x, y, 1, "scrollElementOnX");

        return;
      }

      if (x <= store.scrollThreshold.minX) {
        this.scrollElement(x, y, -1, "scrollElementOnX");
      }
    }
  }
}

export default Scroll;
