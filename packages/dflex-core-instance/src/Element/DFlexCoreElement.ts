import {
  BoxRect,
  BoxRectAbstract,
  Dimensions,
  featureFlags,
  PointNum,
  warnOnce,
  assertElementPosition,
  getElmComputedStyle,
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
  rect: BoxRectAbstract;
  hasTransformedFromOrigin: boolean;
  hasPendingTransformation: boolean;
  isVisible: boolean;
};

type TransitionHistory = {
  ID: string;
  axis: Axes;
  translate: AxesPoint;
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

function setRelativePosition(DOM: HTMLElement): void {
  const computedStyle = getElmComputedStyle(DOM);

  const position = computedStyle.getPropertyValue("position");

  if (position === "absolute" || position === "fixed") {
    if (__DEV__) {
      throw new Error(
        `Element ${DOM.id}, must be positioned as relative. Received: ${position}.`
      );
    }

    DOM.style.position = "relative";
  }
}

function getElmComputedDimensions(DOM: HTMLElement): Dimensions {
  const computedStyle = getElmComputedStyle(DOM);

  const computedWidth = computedStyle.getPropertyValue("width");
  const computedHeight = computedStyle.getPropertyValue("height");

  if (computedWidth.includes("%") || computedHeight.includes("%")) {
    if (__DEV__) {
      warnOnce(
        "getElementStyle",
        "Element cannot have a percentage width and/or height." +
          "If you are expecting the element to cross multiple scroll containers, then this will cause unexpected dimension when the element is cloned."
      );
    }
  }

  const regex = /^([0-9]*\.[0-9]*|[0-9]*)(px|em|rem|vw|vh)$/;

  const widthMatch = computedWidth.match(regex);
  const heightMatch = computedHeight.match(regex);

  const width = widthMatch ? parseFloat(widthMatch[1]) : 0;
  const height = heightMatch ? parseFloat(heightMatch[1]) : 0;

  return { width, height };
}

class DFlexCoreElement extends DFlexBaseElement {
  private _initialPosition: PointNum;

  rect: BoxRect;

  private _computedDimensions: PointNum | null;

  VDOMOrder: DFlexDOMGenOrder;

  DOMOrder: DFlexDOMGenOrder;

  keys: Keys;

  depth: number;

  DOMGrid: PointNum;

  isVisible: boolean;

  hasPendingTransform: boolean;

  readonly: boolean;

  animatedFrame: number | null;

  private _translateHistory?: TransitionHistory[];

  static getType(): string {
    return "core:element";
  }

  static transform = DFlexBaseElement.transform;

  static getElmComputedDimensions = getElmComputedDimensions;

  static setRelativePosition = setRelativePosition;

  constructor(eleWithPointer: DFlexElementInput) {
    const { order, keys, depth, readonly, id } = eleWithPointer;

    super(id);

    this.VDOMOrder = Object.seal({ ...order });
    this.DOMOrder = Object.seal({ ...order });
    this.keys = Object.seal({ ...keys });
    this.depth = depth;
    this.readonly = readonly;
    this.isPaused = false;
    this.isVisible = !this.isPaused;
    this.animatedFrame = null;
    this.hasPendingTransform = false;
    this._computedDimensions = null;

    this._initialPosition = new PointNum(0, 0);
    this.rect = new BoxRect(0, 0, 0, 0);
    this.DOMGrid = new PointNum(0, 0);
  }

  _initIndicators(DOM: HTMLElement): void {
    const { height, width, left, top } = DOM.getBoundingClientRect();

    /**
     * Element offset stored once without being triggered to re-calculate.
     * Instead, using currentOffset object as indicator to current
     * offset/position. This offset, is the init-offset.
     */
    this._initialPosition.setAxes(left, top);

    this.rect.setByPointAndDimensions(top, left, height, width);

    // This method also used for resetting.
    this.DOMGrid.setAxes(0, 0);
  }

  private _updateCurrentIndicators(newPos: AxesPoint): void {
    this.translate!.increase(newPos);

    /**
     * This offset related directly to translate Y and Y. It's isolated from
     * element current offset and effects only top and left.
     */
    this.rect.setAxes(
      this._initialPosition.x + this.translate!.x,
      this._initialPosition.y + this.translate!.y
    );

    if (!this.isVisible) {
      this.hasPendingTransform = true;
    }
  }

  getDimensions(DOM: HTMLElement): PointNum {
    if (this._computedDimensions) {
      return this._computedDimensions;
    }

    const { width, height } = DFlexCoreElement.getElmComputedDimensions(DOM);

    this._computedDimensions = new PointNum(width, height);

    return this._computedDimensions;
  }

  getInitialPosition(): PointNum {
    return this._initialPosition;
  }

  resume(DOM: HTMLElement): void {
    this.initTranslate();
    this._initIndicators(DOM);
  }

  changeVisibility(DOM: HTMLElement, isVisible: boolean): void {
    if (isVisible === this.isVisible) {
      return;
    }

    this.isVisible = isVisible;

    if (this.hasPendingTransform && this.isVisible) {
      this.transform(DOM);
      this.hasPendingTransform = false;
    }
  }

  transform(DOM: HTMLElement): void {
    if (this.animatedFrame !== null) {
      cancelAnimationFrame(this.animatedFrame);
    }

    this.animatedFrame = requestAnimationFrame(() => {
      DFlexCoreElement.transform(DOM, this.translate!.x, this.translate!.y);

      if (this.hasPendingTransform) {
        this.hasPendingTransform = false;
      }

      this.animatedFrame = null;
    });
  }

  private _updateOrderIndexing(DOM: HTMLElement, i: number) {
    const { self: oldIndex } = this.VDOMOrder;

    const newIndex = oldIndex + i;

    this.VDOMOrder.self = newIndex;

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
    axis: Axes,
    DOM: HTMLElement,
    elmPos: AxesPoint,
    operationID?: string,
    hasToFlushTransform = false
  ): void {
    if (operationID) {
      const elmAxesHistory: TransitionHistory = {
        ID: operationID,
        axis,
        translate: { x: this.translate!.x, y: this.translate!.y },
      };

      if (Array.isArray(this._translateHistory)) {
        this._translateHistory.push(elmAxesHistory);
      } else {
        this._translateHistory = [elmAxesHistory];
      }
    }

    this._updateCurrentIndicators(elmPos);

    if (hasToFlushTransform) {
      if (!this.isVisible && this.hasPendingTransform) {
        this.hasPendingTransform = false;

        return;
      }

      this.transform(DOM);

      return;
    }

    if (!this.isVisible) {
      this.hasPendingTransform = true;

      return;
    }

    this.transform(DOM);
  }

  /**
   *
   * @param DOM
   * @param siblings
   * @param direction
   * @param elmPos
   * @param operationID
   * @param axis
   */
  reconcilePosition(
    axis: Axes,
    direction: Direction,
    DOM: HTMLElement,
    siblings: string[],
    elmPos: PointNum,
    operationID: string
  ): void {
    const numberOfPassedElm = 1;

    /**
     * effectedElemDirection decides the direction of the element, negative or positive.
     * If the element is dragged to the left, the effectedElemDirection is -1.
     */
    if (axis === "z") {
      elmPos.multiplyAll(direction);
    } else {
      elmPos[axis] *= direction;
    }

    this._seTranslate(axis, DOM, elmPos, operationID);

    const { oldIndex, newIndex } = this._updateOrderIndexing(
      DOM,
      direction * numberOfPassedElm
    );

    if (axis === "z") {
      const inc = direction * numberOfPassedElm;
      this.DOMGrid.increase({ x: inc, y: inc });
    } else {
      this.DOMGrid[axis] += direction * numberOfPassedElm;
    }

    this._leaveToNewPosition(siblings, newIndex, oldIndex);

    if (__DEV__) {
      if (featureFlags.enablePositionAssertion) {
        if (!this.hasPendingTransform) {
          setTimeout(() => {
            assertElementPosition(DOM, this.rect);
          }, 1000);
        }
      }
    }
  }

  hasTransformed(): boolean {
    return (
      Array.isArray(this._translateHistory) && this._translateHistory.length > 0
    );
  }

  hasTransformedFromOrigin(): boolean {
    return this._initialPosition.isNotEqual(this.rect.left, this.rect.top);
  }

  needReconciliation(): boolean {
    return this.VDOMOrder.self !== this.DOMOrder.self;
  }

  /**
   * Roll back element position.
   *
   * @param cycleID
   */
  rollBack(DOM: HTMLElement, cycleID: string): void {
    if (
      !this.hasTransformed() ||
      this._translateHistory![this._translateHistory!.length - 1].ID !== cycleID
    ) {
      return;
    }

    const lastMovement = this._translateHistory!.pop()!;

    const { translate: preTranslate, axis } = lastMovement;

    const elmPos = {
      x: preTranslate.x - this.translate!.x,
      y: preTranslate.y - this.translate!.y,
    };

    let increment = 0;

    if (axis === "z") {
      increment = elmPos.x > 0 || elmPos.y > 0 ? 1 : -1;

      this.DOMGrid.increase({ x: increment, y: increment });
    } else {
      increment = elmPos[axis] > 0 ? 1 : -1;

      this.DOMGrid[axis] += increment;
    }

    // Don't update UI if it's zero and wasn't transformed.
    this._seTranslate(axis, DOM, elmPos, undefined, true);

    this._updateOrderIndexing(DOM, increment);

    this.rollBack(DOM, cycleID);
  }

  flushIndicators(DOM: HTMLElement): void {
    this._translateHistory = undefined;

    this.translate.setAxes(0, 0);

    this._initialPosition.setAxes(this.rect.left, this.rect.top);

    this.DOMOrder.self = this.VDOMOrder.self;

    this.hasPendingTransform = false;

    DOM.style.removeProperty("transform");

    if (!DOM.getAttribute("style")) {
      DOM.removeAttribute("style");
    }
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
      rect: this.rect.getRect(),
      hasTransformedFromOrigin: this.hasTransformedFromOrigin(),
      hasPendingTransformation: this.hasPendingTransform,
      isVisible: this.isVisible,
    };
  }
}

export default DFlexCoreElement;
