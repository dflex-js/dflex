/* eslint-disable no-param-reassign */

import { PointNum } from "@dflex/utils";
import type {
  RectDimensions,
  Direction,
  Axes,
  IPointNum,
  IPointAxes,
} from "@dflex/utils";

import Abstract from "./Abstract";

import type {
  Keys,
  Order,
  TransitionHistory,
  CoreInput,
  AbstractOpts,
  ICore,
} from "./types";

class Core extends Abstract implements ICore {
  offset!: RectDimensions;

  currentPosition!: IPointNum;

  grid!: IPointNum;

  order: Order;

  keys: Keys;

  depth: number;

  isVisible: boolean;

  hasToTransform!: boolean;

  animatedFrame: number | null;

  #translateHistory?: TransitionHistory[];

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
    this.translate.increase(space);

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

  assignNewPosition(branchIDsOrder: string[], newIndex: number) {
    if (newIndex < 0 || newIndex > branchIDsOrder.length - 1) {
      if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line no-console
        console.error(
          `Illegal Attempt: Received an index:${newIndex} on siblings list:${
            branchIDsOrder.length - 1
          }.\n`
        );
      }

      return;
    }

    if (branchIDsOrder[newIndex].length > 0) {
      if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line no-console
        console.error(
          "Illegal Attempt: Colliding in positions.\n",
          `Element id: ${this.id}\n`,
          `Siblings list: ${branchIDsOrder}\n`
        );
      }

      return;
    }

    branchIDsOrder[newIndex] = this.id;
  }

  #leaveToNewPosition(
    branchIDsOrder: string[],
    newIndex: number,
    oldIndex: number,
    siblingsEmptyElmIndex: number
  ) {
    if (siblingsEmptyElmIndex >= 0 && siblingsEmptyElmIndex !== newIndex) {
      if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line no-console
        console.error(
          `Illegal Attempt: More than one element have left the siblings list.\n`,
          `Element id: ${this.id} - index: ${oldIndex}\n`,
          `Siblings list: ${branchIDsOrder}\n`
        );
      }

      return siblingsEmptyElmIndex;
    }

    branchIDsOrder[oldIndex] = "";

    branchIDsOrder[newIndex] = this.id;

    return siblingsEmptyElmIndex;
  }

  /**
   *  Set a new translate position and store the old one.
   */
  #seTranslate(
    elmSpace: IPointAxes,
    axis: Axes,
    operationID?: string,
    isForceTransform = false
  ) {
    if (operationID) {
      const elmAxesHistory: TransitionHistory = {
        ID: operationID,
        axis,
        translate: { x: this.translate.x, y: this.translate.y },
      };

      if (!Array.isArray(this.#translateHistory)) {
        this.#translateHistory = [elmAxesHistory];
      } else {
        this.#translateHistory.push(elmAxesHistory);
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
   */
  setPosition(
    iDsInOrder: string[],
    direction: Direction,
    elmSpace: IPointNum,
    operationID: string,
    siblingsEmptyElmIndex: number,
    axis: Axes
  ) {
    const numberOfPassedElm = 1;

    /**
     * effectedElemDirection decides the direction of the element, negative or positive.
     * If the element is dragged to the left, the effectedElemDirection is -1.
     */
    if (axis === "z") {
      elmSpace.multiplyAll(direction);
    } else {
      elmSpace[axis] *= direction;
    }

    this.#seTranslate(elmSpace, axis, operationID);

    const { oldIndex, newIndex } = this.#updateOrderIndexing(
      direction * numberOfPassedElm
    );

    if (axis === "z") {
      const inc = direction * numberOfPassedElm;
      this.grid.increase({ x: inc, y: inc });
    } else {
      this.grid[axis] += direction * numberOfPassedElm;
      if (process.env.NODE_ENV !== "production") {
        this.setDataset(
          `grid${axis.toUpperCase() as "X" | "Y"}`,
          this.grid[axis]
        );
      }
    }

    const newStatusSiblingsHasEmptyElm = this.#leaveToNewPosition(
      iDsInOrder,
      newIndex,
      oldIndex,
      siblingsEmptyElmIndex
    );

    return newStatusSiblingsHasEmptyElm;
  }

  /**
   * Roll back element position.
   *
   * @param operationID
   * @param isForceTransform
   */
  rollBack(operationID: string, isForceTransform: boolean) {
    if (
      !Array.isArray(this.#translateHistory) ||
      this.#translateHistory.length === 0 ||
      this.#translateHistory[this.#translateHistory.length - 1].ID !==
        operationID
    ) {
      return;
    }

    const lastMovement = this.#translateHistory.pop()!;

    const { translate: preTranslate, axis } = lastMovement;

    const elmSpace = {
      x: preTranslate.x - this.translate.x,
      y: preTranslate.y - this.translate.y,
    };

    let increment = 0;

    if (axis === "z") {
      increment = elmSpace.x > 0 || elmSpace.y > 0 ? 1 : -1;

      this.grid.increase({ x: increment, y: increment });
    } else {
      increment = elmSpace[axis] > 0 ? 1 : -1;

      this.grid[axis] += increment;

      if (process.env.NODE_ENV !== "production") {
        this.setDataset(
          `grid${axis.toUpperCase() as "X" | "Y"}`,
          this.grid[axis]
        );
      }
    }

    // Don't update UI if it's zero and wasn't transformed.
    this.#seTranslate(elmSpace, axis, undefined, isForceTransform);

    this.#updateOrderIndexing(increment);

    this.rollBack(operationID, isForceTransform);
  }
}

export default Core;
