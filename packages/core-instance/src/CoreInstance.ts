/* eslint-disable no-param-reassign */
import { AxesCoordinates } from "@dflex/utils";

import AbstractInstance from "./AbstractInstance";

import type {
  Keys,
  Order,
  CoreInstanceInterface,
  Rect,
  TransitionHistory,
  CoreInput,
} from "./types";

class CoreInstance extends AbstractInstance implements CoreInstanceInterface {
  isPaused: boolean;

  offset!: Rect;

  translate!: AxesCoordinates;

  /** Store history of Y-transition according to unique ID. */
  translateHistory?: AxesCoordinates<TransitionHistory>;

  currentPosition?: AxesCoordinates;

  currentTop?: number;

  currentLeft?: number;

  order: Order;

  keys: Keys;

  depth: number;

  isVisible: boolean;

  hasToTransform!: boolean;

  animatedFrame: number | null;

  constructor(elementWithPointer: CoreInput, opts: { isPaused: boolean }) {
    const { order, keys, depth, scrollX, scrollY, ...element } =
      elementWithPointer;

    super(element);

    this.isPaused = opts.isPaused;
    this.order = order;
    this.keys = keys;
    this.depth = depth;

    this.isVisible = element.isInitialized && !this.isPaused;

    if (element.isInitialized) {
      this.updateDataset(this.order.self);
    }

    if (!this.isPaused) {
      this.initTranslate();
      this.initIndicators(scrollX, scrollY);
    }

    this.animatedFrame = null;
  }

  /**
   * Initializes the element offset only when it's called. Since it is sorting
   * different numbers related to transformation we don't need to invoke for
   * idle element because it's costly.
   *
   * So, basically any working element in DnD should be initiated first.
   */
  private initIndicators(scrollX: number, scrollY: number) {
    const { height, width, left, top } = this.ref!.getBoundingClientRect();

    /**
     * Element offset stored once without being triggered to re-calculate.
     * Instead, using currentOffset object as indicator to current
     * offset/position. This offset, is the init-offset.
     */
    this.offset = {
      height,
      width,

      left: left + scrollX,
      top: top + scrollY,
    };

    this.currentPosition = new AxesCoordinates(left, top);

    this.currentTop = this.offset.top;
    this.currentLeft = this.offset.left;

    this.hasToTransform = false;
  }

  initTranslate() {
    /**
     * Since element render once and being transformed later we keep the data
     * stored to navigate correctly.
     *
     * If it's already initiated we don't need to do it again.
     * Reason: You may detach ref set flag to false and then attach it again. Do
     * you want to start from zero or maintain the last position.
     *
     * Continuity is fundamental in DFlex, please keep that in your mind.
     */
    if (!this.translate) {
      this.translate = new AxesCoordinates(0, 0);
    }

    this.isPaused = false;
  }

  resume(scrollX: number, scrollY: number) {
    if (!this.isInitialized) this.attach(null);

    this.initTranslate();

    this.initIndicators(scrollX, scrollY);
  }

  changeVisibility(isVisible: boolean) {
    if (isVisible === this.isVisible) return;

    this.isVisible = isVisible;

    if (this.hasToTransform && this.isVisible) {
      this.transformElm();
      this.hasToTransform = false;
    }
  }

  private updateCurrentIndicators(leftSpace: number, topSpace: number) {
    this.translate.setAxes(
      this.translate.x + leftSpace,
      this.translate.y + topSpace
    );

    const { left, top } = this.offset!;

    /**
     * This offset related directly to translate Y and Y. It's isolated from
     * element current offset and effects only top and left.
     */
    this.currentPosition!.setAxes(
      left + this.translate.x,
      top + this.translate.y
    );

    this.currentTop = top + this.translate.y;
    this.currentLeft = left + this.translate.x;

    if (!this.isVisible) this.hasToTransform = true;
  }

  isPositionedUnder(elmY: number) {
    return elmY < this.currentTop!;
  }

  isPositionedLeft(elmX: number) {
    return elmX < this.currentLeft!;
  }

