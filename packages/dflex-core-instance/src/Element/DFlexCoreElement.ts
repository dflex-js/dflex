/* eslint-disable no-underscore-dangle */
import {
  BoxRect,
  AbstractBoxRect,
  featureFlags,
  PointNum,
  assertElementPosition,
  getElmComputedDimensions,
  BOTH_AXIS,
  updateELmDOMGrid,
} from "@dflex/utils";
import type { Direction, Axes, AxesPoint } from "@dflex/utils";

import DFlexBaseElement from "./DFlexBaseElement";

export type DFlexSerializedElement = {
  type: string;
  version: 3;
  id: string;
  translate: PointNum | null;
  grid: PointNum;
  order: DFlexDOMGenOrder;
  initialPosition: AxesPoint;
  rect: AbstractBoxRect;
  hasTransformedFromOrigin: boolean;
  hasPendingTransformation: boolean;
  isVisible: boolean;
};

type TransitionHistory = {
  numberOfPassedElm: number;
  axes: Axes;
  translate: AxesPoint;
};

/**
 * Element unique keys in DOM tree.
 */
export interface Keys {
  BK: string;
  SK: string;
  PK: string;
  CHK: string | null;
}

/**
 * Element order in its branch & higher branch
 */
export interface DFlexDOMGenOrder {
  self: number;
  parent: number;
}

export interface DFlexElementInput {
  id: string;
  order: DFlexDOMGenOrder;
  keys: Keys;
  depth: number;
  readonly: boolean;
}

function resetDOMStyle(DOM: HTMLElement): void {
  DOM.style.removeProperty("transform");

  if (!DOM.getAttribute("style")) {
    DOM.removeAttribute("style");
  }
}

function assertGridBoundaries(
  id: string,
  DOMGrid: PointNum,
  maxContainerGridBoundaries: PointNum
) {
  if (DOMGrid.x < 0 || DOMGrid.y < 0) {
    throw new Error(
      `assertGridBoundaries: DOMGrid for ${id} element can't be below zero. Found ${JSON.stringify(
        DOMGrid
      )}`
    );
  }

  if (
    DOMGrid.x > maxContainerGridBoundaries.x ||
    DOMGrid.y > maxContainerGridBoundaries.y
  ) {
    throw new Error(
      `assertGridBoundaries: DOMGrid for ${id} element can't be above grid container boundaries. Found ${JSON.stringify(
        DOMGrid
      )} for container ${JSON.stringify(maxContainerGridBoundaries)}.`
    );
  }
}

class DFlexCoreElement extends DFlexBaseElement {
  private _initialPosition: PointNum;

  rect: BoxRect;

  private _computedDimensions: PointNum | null;

  // margin: BoxRect | null;

  VDOMOrder: DFlexDOMGenOrder;

  DOMOrder: DFlexDOMGenOrder;

  keys: Keys;

  depth: number;

  DOMGrid: PointNum;

  isVisible: boolean;

  hasPendingTransform: boolean;

  readonly: boolean;

  animatedFrame: number | null;

  private _translateHistory?: Map<string, TransitionHistory[]>;

  static getType(): string {
    return "core:element";
  }

  static transform = DFlexBaseElement.transform;

  constructor(eleWithPointer: DFlexElementInput) {
    const { order, keys, depth, readonly, id } = eleWithPointer;

    super(id);

    this.VDOMOrder = { ...order };
    this.DOMOrder = { ...order };
    this.keys = { ...keys };

    this.depth = depth;
    this.readonly = readonly;
    this.isPaused = false;
    this.isVisible = !this.isPaused;
    this.animatedFrame = null;
    this.hasPendingTransform = false;
    this._translateHistory = undefined;

    // CSS
    this._computedDimensions = null;
    // this.margin = null;
    this._initialPosition = new PointNum(0, 0);
    this.rect = new BoxRect(0, 0, 0, 0);
    this.DOMGrid = new PointNum(0, 0);

    if (__DEV__) {
      Object.seal(this);
    }
  }

  initElmRect(DOM: HTMLElement): void {
    const { height, width, left, top } = DOM.getBoundingClientRect();

    /**
     * Element offset stored once without being triggered to re-calculate.
     * Instead, using currentOffset object as indicator to current
     * offset/position. This offset, is the init-offset.
     */
    this._initialPosition.setAxes(left, top);

    this.rect.setByPointAndDimensions(top, left, height, width);
  }

  getDimensions(DOM: HTMLElement): PointNum {
    if (this._computedDimensions) {
      return this._computedDimensions;
    }

    const { width, height } = getElmComputedDimensions(DOM);

    this._computedDimensions = new PointNum(width, height);

    return this._computedDimensions;
  }

