/* eslint-disable no-param-reassign */

import { AxesCoordinates } from "@dflex/utils";

import type {
  RectDimensions,
  EffectedElemDirection,
  Axes,
  AxesCoordinatesInterface,
} from "@dflex/utils";

import AbstractInstance from "./AbstractInstance";

import type {
  Keys,
  Order,
  TransitionHistory,
  CoreInput,
  AbstractOpts,
  CoreInstanceInterface,
} from "./types";

class CoreInstance extends AbstractInstance implements CoreInstanceInterface {
  /** Initial read-only element offset */
  offset!: RectDimensions;

  /** Store history of Y-transition according to unique ID. */
  translateHistory?: AxesCoordinatesInterface<TransitionHistory>;

  /** Current element offset (x-left, y-top) */
  currentPosition!: AxesCoordinatesInterface;

  order: Order;

  grid!: AxesCoordinatesInterface;

  keys: Keys;

  depth: number;

  isVisible: boolean;

  hasToTransform!: boolean;

  animatedFrame: number | null;

  constructor(elementWithPointer: CoreInput, opts: AbstractOpts) {
    const { order, keys, depth, scrollX, scrollY, ...element } =
      elementWithPointer;

    super(element, opts);

    this.order = order;
    this.keys = keys;
    this.depth = depth;

    this.isVisible = this.isInitialized && !this.isPaused;

    if (this.isInitialized) {
      this.setDataset("index", this.order.self);
    }

    if (!this.isPaused) {
      this.initIndicators(scrollX, scrollY);
    }

    this.animatedFrame = null;
  }

  /**
   * Initializes the element offset only when it's called. Since it is storing
   * different numbers related to transformation we don't need to invoke for
   * idle element because it's costly.
   *
   * @param scrollX
   * @param scrollY
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

    this.currentPosition = new AxesCoordinates(
      this.offset.left,
      this.offset.top
    );

    this.grid = new AxesCoordinates(0, 0);

    this.hasToTransform = false;
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

    if (!this.isVisible) this.hasToTransform = true;
  }

  isPositionedUnder(elmY: number) {
    return elmY < this.currentPosition.y;
  }

  isPositionedLeft(elmX: number) {
    return elmX < this.currentPosition.x;
  }

  transformElm() {
    if (this.animatedFrame !== null) {
      window.cancelAnimationFrame(this.animatedFrame);
    }

    this.animatedFrame = window.requestAnimationFrame(() => {
      this.transform(this.translate.x, this.translate.y);
      this.animatedFrame = null;
    });
  }

  /**
   *  Update element index in siblings branch
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

    this.setDataset("index", newIndex);

    return oldIndex;
  }

  /**
   *  Set a new translate position and store the old one.
   *
   * @param elmSpace -
   * @param operationID  - Only if moving to a new position.
   */
  private seTranslate(
    elmSpace: number,
    axes: Axes,
    operationID?: string,
    isForceTransform = false
  ) {
    if (operationID) {
      const elmAxesHistory = {
        ID: operationID,
        pre: this.translate[axes],
      };

      if (!this.translateHistory) {
        this.translateHistory =
          axes === "x"
            ? new AxesCoordinates([elmAxesHistory], [])
            : new AxesCoordinates([], [elmAxesHistory]);
      } else {
        this.translateHistory[axes].push(elmAxesHistory);
      }
    }

    if (axes === "x") {
      this.updateCurrentIndicators(elmSpace, 0);
    } else {
      this.updateCurrentIndicators(0, elmSpace);
    }

    if (!isForceTransform && !this.isVisible) {
      this.hasToTransform = true;

      return;
    }

    this.transformElm();

    this.hasToTransform = false;
  }

  /**
   *
   * @param iDsInOrder -
   * @param effectedElemDirection - (+1/-1)
   * @param elmSpace - space between dragged and the immediate next element.
   * @param operationID - A unique ID used to store translate history
   * @param numberOfPassedElm - the number of passed elements.
   * @param isShuffle -
   */
  setPosition(
    iDsInOrder: string[],
    effectedElemDirection: EffectedElemDirection,
    elmSpace: AxesCoordinates,
    operationID: string,
    siblingsEmptyElmIndex: AxesCoordinates,
    axes: Axes,
    numberOfPassedElm = 1,
    isShuffle = true
  ) {
    /**
     * effectedElemDirection decides the direction of the element, negative or positive.
     * If the element is dragged to the left, the effectedElemDirection is -1.
     */
    elmSpace[axes] *= effectedElemDirection[axes];

    this.seTranslate(elmSpace[axes], axes, operationID);

    const { oldIndex, newIndex } = this.updateOrderIndexing(
      effectedElemDirection[axes] * numberOfPassedElm
    );

    const newStatusSiblingsHasEmptyElm = this.assignNewPosition(
      iDsInOrder,
      newIndex,
      isShuffle ? oldIndex : undefined,
      siblingsEmptyElmIndex[axes]
    );

    return newStatusSiblingsHasEmptyElm;
  }

  /**
   * Roll back element position.
   *
   * @param operationID
   * @param isForceTransform
   * @param axes
   */
  rollBack(operationID: string, isForceTransform: boolean, axes: Axes) {
    if (
      !this.translateHistory ||
      !this.translateHistory[axes] ||
      this.translateHistory[axes].length === 0 ||
      this.translateHistory[axes][this.translateHistory[axes].length - 1].ID !==
        operationID
    ) {
      return;
    }

    const lastMovement = this.translateHistory[axes].pop();

    if (!lastMovement) return;

    const { pre } = lastMovement;

    const elmSpace = pre - this.translate[axes];

    const increment = elmSpace > 0 ? 1 : -1;

    // Don't update UI if it's zero and wasn't transformed.
    this.seTranslate(elmSpace, axes, undefined, isForceTransform);

    const { newIndex } = this.updateOrderIndexing(increment);

    this.setDataset("index", newIndex);

    this.rollBack(operationID, isForceTransform, axes);
  }
}

export default CoreInstance;