  transformElm() {
    if (this.animatedFrame !== null) {
      window.cancelAnimationFrame(this.animatedFrame);
    }

    this.animatedFrame = window.requestAnimationFrame(() => {
      this.ref!.style.transform = `translate3d(${this.translate.x}px,${this.translate.y}px, 0)`;
      this.animatedFrame = null;
    });
  }

  updateDataset(i: number) {
    this.ref!.dataset.index = `${i}`;
  }

  /**
   *  Update element index in order  branch
   *
   * @param i - index
   */
  private updateOrderIndexing(i: number) {
    const { self: oldIndex } = this.order;

    const newIndex = oldIndex + i;

    this.order.self = newIndex;

    return { oldIndex, newIndex };
  }

  assignNewPosition(
    branchIDsOrder: string[],
    newIndex: number,
    oldIndex = -1,
    siblingsEmptyElmIndex = -1
  ) {
    if (newIndex < 0 || newIndex > branchIDsOrder.length - 1) {
      if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line no-console
        console.error(
          `Illegal Attempt: Received an index:${newIndex} on siblings list:${
            branchIDsOrder.length - 1
          }`
        );
      }

      return siblingsEmptyElmIndex;
    }

    if (oldIndex > -1) {
      if (siblingsEmptyElmIndex >= 0 && siblingsEmptyElmIndex !== newIndex) {
        if (process.env.NODE_ENV !== "production") {
          // eslint-disable-next-line no-console
          console.error(
            "Illegal Attempt: More than one element have left the siblings list"
          );
        }

        return siblingsEmptyElmIndex;
      }

      branchIDsOrder[oldIndex] = "";
    } else if (branchIDsOrder[newIndex].length > 0) {
      if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line no-console
        console.error("Illegal Attempt: Colliding in positions");
      }

      return siblingsEmptyElmIndex;
    }

    branchIDsOrder[newIndex] = this.id;

    this.updateDataset(newIndex);

    return oldIndex;
  }

  /**
   *  Set a new translate position and store the old one.
   *
   * @param topSpace -
   * @param operationID  - Only if moving to a new position.
   */
  private seTranslate(
    topSpace: number,
    operationID?: string,
    isForceTransform = false
  ) {
    if (operationID) {
      const historyY = {
        ID: operationID,
        pre: this.translate.y,
      };

      if (!this.translateHistory) {
        const historyX = {
          ID: operationID,
          pre: this.translate.x,
        };

        this.translateHistory = new AxesCoordinates([historyX], [historyY]);
      } else {
        this.translateHistory.y.push(historyY);
      }
    }

    this.updateCurrentIndicators(0, topSpace);

    if (!isForceTransform && !this.isVisible) {
      this.hasToTransform = true;

      return;
    }

    this.transformElm();

    this.hasToTransform = false;
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
    iDsInOrder: string[],
    sign: 1 | -1,
    topSpace: number,
    operationID: string,
    siblingsEmptyElmIndex = -1,
    vIncrement = 1,
    isShuffle = true
  ) {
    this.seTranslate(sign * topSpace, operationID);

    const { oldIndex, newIndex } = this.updateOrderIndexing(sign * vIncrement);

    const newStatusSiblingsHasEmptyElm = this.assignNewPosition(
      iDsInOrder,
      newIndex,
      isShuffle ? oldIndex : undefined,
      siblingsEmptyElmIndex
    );

    return newStatusSiblingsHasEmptyElm;
  }

  /**
   * Roll back element position vertically(y).
   *
   * @param operationID -
   */
  rollYBack(operationID: string, isForceTransform: boolean) {
    if (
      this.translateHistory!.y.length === 0 ||
      this.translateHistory!.y[this.translateHistory!.y.length - 1].ID !==
        operationID
    ) {
      return;
    }

    const { pre } = this.translateHistory!.y.pop()!;

    const topSpace = pre - this.translate.y;

    const increment = topSpace > 0 ? 1 : -1;

    // Don't update UI if it's zero and wasn't transformed.
    this.seTranslate(topSpace, undefined, isForceTransform);

    const { newIndex } = this.updateOrderIndexing(increment);

    this.updateDataset(newIndex);

    this.rollYBack(operationID, isForceTransform);
  }
}

export default CoreInstance;