  // getMargin(DOM: HTMLElement): BoxRect {
  //   if (this.margin) {
  //     return this.margin;
  //   }

  //   const { width, height } = getElmComputedDimensions(DOM);

  //   this.margin = new BoxRect(width, height, height, height);

  //   return this.margin;
  // }

  getInitialPosition(): PointNum {
    return this._initialPosition;
  }

  changeVisibility(DOM: HTMLElement, isVisible: boolean): void {
    if (isVisible === this.isVisible) {
      return;
    }

    this.isVisible = isVisible;

    if (this.hasPendingTransform && this.isVisible) {
      this._transform(DOM);
      this.hasPendingTransform = false;
    }
  }

  private _transform(DOM: HTMLElement, cb?: () => void): void {
    if (this.animatedFrame !== null) {
      cancelAnimationFrame(this.animatedFrame);
    }

    this.animatedFrame = requestAnimationFrame(() => {
      DFlexCoreElement.transform(DOM, this.translate.x, this.translate.y);

      if (this.hasPendingTransform) {
        this.hasPendingTransform = false;
      }

      if (cb) {
        cb();
      }

      this.animatedFrame = null;

      if (__DEV__) {
        if (featureFlags.enablePositionAssertion) {
          setTimeout(() => {
            assertElementPosition(DOM, this.rect);
          }, 1000);
        }
      }
    });
  }

  updateIndex(DOM: HTMLElement, i: number) {
    this.setAttribute(DOM, "INDEX", i);
    this.VDOMOrder.self = i;

    if (__DEV__) {
      updateELmDOMGrid(DOM, this.DOMGrid);
    }
  }

