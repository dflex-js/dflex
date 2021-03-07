/* eslint-disable no-param-reassign */

import { Keys, Order } from "@dflex/dom-gen";
import { ElmWIthPointer } from "@dflex/store";

import AbstractCoreInstance from "./AbstractCoreInstance";
import {
  CoreInstanceInterface,
  Offset,
  TransitionHistory,
  ThresholdOffset,
} from "./types";

type BranchELmOrder = string[];

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

class CoreInstance
  extends AbstractCoreInstance
  implements CoreInstanceInterface {
  offset: Offset;

  /** Store history of Y-transition according to unique ID. */
  prevTranslateY: TransitionHistory;

  currentTop: number;

  currentLeft: number;

  order: Order;

  keys: Keys;

  thresholdOffset?: ThresholdOffset;

  constructor(elementWithPointer: ElmWIthPointer) {
    const { order, keys, ...element } = elementWithPointer;

    super(element);

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

    if (this.ref) {
      this.initOffset();
      this.setCurrentOffset();
    }

    this.order = order;
    this.keys = keys;
  }

  /**
   * Initializes the element offset only when it's called. Since it is sorting
   * different numbers related to transformation we don't need to invoke for
   * idle element because it's costly.
   *
   * So, basically any working element in DnD should be initiated first.
   */
  private initOffset() {
    const { height, width, left, top } = this.ref.getBoundingClientRect();

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

  setCurrentOffset() {
    const { left, top } = this.offset;
    /**
     * This offset related directly to translate Y and Y. It's isolated from
     * element current offset and effects only top and left.
     */

    this.currentTop = top + this.translateY;
    this.currentLeft = left + this.translateX;
  }

  setThreshold() {
    if (!this.thresholdOffset) {
      const {
        offset: { width, height },
      } = this;

      /**
       * Calculates thresholdOffset only when required.
       *
       * Two-thirds of the dragged element's space for vertical and horizontal. If
       * two-thirds of the dragged is out, then trigger isOut whether it is out
       * position or out parent.
       */
      this.thresholdOffset = {
        vertical: {
          twoThirds: Math.ceil((2 / 3) * height),
          third: Math.ceil((1 / 3) * height),
        },
        horizontal: Math.ceil((2 / 3) * width),
      };
    }
  }

  transformElm() {
    this.ref.style.transform = `translate(${this.translateX}px,${this.translateY}px)`;
  }

  /**
   *  Update element index in order  branch
   *
   * @param i - index
   */
  private updateIndex(i: number) {
    const { self: oldIndex } = this.order;

    const newIndex = oldIndex + i;

    this.order.self = newIndex;

    return { oldIndex, newIndex };
  }

  /**
   *  Updates index locally and in store.
   *
   * @param branchIDsOrder -
   * @param inc - increment number
   * @param isShuffle -
   */
  private updateIDsOrder(
    branchIDsOrder: BranchELmOrder,
    inc: number,
    isShuffle: boolean
  ) {
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
   *  Set a new translate position and store the old one.
   *
   * @param topSpace -
   * @param operationID  - Only if moving to a new position.
   */
  private seTranslate(topSpace: number, operationID?: string) {
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
   * @param iDsInOrder -
   * @param sign - (+1/-1)
   * @param topSpace - space between dragged and the immediate next element.
   * @param operationID - A unique ID used to store translate history
   * @param vIncrement - the number of passed elements.
   * @param isShuffle -
   */
  setYPosition(
    iDsInOrder: BranchELmOrder,
    sign: number,
    topSpace: number,
    operationID: string,
    vIncrement = 1,
    isShuffle = true
  ) {
    this.seTranslate(sign * topSpace, operationID);

    this.updateIDsOrder(iDsInOrder, sign * vIncrement, isShuffle);
  }

  /**
   * Roll back element position vertically(y).
   *
   * @param operationID -
   */
  rollYBack(operationID: string) {
    if (
      this.prevTranslateY.length === 0 ||
      this.prevTranslateY[this.prevTranslateY.length - 1].ID !== operationID
    ) {
      return;
    }

    // @ts-ignore
    const topSpace = this.prevTranslateY.pop().translateY - this.translateY;

    const increment = topSpace > 0 ? 1 : -1;

    this.seTranslate(topSpace);
    this.updateIndex(increment);
  }
}

export default CoreInstance;
