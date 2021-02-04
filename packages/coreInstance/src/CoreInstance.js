/* eslint-disable no-param-reassign */
/**
 * @typedef {Object} CoreInstanceElm
 * @property {string} CoreInstanceElm.id
 * @property {number} CoreInstanceElm.depth
 * @property {HTMLElement} CoreInstanceElm.element
 */

/**
 * @typedef {Object} ELmOrder
 * @property {number} ELmOrder.self
 * @property {number} ELmOrder.parent
 */

/**
 * @typedef {Array<string>} BranchELmOrder
 */

/**
 * Why storing index here? when it's already sorted in order?
 *
 * Each element has index elements to element's position in list. It allows us
 * to avoid looping in idsTreeOrder to know each element position.
 *
 * elem-id = id1
 * iDsInOrder[id3, id1, id2]
 * How do we get elem-id from iDsInOrder without loop? We don't want to loop
 * twice once to know the qualified element to transform and the second to
 * figure out element position.
 *
 * So, iDsInOrder[index] is our position in list. And, to update to
 * new position: iDsInOrder[new-index] = elem-id.
 *
 *
 * Why storing prev-index?
 *
 * Currently, there's no undo history. But, still need one-step back. Why?
 * Because if dragged is out and release, it should go back to its
 * prevIndex aka selfIndex before transformation.
 *
 * why Storing parent-index?
 *
 * To connect element with parents by knowing their locations.
 */
class CoreInstance {
  /**
   * Creates an instance of CoreInstance.
   *
   * @param {CoreInstanceElm} coreInstance
   * @memberof CoreInstance
   */
  constructor({ element, id, depth }) {
    this.element = element;
    this.id = id;
    this.depth = depth;

    /**
     * Since element render once and being transformed later we keep the data
     * stored to navigate correctly.
     */
    this.translateY = 0;
    this.translateX = 0;

    /**
     * Store history of Y-transition according to unique ID.
     *
     * @type {Array<{ID: string, translateY:number}>} */
    this.prevTranslateY = [];

    this.offset = {
      height: 0,
      width: 0,

      left: 0,
      top: 0,
    };

    /**
     * Used for dragged, storing temporary top, left new positions during the transition.
     */
    this.currentTop = 0;
    this.currentLeft = 0;

    if (this.element) {
      this.initOffset();
      this.setCurrentOffset();
    }

    /** @type {ELmOrder} */
    this.order = { self: 0, parent: 0 };
  }

  /**
   * Initializes the element offset only when it's called. Since it is sorting
   * different numbers related to transformation we don't need to invoke for
   * idle element because it's costly.
   *
   * So, basically any working element in DnD should be initiated first.
   *
   * @memberof CoreInstance
   */
  initOffset() {
    const { height, width, left, top } = this.element.getBoundingClientRect();

    /**
     * Element offset stored once without being triggered to re-calculate.
     * Instead, using currentOffset object as indicator to current
     * offset/position. This offset, is the init-offset.
     */
    this.offset = {
      height,
      width,

      left,
      top,
    };
  }

  /**
   * @memberof CoreInstance
   */
  setCurrentOffset() {
    const { left, top } = this.offset;
    /**
     * This offset related directly to translate Y and Y. It's isolated from
     * element current offset and effects only top and left.
     */

    this.currentTop = top + this.translateY;
    this.currentLeft = left + this.translateX;
  }

  /**
   * @memberof CoreInstance
   */
  transformElm() {
    this.element.style.transform = `translate(${this.translateX}px,${this.translateY}px)`;
  }

  /**
   * Update element index in order  branch
   *
   * @param {number} i - index
   * @return {{oldIndex:number, newIndex:number}}
   * @memberof CoreInstance
   */
  updateIndex(i) {
    const { self: oldIndex } = this.order;

    const newIndex = oldIndex + i;

    this.order.self = newIndex;

    return { oldIndex, newIndex };
  }

  /**
   * Updates index locally and in store.
   *
   * @param {BranchELmOrder} branchIDsOrder
   * @param {number} inc - increment number
   * @param {boolean} [isShuffle=true] don't clear for last element.
   * @memberof CoreInstance
   */
  updateIDsOrder(branchIDsOrder, inc, isShuffle) {
    const { oldIndex, newIndex } = this.updateIndex(inc);

    /**
     * Update element id and order in its list.
     *
     * This goes for shuffled elements and direct update
     *
     * Note: direct update: for dragged element and assigning new order when
     * inserting and undoing.
     */
    branchIDsOrder[newIndex] = this.id;
    if (isShuffle) branchIDsOrder[oldIndex] = "";
  }

  /**
   * Set a new translate position and store the old one.
   *
   * @param {number} topSpace
   * @param {string?} operationID - Only if moving to a new position.
   * @memberof CoreInstance
   */
  seTranslate(topSpace, operationID) {
    this.currentTop += topSpace;

    if (operationID) {
      this.prevTranslateY.push({
        ID: operationID,
        translateY: this.translateY,
      });
    }

    this.translateY += topSpace;

    this.transformElm();
  }

  /**
   * Sets new vertical position. Which includes, TranslateY and OffsetTop. By assigning the
   * new calculated value by +/- new difference.
   *
   * Note: Why we don't need setXPosition?
   * Because, elements always move in the same list container, the only one who's migrated to
   * another is dragged.
   *
   * Note: isShuffle is flag made for updating last element in array
   * which is dragged. Normally, update element position and clear its previous
   * position but when updating last element the array is ready and done we need
   * to update one position only so don't clear previous.
   *
   * @param {BranchELmOrder} iDsInOrder
   * @param {number} sign - (+1/-1)
   * @param {number} topSpace - space between dragged and the immediate next element.
   * @param {number} [vIncrement=1] - number of passed elements.
   * @param {boolean} [isShuffle=true]
   * @param {string?} operationID - Unique ID used to store translate history
   * @memberof CoreInstance
   */
  setYPosition(
    iDsInOrder,
    sign,
    topSpace,
    operationID,
    vIncrement = 1,
    isShuffle = true
  ) {
    this.seTranslate(sign * topSpace, operationID);

    this.updateIDsOrder(iDsInOrder, sign * vIncrement, isShuffle);
  }

  /**
   * Roll back element position vertically(y).
   *
   * @param {string} operationID
   * @memberof CoreInstance
   */
  rollYBack(operationID) {
    if (
      this.prevTranslateY.length === 0 ||
      this.prevTranslateY[this.prevTranslateY.length - 1].ID !== operationID
    ) {
      return;
    }

    // @ts-ignore
    const topSpace = this.prevTranslateY.pop().translateY - this.translateY;

    const increment = topSpace > 0 ? 1 : -1;

    this.seTranslate(topSpace, null);
    this.updateIndex(increment);
  }
}

export default CoreInstance;
