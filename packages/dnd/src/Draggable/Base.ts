/**
 * Copyright (c) Jalal Maskoun.
 *
 * This source code is licensed under the AGPL3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { AbstractDraggable } from "@dflex/draggable";

import { CoreInstanceInterface } from "@dflex/core-instance";

import type { MouseCoordinates } from "@dflex/draggable";

import store from "../DnDStore";

import type {
  DraggableBaseInterface,
  ThresholdPercentages,
  LayoutThresholds,
} from "./types";
import { FinalDndOpts, ScrollOptWithThreshold } from "../types";

/**
 * Base element.
 *
 * Creates draggedElm and activeParent and initializes thresholds.
 */
class Base
  extends AbstractDraggable<CoreInstanceInterface>
  implements DraggableBaseInterface
{
  tempIndex: number;

  operationID: string;

  activeParent!: CoreInstanceInterface | null;

  isOutActiveParent!: boolean;

  setOfTransformedIds!: Set<string>;

  thresholds: LayoutThresholds;

  private draggedThresholdInputOpt: ThresholdPercentages;

  draggedThreshold!: ThresholdPercentages;

  scroll: ScrollOptWithThreshold;

  isViewportRestricted: boolean;

  constructor(
    id: string,
    initCoordinates: MouseCoordinates,
    opts: Omit<FinalDndOpts, "restrictions">
  ) {
    const { element, parent } = store.getElmTreeById(id);

    if (element.isPaused) {
      element.resume(store.scrollX, store.scrollY);
    }

    super(element, initCoordinates);

    const { order } = element;

    /**
     * Initialize temp index that refers to element new position after
     * transformation happened.
     */
    this.tempIndex = order.self;

    /**
     * Thresholds store, contains max value for each parent and for dragged. Depending on
     * ids as keys.
     */
    this.thresholds = {
      siblings: {},
      dragged: {
        maxBottom: 0,
        maxTop: 0,
        maxLeft: 0,
        maxRight: 0,
      },
    };

    this.scroll = opts.scroll;

    this.draggedThresholdInputOpt = opts.threshold;

    const siblings = store.getElmSiblingsListById(this.draggedElm.id);

    const { sK } = store.registry[this.draggedElm.id].keys;

    if (
      siblings === null ||
      (!store.siblingsOverflow[sK].x && !store.siblingsOverflow[sK].y)
    ) {
      this.scroll.enable = false;
    }

    if (this.scroll.enable) {
      this.isViewportRestricted = false;

      store.initScrollViewportThreshold(this.scroll.threshold);
    } else {
      this.isViewportRestricted = true;
    }

    /**
     * Extract dragged threshold from options.
     */
    this.seDraggedThreshold();

    /**
     * Init max direction for position
     */
    this.setThreshold(
      this.draggedElm.currentTop!,
      this.draggedElm.currentLeft!
    );

    const siblingsBoundaries = store.siblingsBoundaries[sK];

    this.setThreshold(
      siblingsBoundaries.top,
      siblingsBoundaries.maxLeft,
      siblingsBoundaries.bottom,
      store.registry[this.draggedElm.id].keys.sK
    );

    this.setIsOrphan(parent);

    this.operationID = store.tracker.newTravel();
  }

  /**
   * Check if dragged has no parent and then set the related operations
   * accordingly.
   *
   * @param parent -
   */
  private setIsOrphan(parent: CoreInstanceInterface | null) {
    /**
     * Not all elements have parents.
     */
    if (parent) {
      /**
       * Indicator to parents that have changed. This facilitates looping in
       * affected parents only.
       */
      this.setOfTransformedIds = new Set([]);
      this.assignActiveParent(parent);

      this.isOutActiveParent = false;
    } else {
      /**
       * Dragged has no parent.
       */
      this.activeParent = null;
    }
  }

  /**
   * Threshold not always related to the dragged. Since DFlex introduced
   * multiple height and widths, threshold now related to the occupied element
   * offset. The initial state is assigned to dragged element.
   *
   * @param relativeTo - The occupied element.
   */
  seDraggedThreshold(relativeTo = this.draggedElm) {
    this.draggedThreshold = {
      vertical: Math.round(
        (this.draggedThresholdInputOpt.vertical * relativeTo.offset!.height) /
          100
      ),
      horizontal: Math.round(
        (this.draggedThresholdInputOpt.horizontal * relativeTo.offset!.width) /
          100
      ),
    };
  }

  /**
   * Sets thresholds for dragged element position depending on its
   * position inside parent which is related to droppable left and top.
   *
   * @param top -
   * @param left -
   * @param height -
   * @param siblingsK -
   */
  setThreshold(top: number, left: number, height?: number, siblingsK?: string) {
    const { vertical, horizontal } = this.draggedThreshold;

    let $;

    if (siblingsK && height) {
      if (!this.thresholds.siblings[siblingsK]) {
        this.thresholds.siblings[siblingsK] = {
          maxBottom: 0,
          maxTop: 0,
          maxLeft: 0,
          maxRight: 0,
        };
      }

      $ = this.thresholds.siblings[siblingsK];

      $.maxBottom = height - vertical;
    } else {
      $ = this.thresholds.dragged;

      /**
       * When going down, currentTop increases (+vertical) with droppable
       * taking into considerations (+ vertical).
       */
      $.maxBottom = top + vertical;
    }

    /**
     * Calculate max-vertical for up and down:
     */

    /**
     * When going up, currentTop decreases (-vertical).
     */
    $.maxTop = top - vertical;

    /**
     * When going left, currentLeft decreases (-horizontal).
     */
    $.maxLeft = left - horizontal;

    /**
     * When going right, currentLeft increases (+horizontal) with droppable
     * taking into considerations (+ horizontal).
     */
    $.maxRight = left + horizontal;
  }

  /**
   * Assigns new ACTIVE_PARENT: parent who contains dragged
   *
   * @param element -
   */
  private assignActiveParent(element: CoreInstanceInterface) {
    /**
     * Assign instance ACTIVE_PARENT which represents droppable. Then
     * assign owner parent so we have from/to.
     */
    this.activeParent = element;

    /**
     * Add flag for undo method so we can check which  parent is being
     * transformed and which is not.
     */
    this.isOutActiveParent = false;
  }
}

export default Base;
