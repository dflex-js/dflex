import { AbstractDraggable } from "@dflex/draggable";
import type { MouseCoordinates } from "@dflex/draggable";

import type { ELmBranch } from "@dflex/dom-gen";

import { CoreInstanceInterface } from "@dflex/core-instance";

import store from "../DnDStore";
import type { ElmTree } from "../DnDStore";

import type { DraggableDnDBase, Thresholds } from "./types";

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

  setOfTransformedIds!: Set<string>;

  thresholds!: Thresholds;

  isOutActiveParent!: boolean;

  constructor(elmTree: ElmTree, initCoordinates: MouseCoordinates) {
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
      parents: {},
      // @ts-expect-error
      dragged: {},
    };

    /**
     * Not initiating thresholdOffset for all coreInstances. Only ones which
     * dragged will be initiated.
     */
    if (!this.draggedElm.thresholdOffset) {
      this.draggedElm.setThreshold();
    }

    /**
     * Init max direction for position
     */
    this.setThreshold(this.draggedElm, false);

    if (Array.isArray(siblings)) {
      this.siblingsList = siblings;
    } else {
      this.siblingsList = null;
    }

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
      this.setThreshold(parent, true);

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
   * @param isParent -
   */
  setThreshold(droppable: CoreInstanceInterface, isParent?: boolean) {
    const {
      thresholdOffset: {
        // @ts-ignore
        vertical: { twoThirds, third },
        // @ts-ignore
        horizontal,
      },
    } = this.draggedElm;

    const { currentLeft, currentTop, id } = droppable;

    let $;

    if (isParent) {
      const {
        offset: { height },
      } = droppable;

      if (!this.thresholds.parents[id]) {
        this.thresholds.parents[id] = {
          maxBottom: 0,
          maxTop: 0,
          maxLeft: 0,
          maxRight: 0,
        };
      }

      $ = this.thresholds.parents[id];

      $.maxBottom = currentTop + height - third;
    } else {
      $ = this.thresholds.dragged;

      /**
       * When going down, currentTop increases (+vertical) with droppable
       * taking into considerations (+ vertical).
       */
      $.maxBottom = currentTop + twoThirds;
    }

    /**
     * Overview:
     *
     * this.maxDirection: contains max value allowed for dragged to move. If dragged passes
     * these values, that means it's out.
     *
     * This threshold is related to droppable offset. If droppable changes, then
     * max/threshold changes.
     *
     * parentThreshold: to detect if dragged is moved inside or outside
     * parent. But what if we have multiple lists?
     *
     * Updating positionMax when dragged is located in new position is easy but
     * in lists we need to know all listMax(s) before entering to parent. Why?
     * because in this way we know where dragged is to detect the activeParent.
     *
     * The solution is to create parentThreshold. An object stores positionMax
     * depending on currentIndex as keys.
     */

    /**
     * Calculate max-vertical for up and down:
     */

    /**
     * When going up, currentTop decreases (-vertical).
     */
    $.maxTop = currentTop - twoThirds;

    /**
     * When going left, currentLeft decreases (-horizontal).
     */
    $.maxLeft = currentLeft - horizontal;

    /**
     * When going right, currentLeft increases (+horizontal) with droppable
     * taking into considerations (+ horizontal).
     */
    $.maxRight = currentLeft + horizontal;
  }

  /**
   * Add parent id to setOfTransformedIds. The goal here, is to avoid any
   * unnecessary process the parent goes through it when it's flagged as
   * transformed.
   */
  // private addParentAsTransformed() {
  //   const { id } = this.activeParent;

  //   /**
  //    * Avoid adding same parents more than once using sets.
  //    */
  //   this.setOfTransformedIds.add(id);
  // }

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
