/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
import AbstractCoreInstance from "./AbstractCoreInstance";

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
class CoreInstance extends AbstractCoreInstance {
  /**
   *
   * @param {string} id
   * @param {node} elm
   */
  constructor(coreInstance) {
    super(coreInstance);

    if (this.element) {
      this.initOffset();
      this.initTranslate();
      this.setCurrentOffset();
    }
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
      right: left + width,

      top,
      bottom: top + height,
    };
  }

  initTranslate() {
    /**
     * Since element render once and being transformed later we keep the data
     * stored to navigate correctly.
     */
    this.translateY = 0;
    this.translateX = 0;
    this.prevTranslateY = 0;
    this.prevTranslateX = 0;
  }

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
   * Sets new value to internal index and returns it.
   *
   * @param {number} i - increment number
   * @returns number  - new index.
   * @memberof CoreInstance
   */
  setIndex(i) {
    const newIndex = this.order.self + i;

    this.order.self = newIndex;

    return newIndex;
  }

  /**
   * Updates index locally and in store.
   *
   * @param {Array} order
   * @param {number} i - increment number
   * @param {boolean} [isShuffle=true] don't clear for last element.
   * @memberof CoreInstance
   */
  updateIDsOrder(order, inc, isShuffle) {
    const oldIndex = this.order.self;

    /**
     * Get new index depending on increment and updating local index (self).
     */
    const newIndex = this.setIndex(inc);

    if (order === null) return;

    /**
     * Update element id and order in its list.
     *
     * This goes for shuffled elements and direct update
     *
     * Note: direct update: for dragged element and assigning new order when
     * inserting and undoing.
     */
    order[newIndex] = this.id;

    /**
     * Shuffling when:
     * Still in the list going up/down.
     * Dragged went up leaving the list entirely.
     */
    if (isShuffle) {
      /**
       * If we are at the last element, it means dragged is out the list so
       * instead of assign the last position to null: [0,1, null]. We simply
       * delete it: [0,1]
       */
      if (oldIndex + 1 === order.length) {
        /**
         * Remove last element.
         */
        order.pop();
      } else {
        /**
         * Clear old position by assigning it to null:[0, null, 1].
         * Note: the null position will be filled later with dragged
         */
        order[oldIndex] = null;
      }
    }
  }

  seTranslate(sign, topSpace, vIncrement) {
    const _topSpace = sign * topSpace;

    this.currentTop += _topSpace;

    this.prevTranslateY = this.translateY;
    this.translateY += _topSpace;

    this.element.style.transform = `translate(${this.translateX}px,${this.translateY}px)`;

    const increment = sign * vIncrement;

    return increment;
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
   * @param {Array} iDsInOrder
   * @param {number} sign - (+1/-1)
   * @param {number} topSpace - space between dragged and the immediate next element.
   * @param {number} [vIncrement=1] - number of passed elements.
   * @param {boolean} [isShuffle=true]
   * @memberof CoreInstance
   */
  setYPosition(iDsInOrder, sign, topSpace, vIncrement = 1, isShuffle = true) {
    const increment = this.seTranslate(sign, topSpace, vIncrement);

    this.updateIDsOrder(iDsInOrder, increment, isShuffle);
  }

  /**
   * Roll back element position vertically(y).
   *
   * @param {Array} iDsInOrder - Array that holds new ids order.
   * @memberof CoreInstance
   */
  rollYBack() {
    const topSpace = this.prevTranslateY - this.translateY;

    const increment = this.seTranslate(1, topSpace, 1, false);

    this.setIndex(increment);
  }
}

export default CoreInstance;
