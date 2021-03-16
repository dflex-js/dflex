import { AbstractDraggable } from "@dflex/draggable";
import type { MouseCoordinates } from "@dflex/draggable";

import type { ELmBranch } from "@dflex/dom-gen";

import { CoreInstanceInterface } from "@dflex/core-instance";
import type { Offset } from "@dflex/core-instance";

import store from "../DnDStore";
import type { ElmTree } from "../DnDStore";

import type {
  DraggableDnDBase,
  ThresholdPercentages,
  Thresholds,
} from "./types";

/**
 * Base element.
 *
 * Creates draggedElm and activeParent and initializes thresholds.
 */
class Base
  extends AbstractDraggable<CoreInstanceInterface>
  implements DraggableDnDBase {
  tempIndex: number;

  dragID: string;

  parentsList: ELmBranch;

  siblingsList: ELmBranch | null;

  activeParent!: CoreInstanceInterface | null;

  isOutActiveParent!: boolean;

  setOfTransformedIds!: Set<string>;

  thresholds: Thresholds;

  thresholdsPercentages: ThresholdPercentages;

  constructor(
    elmTree: ElmTree,
    siblingsK: string,
    siblingsBoundaries: Offset,
    initCoordinates: MouseCoordinates
  ) {
    const {
      element,
      parent,
      branches: { siblings, parents },
    } = elmTree;

    super(element, initCoordinates);

    const { order } = element;

    /**
     * Initialize temp index that refers to element new position after
     * transformation happened.
     */
    this.tempIndex = order.self;

    this.parentsList = parents;

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

    this.thresholdsPercentages = {
      vertical: {
        twoThirds: Math.ceil((2 / 3) * this.draggedElm.offset.height),
        third: Math.ceil((2 / 3) * this.draggedElm.offset.width),
      },
      horizontal: {
        twoThirds: Math.ceil((1 / 3) * this.draggedElm.offset.height),
      },
    };

    /**
     * Init max direction for position
     */
    const { currentLeft, currentTop, offset } = this.draggedElm;
    this.setThreshold({
      left: currentLeft,
      top: currentTop,
      width: offset.width,
      height: offset.height,
    });

    this.setThreshold(siblingsBoundaries, siblingsK);

    this.siblingsList = Array.isArray(siblings) ? siblings : null;

    this.setIsOrphan(parent);

    this.dragID = store.tracker.newTravel();
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
   * Sets thresholds for dragged element position depending on its
   * position inside parent which is related to droppable left and top.
   *
   * maxDirection = current position + droppable-allowed spaces
   *
   * @param droppable -
   * @param siblingsK -
   */
  setThreshold(offset: Offset, siblingsK?: string) {
    let $;

    if (siblingsK) {
      if (!this.thresholds.siblings[siblingsK]) {
        this.thresholds.siblings[siblingsK] = {
          maxBottom: 0,
          maxTop: 0,
          maxLeft: 0,
          maxRight: 0,
        };
      }

      $ = this.thresholds.siblings[siblingsK];

      $.maxBottom =
        offset.top + offset.height - this.thresholdsPercentages.vertical.third;
    } else {
      $ = this.thresholds.dragged;

      /**
       * When going down, currentTop increases (+vertical) with droppable
       * taking into considerations (+ vertical).
       */
      $.maxBottom = offset.top + this.thresholdsPercentages.vertical.twoThirds;
    }

    /**
     * Calculate max-vertical for up and down:
     */

    /**
     * When going up, top decreases (-vertical).
     */
    $.maxTop = offset.top - this.thresholdsPercentages.vertical.twoThirds;

    /**
     * When going left, currentLeft decreases (-horizontal).
     */
    $.maxLeft = offset.left - this.thresholdsPercentages.horizontal.twoThirds;

    /**
     * When going right, currentLeft increases (+horizontal) with droppable
     * taking into considerations (+ horizontal).
     */
    $.maxRight = offset.left + this.thresholdsPercentages.horizontal.twoThirds;
  }

  setDraggedThreshold() {
    /**
     * Init max direction for position
     */
    const { currentLeft, currentTop, offset } = this.draggedElm;

    this.setThreshold({
      left: currentLeft,
      top: currentTop,
      width: offset.width,
      height: offset.height,
    });
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
