import { PointNum } from "@dflex/utils";
import type {
  RectDimensions,
  Direction,
  Axes,
  IPointNum,
  IPointAxes,
} from "@dflex/utils";

import DFlexBaseNode from "./DFlexBaseNode";

import type {
  Keys,
  Order,
  ITransitionHistory,
  IDFlexCoreNode,
  DFlexBaseNodeInput,
  SerializedDFlexCoreNode,
} from "./types";

class DFlexCoreNode extends DFlexBaseNode implements IDFlexCoreNode {
  offset!: RectDimensions;

  currentPosition!: IPointNum;

  grid!: IPointNum;

  order: Order;

  keys: Keys;

  depth: number;

  isVisible: boolean;

  hasToTransform!: boolean;

  readonly: boolean;

  animatedFrame: number | null;

  private _translateHistory?: ITransitionHistory[];

  constructor(eleWithPointer: DFlexBaseNodeInput) {
    const { order, keys, depth, readonly, id } = eleWithPointer;

    super(id);

    this.order = order;
    this.keys = keys;
    this.depth = depth;
    this.readonly = readonly;
    this.isVisible = this.isInitialized && !this.isPaused;

    if (this.isInitialized) {
      this.setAttribute("INDEX", this.order.self);
    }

    if (!this.isPaused) {
      this._initIndicators(0, 0);
    }
    this.animatedFrame = null;
  }

  private _initIndicators(scrollX: number, scrollY: number): void {
    const { height, width, left, top } = this.DOM!.getBoundingClientRect();

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

  private _updateCurrentIndicators(space: IPointAxes): void {
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

  resume(scrollX: number, scrollY: number): void {
    if (!this.isInitialized) {
      this.attach();

      // It throws in the development and stop executing in the production.
      if (!this.isInitialized) return;
    }

    this.initTranslate();

    this._initIndicators(scrollX, scrollY);
  }

  changeVisibility(isVisible: boolean): void {
    if (isVisible === this.isVisible) return;

    this.isVisible = isVisible;

    if (this.hasToTransform && this.isVisible) {
      this.transformElm();
      this.hasToTransform = false;
    }
  }

  transformElm(): void {
    if (this.animatedFrame !== null) {
      window.cancelAnimationFrame(this.animatedFrame);
    }

    this.animatedFrame = window.requestAnimationFrame(() => {
      this.transform(this.translate.x, this.translate.y);
      this.animatedFrame = null;
    });
  }

  private _updateOrderIndexing(i: number) {
    const { self: oldIndex } = this.order;

    const newIndex = oldIndex + i;

    this.order.self = newIndex;

    this.setAttribute("INDEX", newIndex);

    return { oldIndex, newIndex };
  }

  assignNewPosition(branchIDsOrder: string[], newIndex: number): void {
    if (newIndex < 0 || newIndex > branchIDsOrder.length - 1) {
      if (__DEV__) {
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
      if (__DEV__) {
        // eslint-disable-next-line no-console
        console.error(
          "Illegal Attempt: Colliding in positions.\n",
          `Element id: ${this.id}\n`,
          `Collided at index: ${newIndex}\n`,
          `Siblings list: ${branchIDsOrder}\n`
        );
      }

      return;
    }

    branchIDsOrder[newIndex] = this.id;
  }

  private _leaveToNewPosition(
    branchIDsOrder: string[],
    newIndex: number,
    oldIndex: number
  ): void {
    branchIDsOrder[oldIndex] = "";

    branchIDsOrder[newIndex] = this.id;
  }

  /**
   *  Set a new translate position and store the old one.
   */
  private _seTranslate(
    elmSpace: IPointAxes,
    axis: Axes,
    operationID?: string,
    isForceTransform = false
  ): void {
    if (operationID) {
      const elmAxesHistory: ITransitionHistory = {
        ID: operationID,
        axis,
        translate: { x: this.translate.x, y: this.translate.y },
      };

      if (!Array.isArray(this._translateHistory)) {
        this._translateHistory = [elmAxesHistory];
      } else {
        this._translateHistory.push(elmAxesHistory);
      }
    }

    this._updateCurrentIndicators(elmSpace);

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
    axis: Axes
  ): void {
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

    this._seTranslate(elmSpace, axis, operationID);

    const { oldIndex, newIndex } = this._updateOrderIndexing(
      direction * numberOfPassedElm
    );

    if (axis === "z") {
      const inc = direction * numberOfPassedElm;
      this.grid.increase({ x: inc, y: inc });
    } else {
      this.grid[axis] += direction * numberOfPassedElm;
      if (__DEV__) {
        this.setAttribute(axis === "x" ? "GRID_X" : "GRID_Y", this.grid[axis]);
      }
    }

    this._leaveToNewPosition(iDsInOrder, newIndex, oldIndex);
  }

  /**
   * Roll back element position.
   *
   * @param operationID
   * @param isForceTransform
   */
  rollBack(operationID: string, isForceTransform: boolean): void {
    if (
      !Array.isArray(this._translateHistory) ||
      this._translateHistory.length === 0 ||
      this._translateHistory[this._translateHistory.length - 1].ID !==
        operationID
    ) {
      return;
    }

    const lastMovement = this._translateHistory.pop()!;

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

      if (__DEV__) {
        this.setAttribute(axis === "x" ? "GRID_X" : "GRID_Y", this.grid[axis]);
      }
    }

    // Don't update UI if it's zero and wasn't transformed.
    this._seTranslate(elmSpace, axis, undefined, isForceTransform);

    this._updateOrderIndexing(increment);

    this.rollBack(operationID, isForceTransform);
  }

  getOffset(): RectDimensions {
    return {
      width: this.offset.width,
      height: this.offset.height,
      top: this.currentPosition.y,
      left: this.currentPosition.x,
    };
  }

  getSerializedElm(): SerializedDFlexCoreNode {
    return {
      type: "core:node",
      version: 3,
      id: this.id,
      order: this.order,
      grid: this.grid,
      translate: this.translate,
      isVisible: this.isVisible,
      hasToTransform: this.hasToTransform,
      initialOffset: this.offset,
      currentOffset: this.getOffset(),
    };
  }
}

export default DFlexCoreNode;
