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

import type { DraggableBaseInterface, LayoutThresholdMatrix } from "./types";

import { ScrollOptWithThreshold, FinalDndOpts } from "../types";

import Threshold, { ThresholdInterface } from "../utils/Threshold";

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

  threshold: ThresholdInterface;

  layoutThresholds!: LayoutThresholdMatrix;

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

    this.scroll = opts.scroll;

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

    const siblingsBoundaries = store.siblingsBoundaries[sK];

    this.threshold = new Threshold(
      opts.threshold,
      element.offset!.width,
      element.offset!.height
    );

    /**
     * Thresholds store, contains max value for each parent and for dragged. Depending on
     * ids as keys.
     */
    this.layoutThresholds = {
      siblings: {
        [sK]: this.threshold.getThresholdMatrix(
          siblingsBoundaries.top,
          siblingsBoundaries.maxLeft,
          siblingsBoundaries.bottom
        ),
      },
      /**
       * Init max direction for position
       */
      dragged: this.threshold.getThresholdMatrix(
        this.draggedElm.currentTop!,
        this.draggedElm.currentLeft!
      ),
    };

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