  assignNewIndex(branchIDsOrder: string[], newIndex: number): void {
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

  private _leaveToNewIndex(
    branchIDsOrder: string[],
    newIndex: number,
    oldIndex: number
  ): void {
    branchIDsOrder[oldIndex] = "";

    branchIDsOrder[newIndex] = this.id;
  }

  private _pushToTranslateHistory(
    axes: Axes,
    cycleID: string,
    numberOfPassedElm: number
  ) {
    const translate = this.translate.getInstance();

    const elmAxesHistory: TransitionHistory = {
      axes,
      numberOfPassedElm,
      translate,
    };

    if (this._translateHistory === undefined) {
      this._translateHistory = new Map();
    }

    if (!this._translateHistory.has(cycleID)) {
      this._translateHistory.set(cycleID, []);
    }

    this._translateHistory.get(cycleID)!.push(elmAxesHistory);
  }

  private _transformOrPend(
    DOM: HTMLElement,
    hasToFlushTransform: boolean
  ): void {
    if (hasToFlushTransform) {
      if (!this.isVisible && this.hasPendingTransform) {
        this.hasPendingTransform = false;

        return;
      }

      this._transform(DOM);

      return;
    }

    if (!this.isVisible) {
      this.hasPendingTransform = true;

      return;
    }

    this._transform(DOM);
  }

  private _transformationProcess(
    DOM: HTMLElement,
    elmTransition: AxesPoint,
    hasToFlushTransform: boolean,
    increment: number
  ): [number, number] {
    this.translate.increase(elmTransition);

    /**
     * This offset related directly to translate Y and Y. It's isolated from
     * element current offset and effects only top and left.
     */
    this.rect.setAxes(
      this._initialPosition.x + this.translate.x,
      this._initialPosition.y + this.translate.y
    );

    this._transformOrPend(DOM, hasToFlushTransform);

    const { self: oldIndex } = this.VDOMOrder;

    const newIndex = oldIndex + increment;

    this.updateIndex(DOM, newIndex);

    return [oldIndex, newIndex];
  }

  private _updateDOMGrid(
    direction: Direction,
    numberOfPassedElm: number,
    maxContainerGridBoundaries: PointNum
  ) {
    if (direction === -1) {
      for (let i = 0; i < numberOfPassedElm; i += 1) {
        this.DOMGrid.x -= 1;

        if (this.DOMGrid.x < 0) {
          this.DOMGrid.x = maxContainerGridBoundaries.x;
          this.DOMGrid.y -= 1;
        }
      }

      return;
    }

    for (let i = 0; i < numberOfPassedElm; i += 1) {
      this.DOMGrid.x += 1;

      if (this.DOMGrid.x > maxContainerGridBoundaries.x) {
        this.DOMGrid.x = 0;
        this.DOMGrid.y += 1;
      }
    }
  }

  /**
   *
   * @param DOM
   * @param siblings
   * @param mainAxisDirection
   * @param elmTransition
   * @param operationID
   * @param axis
   */
  reconcilePosition(
    axis: Axes,
    mainAxisDirection: Direction,
    DOM: HTMLElement,
    siblings: string[],
    elmTransition: AxesPoint,
    numberOfPassedElm: number,
    maxContainerGridBoundaries: PointNum,
    operationID: string
  ): void {
    /**
     * `mainAxisDirection` decides the direction of the element, negative or positive.
     * If the element is dragged to the left, the `mainAxisDirection` is -1.
     */
    // const axisToProcess = axis === "z" ? BOTH_AXIS : [axis];

    if (axis === "z") {
      BOTH_AXIS.forEach((_axis, i) => {
        // i=0 for `X` which is the opposite of the main axis(`Y`) when dragging on `Z`
        const direction =
          i === 0 ? (mainAxisDirection === 1 ? -1 : 1) : mainAxisDirection;

        elmTransition[_axis] *= direction;

        this._updateDOMGrid(
          direction,
          numberOfPassedElm,
          maxContainerGridBoundaries
        );
      });
    } else {
      elmTransition[axis] *= mainAxisDirection;

      this._updateDOMGrid(
        mainAxisDirection,
        numberOfPassedElm,
        maxContainerGridBoundaries
      );
    }

    if (__DEV__) {
      assertGridBoundaries(this.id, this.DOMGrid, maxContainerGridBoundaries);
    }

    this._pushToTranslateHistory(axis, operationID, numberOfPassedElm);

    const [oldIndex, newIndex] = this._transformationProcess(
      DOM,
      elmTransition,
      false,
      mainAxisDirection * numberOfPassedElm
    );

    this._leaveToNewIndex(siblings, newIndex, oldIndex);
  }

  restorePosition(DOM: HTMLElement): void {
    this._transform(DOM);

    this.setAttribute(DOM, "INDEX", this.VDOMOrder.self);
  }

  assignNewPosition(DOM: HTMLElement, t: PointNum): void {
    this.translate.clone(t);
    this._transform(DOM);
  }

  /**
   * Roll back element position.
   *
   * @param cycleID
   */
  rollBackPosition(DOM: HTMLElement, cycleID: string): void {
    if (
      this._translateHistory === undefined ||
      !this._translateHistory.has(cycleID)
    ) {
      return;
    }

    if (__DEV__) {
      if (!Array.isArray(this._translateHistory.get(cycleID))) {
        throw new Error(
          `rollBackPosition: cycleID: ${cycleID} doesn't have a valid array history`
        );
      }
    }
    const lastMovement = this._translateHistory.get(cycleID)!;

    const {
      translate: preTranslate,
      axes,
      // numberOfPassedElm,
    } = lastMovement.pop()!;

    const elmTransition = {
      x: preTranslate.x - this.translate.x,
      y: preTranslate.y - this.translate.y,
    };

    let increment = 0;

    if (axes === "z") {
      increment = elmTransition.x > 0 || elmTransition.y > 0 ? 1 : -1;

      this.DOMGrid.increase({ x: increment, y: increment });
    } else {
      increment = elmTransition[axes] > 0 ? 1 : -1;

      this.DOMGrid[axes] += increment;
    }

    this._transformationProcess(DOM, elmTransition, true, increment);

    if (lastMovement.length === 0) {
      this._translateHistory.delete(cycleID);

      if (this._translateHistory.size === 0) {
        this._translateHistory = undefined;
      }

      return;
    }

    this.rollBackPosition(DOM, cycleID);
  }

  hasTransformedFromOrigin(): boolean {
    return this._initialPosition.isNotEqual(this.rect.left, this.rect.top);
  }

  needDOMReconciliation(): boolean {
    return this.VDOMOrder.self !== this.DOMOrder.self;
  }

  refreshIndicators(DOM: HTMLElement): void {
    this._translateHistory = undefined;

    this.translate.setAxes(0, 0);

    this.hasPendingTransform = false;

    this.DOMOrder.self = this.VDOMOrder.self;

    resetDOMStyle(DOM);

    this.initElmRect(DOM);

    this.DOMGrid.setAxes(0, 0);
  }

  getSerializedInstance(): DFlexSerializedElement {
    return {
      type: DFlexCoreElement.getType(),
      version: 3,
      id: this.id,
      grid: this.DOMGrid,
      translate: this.translate instanceof PointNum ? this.translate : null,
      order: this.VDOMOrder,
      initialPosition: this._initialPosition.getInstance(),
      rect: this.rect,
      hasTransformedFromOrigin: this.hasTransformedFromOrigin(),
      hasPendingTransformation: this.hasPendingTransform,
      isVisible: this.isVisible,
    };
  }
}

export default DFlexCoreElement;
