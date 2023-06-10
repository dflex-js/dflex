/* eslint-disable no-underscore-dangle */
import {
  BoxRect,
  AbstractBoxRect,
  featureFlags,
  PointNum,
  assertElmPos,
  getElmComputedDimensions,
  BOTH_AXIS,
  updateElmDatasetGrid,
  Axis,
  rmEmptyAttr,
  noop,
  getParsedElmTransform,
} from "@dflex/utils";
import type { Direction, Axes, AxesPoint, AnimationOpts } from "@dflex/utils";

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
  animation: AnimationOpts;
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

const ANIMATION_SPEED = 20;

function calculateAnimationDuration(from: AxesPoint, to: AxesPoint): number {
  // Calculate the horizontal and vertical distance between from and to positions
  const dx = from.x - to.x;
  const dy = from.y - to.y;

  // Calculate the total distance using the Pythagorean theorem
  const distance = Math.sqrt(dx * dx + dy * dy);

  // Calculate the duration based on the square root of the distance
  // Adjust the coefficient as needed to control the animation speed
  const duration = Math.sqrt(distance) * ANIMATION_SPEED;

  // Return the calculated duration
  return duration;
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

  private _isVisible: boolean;

  private _hasPendingTransform: boolean;

  readonly: boolean;

  private _animatedFrame: number | null;

  private _animation: AnimationOpts;

  private _translateHistory?: Map<string, TransitionHistory[]>;

  static getType(): string {
    return "core:element";
  }

  static transform = DFlexBaseElement.transform;

  constructor(eleWithPointer: DFlexElementInput) {
    const { order, keys, depth, readonly, animation, id } = eleWithPointer;

    super(id);

    this.VDOMOrder = { ...order };
    this.DOMOrder = { ...order };
    this.keys = { ...keys };

    this.depth = depth;
    this.readonly = readonly;
    this._isVisible = true;
    this._animatedFrame = null;
    this._hasPendingTransform = false;
    this._translateHistory = undefined;
    this._animation = animation;

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

  updateConfig(readonly: boolean, animation: AnimationOpts) {
    this.readonly = readonly;
    this._animation = animation;
  }

  initElmRect(DOM: HTMLElement, scrollLeft: number, scrollTop: number): void {
    const { height, width, left, top } = DOM.getBoundingClientRect();

    /**
     * Calculate the element's position by adding the scroll position to the
     * left and top values obtained from getBoundingClientRect.
     */
    const elementLeft = left + scrollLeft;
    const elementTop = top + scrollTop;

    /**
     * Element offset stored once without being triggered to re-calculate.
     * Instead, using currentOffset object as an indicator of the current
     * offset/position. This offset is the initial offset.
     */
    this._initialPosition.setAxes(elementLeft, elementTop);

    this.rect.setByPointAndDimensions(elementTop, elementLeft, height, width);

    this._initElmTranslate(DOM);
  }

  // TODO: need to be tested.
  private _initElmTranslate(DOM: HTMLElement): void {
    const transformMatrix = getParsedElmTransform(DOM);

    if (transformMatrix) {
      const [translateX, translateY] = transformMatrix;

      const elementLeft = this._initialPosition.x - translateX;
      const elementTop = this._initialPosition.y - translateY;

      this._initialPosition.setAxes(elementLeft, elementTop);

      this.rect.setByPointAndDimensions(
        elementTop,
        elementLeft,
        this.rect.height,
        this.rect.width
      );

      this.translate.setAxes(translateX, translateY);
    }
  }

  getDimensions(DOM: HTMLElement): PointNum {
    if (this._computedDimensions) {
      return this._computedDimensions;
    }

    const { width, height } = getElmComputedDimensions(DOM);

    this._computedDimensions = new PointNum(width, height);

    return this._computedDimensions;
  }

  getInitialPosition(): PointNum {
    return this._initialPosition;
  }

  changeVisibility(DOM: HTMLElement, isVisible: boolean): void {
    if (__DEV__) {
      if (featureFlags.enableVisibilityDebugger) {
        DOM.dataset.visibility = `${isVisible}`;
      }
    }

    if (isVisible === this._isVisible) {
      return;
    }

    this._isVisible = isVisible;

    if (this._hasPendingTransform && this._isVisible) {
      this._transform(DOM, 0);
      this._hasPendingTransform = false;
    }
  }

  private _transform(
    DOM: HTMLElement,
    duration: number | null,
    onComplete: () => void = noop
  ): void {
    if (!this._isVisible) {
      this._hasPendingTransform = true;
      return;
    }

    if (this._animatedFrame !== null) {
      cancelAnimationFrame(this._animatedFrame);
      this._animatedFrame = null;
    }

    const transitionComplete = () => {
      this._animatedFrame = null;

      onComplete();

      DOM.removeEventListener("transitionend", transitionComplete);

      if (__DEV__) {
        if (featureFlags.enablePositionAssertion) {
          setTimeout(() => {
            assertElmPos(DOM, this.rect);
          }, 1000);
        }
      }
    };

    DOM.addEventListener("transitionend", transitionComplete);

    try {
      this._animatedFrame = requestAnimationFrame(() => {
        // No animation is needed for the element.
        if (duration === null) {
          DFlexCoreElement.transform(DOM, this.translate.x, this.translate.y);
          transitionComplete();

          return;
        }

        DFlexCoreElement.transition(DOM, 0, duration, this._animation!.easing);
        DFlexCoreElement.transform(DOM, this.translate.x, this.translate.y);
      });
    } catch (error) {
      if (__DEV__) {
        // eslint-disable-next-line no-console
        console.log(error);
      }
    }
  }

  updateIndex(DOM: HTMLElement, i: number) {
    this.setAttribute(DOM, "INDEX", i);
    this.VDOMOrder.self = i;

    if (__DEV__) {
      updateElmDatasetGrid(DOM, this.DOMGrid);
    }
  }

  assignNewIndex(siblings: string[], newIndex: number): void {
    if (__DEV__) {
      if (newIndex < 0 || newIndex > siblings.length - 1) {
        throw new Error(
          `assignNewIndex: new index: ${newIndex} is outside siblings bound ${JSON.stringify(
            siblings
          )}`
        );
      }

      if (siblings[newIndex].length > 0) {
        throw new Error(
          `assignNewIndex: new index should occupy empty element at index: ${newIndex} but found ${siblings[newIndex]}`
        );
      }
    }

    siblings[newIndex] = this.id;
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
    enforceTransform: boolean,
    transformDuration: number | null
  ): void {
    if (enforceTransform) {
      if (!this._isVisible && this._hasPendingTransform) {
        this._hasPendingTransform = false;

        return;
      }

      this._transform(DOM, transformDuration);

      return;
    }

    if (!this._isVisible) {
      this._hasPendingTransform = true;

      return;
    }

    this._transform(DOM, transformDuration);
  }

  private _transformationProcess(
    DOM: HTMLElement,
    elmTransition: AxesPoint,
    enforceTransform: boolean,
    indexIncrement: number
  ): [number, number] {
    let calculatedDuration: number | null = null;

    if (this._animation) {
      const { duration } = this._animation;

      const oldPoint = this.translate.getInstance();
      const newPoint = this.translate.increase(elmTransition).getInstance();

      calculatedDuration =
        typeof duration === "number"
          ? duration
          : calculateAnimationDuration(oldPoint, newPoint);
    } else {
      this.translate.increase(elmTransition);
    }

    /**
     * This offset related directly to translate Y and Y. It's isolated from
     * element current offset and effects only top and left.
     */
    this.rect.setAxes(
      this._initialPosition.x + this.translate.x,
      this._initialPosition.y + this.translate.y
    );

    this._transformOrPend(DOM, enforceTransform, calculatedDuration);

    const { self: oldIndex } = this.VDOMOrder;

    const newIndex = oldIndex + indexIncrement;

    this.updateIndex(DOM, newIndex);

    return [oldIndex, newIndex];
  }

  private _updateDOMGridOnAxes(
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
   * @param cycleID
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
    cycleID: string
  ): void {
    /**
     * `mainAxisDirection` decides the direction of the element, negative or positive.
     * If the element is dragged to the left, the `mainAxisDirection` is -1.
     */
    let axisToProcess: readonly Axis[];

    const direction = {
      x: mainAxisDirection === 1 ? -1 : 1,
      y: mainAxisDirection,
    };

    if (axis === "z") {
      axisToProcess = BOTH_AXIS;
    } else {
      axisToProcess = [axis];
      direction[axis] = mainAxisDirection;
    }

    axisToProcess.forEach((_axis) => {
      elmTransition[_axis] *= direction[_axis];

      this._updateDOMGridOnAxes(
        direction[_axis] as Direction,
        numberOfPassedElm,
        maxContainerGridBoundaries
      );
    });

    if (__DEV__) {
      assertGridBoundaries(this.id, this.DOMGrid, maxContainerGridBoundaries);
    }

    this._pushToTranslateHistory(axis, cycleID, numberOfPassedElm);

    const indexIncrement = mainAxisDirection * numberOfPassedElm;

    const [oldIndex, newIndex] = this._transformationProcess(
      DOM,
      elmTransition,
      false,
      indexIncrement
    );

    siblings[oldIndex] = "";
    siblings[newIndex] = this.id;
  }

  restorePosition(DOM: HTMLElement): void {
    this._transform(DOM, -1);

    this.setAttribute(DOM, "INDEX", this.VDOMOrder.self);
  }

  assignNewPosition(DOM: HTMLElement, t: PointNum): void {
    this.translate.clone(t);
    this._transform(DOM, -1);
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
      numberOfPassedElm,
    } = lastMovement.pop()!;

    const elmTransition = {
      x: preTranslate.x - this.translate.x,
      y: preTranslate.y - this.translate.y,
    };

    let indexIncrement = 0;

    const direction = {
      x: elmTransition.x > 0 ? 1 : -1,
      y: elmTransition.y > 0 ? 1 : -1,
    };

    if (axes === "z") {
      indexIncrement = elmTransition.x > 0 || elmTransition.y > 0 ? 1 : -1;

      this.DOMGrid.increase({
        x: direction.x * numberOfPassedElm,
        y: direction.y * numberOfPassedElm,
      });
    } else {
      indexIncrement = direction[axes] * numberOfPassedElm;

      this.DOMGrid[axes] += indexIncrement;
    }

    this._transformationProcess(DOM, elmTransition, true, indexIncrement);

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

  refreshIndicators(
    DOM: HTMLElement,
    scrollTop: number,
    scrollLeft: number
  ): void {
    this._translateHistory = undefined;

    this.translate.setAxes(0, 0);

    this._hasPendingTransform = false;

    this.DOMOrder.self = this.VDOMOrder.self;

    DOM.style.removeProperty("transform");

    rmEmptyAttr(DOM, "style");

    this.initElmRect(DOM, scrollTop, scrollLeft);

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
      hasPendingTransformation: this._hasPendingTransform,
      isVisible: this._isVisible,
    };
  }
}

export default DFlexCoreElement;
