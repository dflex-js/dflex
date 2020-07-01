import { DRAGGED_ELM } from "@dflex/draggable/constants.json";
import AbstractDraggable from "@dflex/draggable/src/AbstractDraggable";

import store from "../../Store";

import { ACTIVE_PARENT } from "../../constants.json";

/**
 * Base element.
 *
 * Creates draggedElm and activeParent and initializes thresholds.
 *
 *
 * @class Base
 */
class Base extends AbstractDraggable {
  /**
   * Creates an instance of Base.
   *
   * @param {string} elementId
   * @memberof Base
   */
  constructor(elementId, clickCoordinates) {
    const {
      element,
      parent,
      branches: { siblings, parents },
    } = store.getElmTreeById(elementId);

    super(element, clickCoordinates);

    const { order } = element;

    /**
     * Initialize temp index that refers to element new position after
     * transformation happened.
     */
    this.draggedTempIndex = order.self;

    this.parentsList = parents;
    this.siblingsList = siblings;

    /**
     * Thresholds store, contains max value for each parent and for dragged. Depending on
     * ids as keys.
     */
    this.thresholds = {
      parents: {},
      dragged: {},
    };

    this.checkThresholds(this[DRAGGED_ELM]);

    /**
     * Init max direction for position
     */
    this.setThreshold(this[DRAGGED_ELM], false);

    this.setIsSingleton();

    this.setIsOrphan(parent);
  }

  /**
   * Check if dragged has no siblings and then set the related flag.
   *
   * @memberof Base
   */
  setIsSingleton() {
    /**
     * Dragged has no siblings.
     */
    this.isSingleton = !Array.isArray(this.siblingsList);
  }

  /**
   * Check if dragged has no parent and then set the related operations
   * accordingly.
   *
   * @memberof Base
   */
  setIsOrphan(parent) {
    /**
     * Dragged has no parent.
     */
    this.isOrphan = true;

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
      this.isOrphan = false;
    }
  }

  /**
   * Sets thresholds for dragged element position depending on its
   * position inside parent which is related to droppable left and top.
   *
   * maxDirection = current position + droppable-allowed spaces
   *
   * @memberof Base
   */
  setThreshold(droppable, isParent) {
    const { parents, dragged } = this.thresholds;

    const {
      thresholdOffset: { vertical, horizontal },
    } = this[DRAGGED_ELM];

    const {
      currentLeft,
      currentTop,
      offset: { width, height },
      id,
    } = droppable;

    const $ = isParent ? (parents[id] = {}) : dragged;

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
    $.maxTop = currentTop - vertical;

    /**
     * When going down, currentTop increases (+vertical) with droppable
     * taking into considerations (+ vertical).
     */
    $.maxBottom = currentTop + vertical;

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
   * Check thresholds availability and assign it to thresholds instance in
   * dragging process.
   *
   * @memberof Base
   */
  checkThresholds() {
    /**
     * Not initiating thresholdOffset for all coreInstances. Only ones which
     * dragged will be initiated.
     */
    if (!this[DRAGGED_ELM].thresholdOffset) {
      const {
        offset: { width, height },
      } = this[DRAGGED_ELM];

      /**
       * Calculates thresholdOffset only for dragged element.
       *
       * Two-thirds of the dragged element's space for vertical and horizontal. If
       * two-thirds of the dragged is out, then trigger isOut whether it is out
       * position or out parent.
       */
      this[DRAGGED_ELM].thresholdOffset = {
        vertical: Math.ceil((2 / 3) * height),
        horizontal: Math.ceil((2 / 3) * width),
      };
    }
  }

  /**
   * Add parent id to setOfTransformedIds. The goal here, is to avoid any
   * unnecessary process the parent goes through it when it's flagged as
   * transformed.
   *
   * @memberof Base
   */
  addParentAsTransformed() {
    const { id } = this[ACTIVE_PARENT];

    /**
     * Avoid adding same parents more than once using sets.
     */
    this.setOfTransformedIds.add(id);
  }

  /**
   * Assigns new ACTIVE_PARENT: parent who contains dragged
   *
   * @param {CoreInstance} coreInstance
   * @memberof Base
   */
  assignActiveParent(coreInstance) {
    /**
     * Assign instance ACTIVE_PARENT which represents droppable. Then
     * assign owner parent so we have from/to.
     */
    this[ACTIVE_PARENT] = coreInstance;

    /**
     * Add flag for undo method so we can check which  parent is being
     * transformed and which is not.
     */
    this[ACTIVE_PARENT].isTransformed = true;
    this.isDraggedOutActiveParent = false;

    /**
     * In initiating we get siblingsList. But, when dragged is in another
     * ACTIVE_PARENT we have different siblingsList now. siblingsList is
     * children of new parent. Anyway, check if there no list, get us one.
     */
    if (!this.siblingsList) {
      const {
        keys: { chK },
      } = this[ACTIVE_PARENT];

      this.siblingsList = store.getElmById(chK);
    }
  }
}

export default Base;
