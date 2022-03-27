/* eslint-disable no-param-reassign */

import { Point, PointNum } from "@dflex/utils";

import type {
  RectDimensions,
  Direction,
  Axis,
  IPoint,
  IPointNum,
  IPointAxes,
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
  offset!: RectDimensions;

  currentPosition!: IPointNum;

  grid!: IPointNum;

  order: Order;

  keys: Keys;

  depth: number;

  isVisible: boolean;

  hasToTransform!: boolean;

  animatedFrame: number | null;

  #translateHistory?: IPoint<TransitionHistory[]>;

  constructor(eleWithPointer: CoreInput, opts: AbstractOpts) {
    const { order, keys, depth, scrollX, scrollY, ...element } = eleWithPointer;

    super(element, opts);

    this.order = order;
    this.keys = keys;
    this.depth = depth;

    this.isVisible = this.isInitialized && !this.isPaused;

    if (this.isInitialized) {
      this.setDataset("index", this.order.self);
    }

    if (!this.isPaused) {
      this.#initIndicators(scrollX, scrollY);
    }

    this.animatedFrame = null;
  }

  #initIndicators(scrollX: number, scrollY: number) {
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

    this.currentPosition = new PointNum(this.offset.left, this.offset.top);

    /**
     * Initializing grid comes later when the siblings boundaries are
     * initialized and the element is visible.
     */
    this.grid = new PointNum(0, 0);

    this.hasToTransform = false;
  }

  #updateCurrentIndicators(space: IPointAxes) {
    this.translate.increase(space.x, space.y);

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

  resume(scrollX: number, scrollY: number) {
    if (!this.isInitialized) this.attach(null);

    this.initTranslate();

    this.#initIndicators(scrollX, scrollY);
  }

  changeVisibility(isVisible: boolean) {
    if (isVisible === this.isVisible) return;

    this.isVisible = isVisible;

    if (this.hasToTransform && this.isVisible) {
      this.transformElm();
      this.hasToTransform = false;
    }
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

  #updateOrderIndexing(i: number) {
    const { self: oldIndex } = this.order;

    const newIndex = oldIndex + i;

    this.order.self = newIndex;

    this.setDataset("index", newIndex);

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

    return oldIndex;
  }

  /**
   *  Set a new translate position and store the old one.
   */
  #seTranslate(
    elmSpace: IPointAxes,
    axis: Axis,
    operationID?: string,
    isForceTransform = false
  ) {
    if (operationID) {
      const elmAxesHistory: TransitionHistory = {
        ID: operationID,
        axis,
        translate: { x: this.translate.x, y: this.translate.y },
      };

      if (!this.#translateHistory) {
        this.#translateHistory =
          axis === "x"
            ? new Point([elmAxesHistory], [])
            : new Point([], [elmAxesHistory]);
      } else {
        this.#translateHistory[axis].push(elmAxesHistory);
      }
    }

    this.#updateCurrentIndicators(elmSpace);

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
   * @param direction - (+1/-1)
   * @param elmSpace - space between dragged and the immediate next element.
   * @param operationID - A unique ID used to store translate history
   * @param numberOfPassedElm - the number of passed elements.
   * @param isShuffle -
   */
  setPosition(
    iDsInOrder: string[],
    direction: Direction,
    elmSpace: PointNum,
    operationID: string,
    siblingsEmptyElmIndex: PointNum,
    axis: Axis,
    numberOfPassedElm = 1,
    isShuffle = true
  ) {
    /**
     * effectedElemDirection decides the direction of the element, negative or positive.
     * If the element is dragged to the left, the effectedElemDirection is -1.
     */
    elmSpace[axis] *= direction;

    this.#seTranslate(elmSpace, axis, operationID);

    const { oldIndex, newIndex } = this.#updateOrderIndexing(
      direction * numberOfPassedElm
    );

    this.grid[axis] += direction * numberOfPassedElm;

    if (process.env.NODE_ENV !== "production") {
      // if (this.grid[axis] !== newIndex + 1) {
      //   throw new Error(
      //     `Grid:  is ${this.grid[axis]} while the new index is ${newIndex}`
      //   );
      // }

      this.setDataset(
        `grid${axis.toUpperCase() as "X" | "Y"}`,
        this.grid[axis]
      );
    }

    const newStatusSiblingsHasEmptyElm = this.assignNewPosition(
      iDsInOrder,
      newIndex,
      isShuffle ? oldIndex : undefined,
      siblingsEmptyElmIndex[axis]
    );

    return newStatusSiblingsHasEmptyElm;
  }

  /**
   * Roll back element position.
   *
   * @param operationID
   * @param isForceTransform
   * @param axis
   */
  rollBack(operationID: string, isForceTransform: boolean, axis: Axis) {
    if (
      this.#translateHistory![axis].length === 0 ||
      this.#translateHistory![axis][this.#translateHistory![axis].length - 1]
        .ID !== operationID
    ) {
      return;
    }

    const lastMovement = this.#translateHistory![axis].pop();

    if (!lastMovement) return;

    const { translate: preTranslate } = lastMovement;

    const elmSpaceX = preTranslate.x - this.translate.x;
    const elmSpaceY = preTranslate.y - this.translate.y;

    const increment = elmSpaceX > 0 || elmSpaceY > 0 ? 1 : -1;

    // Don't update UI if it's zero and wasn't transformed.
    this.#seTranslate(
      {
        x: elmSpaceX,
        y: elmSpaceY,
      },
      axis,
      undefined,
      isForceTransform
    );

    this.#updateOrderIndexing(increment);

    this.grid[axis] += increment;

    if (process.env.NODE_ENV !== "production") {
      // if (this.grid[axis] !== newIndex + 1) {
      //   throw new Error(
      //     `Grid:  is ${this.grid[axis]} while the new index is ${newIndex}`
      //   );
      // }

      this.setDataset(
        `grid${axis.toUpperCase() as "X" | "Y"}`,
        this.grid[axis]
      );
    }

    this.rollBack(operationID, isForceTransform, axis);
  }
}

export default CoreInstance;
