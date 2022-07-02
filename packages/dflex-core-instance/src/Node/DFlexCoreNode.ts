import { PointNum } from "@dflex/utils";
import type {
  RectDimensions,
  Direction,
  Axes,
  IPointNum,
  IPointAxes,
} from "@dflex/utils";

import DFlexBaseNode from "./DFlexBaseNode";

export type SerializedDFlexCoreNode = {
  type: string;
  version: 3;
  id: string;
  translate: IPointNum | null;
  grid: IPointNum;
  order: DOMGenOrder;
  initialOffset: RectDimensions;
  currentOffset: RectDimensions;
  hasTransformed: boolean;
  pendingTransform: boolean;
  isVisible: boolean;
};

type TransitionHistory = {
  ID: string;
  axis: Axes;
  translate: IPointAxes;
};

/**
 * Element unique keys in DOM tree.
 */
export interface Keys {
  SK: string;
  PK: string;
  CHK: string | null;
}

/**
 * Element order in its branch & higher branch
 */
export interface DOMGenOrder {
  self: number;
  parent: number;
}

export interface DFlexNodeInput {
  id: string;
  order: DOMGenOrder;
  keys: Keys;
  depth: number;
  readonly: boolean;
  isInitialized: boolean;
}

class DFlexCoreNode extends DFlexBaseNode {
  readonly initialOffset!: RectDimensions;

  currentPosition!: IPointNum;

  order: DOMGenOrder;

  keys: Keys;

  depth: number;

  grid!: IPointNum;

  isVisible: boolean;

  hasPendingTransform!: boolean;

  readonly: boolean;

  animatedFrame: number | null;

  private _translateHistory?: TransitionHistory[];

  static getType(): string {
    return "core:node";
  }

  static transform = DFlexBaseNode.transform;

  constructor(eleWithPointer: DFlexNodeInput) {
    const { order, keys, depth, readonly, id, isInitialized } = eleWithPointer;

    super(id);

    this.order = order;
    this.keys = keys;
    this.depth = depth;
    this.readonly = readonly;
    this.isPaused = isInitialized;
    this.isVisible = !this.isPaused;
    this.animatedFrame = null;
  }

  private _initIndicators(
    DOM: HTMLElement,
    scrollX: number,
    scrollY: number
  ): void {
    const { height, width, left, top } = DOM.getBoundingClientRect();

    /**
     * Element offset stored once without being triggered to re-calculate.
     * Instead, using currentOffset object as indicator to current
     * offset/position. This offset, is the init-offset.
     */
    // @ts-ignore - Initial.
    this.initialOffset = Object.freeze({
      height,
      width,
      left: left + scrollX,
      top: top + scrollY,
    });

    this.currentPosition = new PointNum(
      this.initialOffset.left,
      this.initialOffset.top
    );

    /**
     * Initializing grid comes later when the siblings boundaries are
     * initialized and the element is visible.
     */
    this.grid = new PointNum(0, 0);

    this.hasPendingTransform = false;
  }

  private _updateCurrentIndicators(space: IPointAxes): void {
    this.translate!.increase(space);

    const { left, top } = this.initialOffset!;

    /**
     * This offset related directly to translate Y and Y. It's isolated from
     * element current offset and effects only top and left.
     */
    this.currentPosition!.setAxes(
      left + this.translate!.x,
      top + this.translate!.y
    );

    if (!this.isVisible) this.hasPendingTransform = true;
  }

  resume(DOM: HTMLElement, scrollX: number, scrollY: number): void {
    this.initTranslate();
    this._initIndicators(DOM, scrollX, scrollY);
  }

  changeVisibility(DOM: HTMLElement, isVisible: boolean): void {
    if (isVisible === this.isVisible) return;

    this.isVisible = isVisible;

    if (this.hasPendingTransform && this.isVisible) {
      this.transform(DOM);
      this.hasPendingTransform = false;
    }
  }

  transform(DOM: HTMLElement): void {
    if (this.animatedFrame !== null) {
      window.cancelAnimationFrame(this.animatedFrame);
    }

    this.animatedFrame = window.requestAnimationFrame(() => {
      DFlexCoreNode.transform(DOM, this.translate!.x, this.translate!.y);
      this.animatedFrame = null;
    });
  }

  private _updateOrderIndexing(DOM: HTMLElement, i: number) {
    const { self: oldIndex } = this.order;

    const newIndex = oldIndex + i;

    this.order.self = newIndex;

    this.setAttribute(DOM, "INDEX", newIndex);

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
    DOM: HTMLElement,
    elmSpace: IPointAxes,
    axis: Axes,
    operationID?: string,
    isForceTransform = false
  ): void {
    if (operationID) {
      const elmAxesHistory: TransitionHistory = {
        ID: operationID,
        axis,
        translate: { x: this.translate!.x, y: this.translate!.y },
      };

      if (!Array.isArray(this._translateHistory)) {
        this._translateHistory = [elmAxesHistory];
      } else {
        this._translateHistory.push(elmAxesHistory);
      }
    }

    this._updateCurrentIndicators(elmSpace);

    if (!isForceTransform && !this.isVisible) {
      this.hasPendingTransform = true;

      return;
    }

    this.transform(DOM);

    this.hasPendingTransform = false;
  }

  /**
   *
   * @param iDsInOrder -
   * @param direction - (+1/-1)
   * @param elmSpace - space between dragged and the immediate next element.
   * @param operationID - A unique ID used to store translate history
   */
  setPosition(
    DOM: HTMLElement,
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

    this._seTranslate(DOM, elmSpace, axis, operationID);

    const { oldIndex, newIndex } = this._updateOrderIndexing(
      DOM,
      direction * numberOfPassedElm
    );

    if (axis === "z") {
      const inc = direction * numberOfPassedElm;
      this.grid.increase({ x: inc, y: inc });
    } else {
      this.grid[axis] += direction * numberOfPassedElm;
    }

    this._leaveToNewPosition(iDsInOrder, newIndex, oldIndex);
  }

  /**
   * Roll back element position.
   *
   * @param operationID
   * @param isForceTransform
   */
  rollBack(
    DOM: HTMLElement,
    operationID: string,
    isForceTransform: boolean
  ): void {
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
      x: preTranslate.x - this.translate!.x,
      y: preTranslate.y - this.translate!.y,
    };

    let increment = 0;

    if (axis === "z") {
      increment = elmSpace.x > 0 || elmSpace.y > 0 ? 1 : -1;

      this.grid.increase({ x: increment, y: increment });
    } else {
      increment = elmSpace[axis] > 0 ? 1 : -1;

      this.grid[axis] += increment;
    }

    // Don't update UI if it's zero and wasn't transformed.
    this._seTranslate(DOM, elmSpace, axis, undefined, isForceTransform);

    this._updateOrderIndexing(DOM, increment);

    this.rollBack(DOM, operationID, isForceTransform);
  }

  flushIndicators(DOM: HTMLElement): void {
    if (Array.isArray(this._translateHistory)) {
      this._translateHistory = [];
    }

    if (this.translate instanceof PointNum) {
      this.translate.setAxes(0, 0);
    }

    this._initIndicators(DOM, 0, 0);
  }

  hasTransformed(): boolean {
    return (
      this.translate instanceof PointNum &&
      (this.translate.x !== 0 || this.translate.y !== 0)
    );
  }

  getOffset(): RectDimensions {
    return {
      width: this.initialOffset.width,
      height: this.initialOffset.height,
      top: this.currentPosition.y,
      left: this.currentPosition.x,
    };
  }

  getSerializedElm(): SerializedDFlexCoreNode {
    return {
      type: DFlexCoreNode.getType(),
      version: 3,
      id: this.id,
      grid: this.grid,
      translate: this.translate instanceof PointNum ? this.translate : null,
      order: this.order,
      initialOffset: this.initialOffset,
      currentOffset: this.getOffset(),
      hasTransformed: this.hasTransformed(),
      isVisible: this.isVisible,
      pendingTransform: this.hasPendingTransform,
    };
  }
}

export default DFlexCoreNode;
