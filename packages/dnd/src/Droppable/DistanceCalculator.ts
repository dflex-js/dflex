import type { CoreInstanceInterface } from "@dflex/core-instance";

import { PointNum } from "@dflex/utils";
import type { IPointNum, EffectedElemDirection, Axis } from "@dflex/utils";

import type { InteractivityEvent } from "../types";
import type { DraggableInteractiveInterface } from "../Draggable";

import store from "../DnDStore";

import type { DistanceCalculatorInterface } from "./types";

interface Difference {
  dragged: number;
  element: number;
}

function emitInteractiveEvent(
  type: InteractivityEvent["type"],
  element: CoreInstanceInterface
) {
  const evt: InteractivityEvent = {
    id: element.id,
    index: element.order.self,
    target: element.ref!,
    timeStamp: Date.now(),
    type,
  };

  store.emitEvent(evt);
}

/**
 * Calculates the distance between two elements and update the targeted element
 * accordingly.
 */
class DistanceCalculator implements DistanceCalculatorInterface {
  protected draggable: DraggableInteractiveInterface;

  protected effectedElemDirection: EffectedElemDirection;

  private elmTransition: IPointNum;

  private draggedOffset: IPointNum;

  private draggedAccumulatedTransition: IPointNum;

  private siblingsEmptyElmIndex: IPointNum;

  /** Isolated form the threshold and predict is-out based on the controllers */
  protected isParentLocked: boolean;

  constructor(draggable: DraggableInteractiveInterface) {
    this.draggable = draggable;

    /**
     * Next element calculated transition space.
     */
    this.elmTransition = new PointNum(0, 0);

    /**
     * Same as elmTransition but for dragged.
     */
    this.draggedOffset = new PointNum(0, 0);

    this.draggedAccumulatedTransition = new PointNum(0, 0);

    this.siblingsEmptyElmIndex = new PointNum(-1, -1);

    /**
     * Elements effected by dragged direction.
     * Negative for up and right.
     */
    this.effectedElemDirection = {
      x: 1,
      y: 1,
    };

    this.isParentLocked = false;
  }

  protected setEffectedElemDirection(isIncrease: boolean, axis: Axis) {
    this.effectedElemDirection[axis] = isIncrease ? -1 : 1;
  }

  /**
   *
   * @param position - Hight if the working axes is Y. Otherwise, it's width.
   * @param space - Hight if the working axes is Y. Otherwise, it's width.
   * @param axis - Axes(x or y).
   * @returns
   */
  private setDistanceIndicators(
    position: Difference,
    space: Difference,
    axis: Axis
  ) {
    const positionDifference = Math.abs(position.dragged - position.element);

    this.draggedAccumulatedTransition[axis] = positionDifference;
    this.elmTransition[axis] = positionDifference;

    const offsetDiff = Math.abs(space.dragged - space.element);

    if (offsetDiff === 0) return;

    if (space.dragged < space.element) {
      // console.log("elmHight is bigger");

      if (this.effectedElemDirection[axis] === -1) {
        // console.log("elm going up");

        this.draggedAccumulatedTransition[axis] += offsetDiff;
        this.draggedOffset[axis] = offsetDiff;
      } else {
        // console.log("elm going down");

        this.elmTransition[axis] -= offsetDiff;
      }

      return;
    }

    // console.log("elmHight is smaller");

    if (this.effectedElemDirection[axis] === -1) {
      // console.log("elm going up");

      this.draggedAccumulatedTransition[axis] -= offsetDiff;
      this.draggedOffset[axis] = -offsetDiff;
    } else {
      // console.log("elm going down");

      this.elmTransition[axis] += offsetDiff;
    }
  }

  private calculateDistance(element: CoreInstanceInterface, axis: Axis) {
    const {
      currentPosition: elmPosition,
      offset: { height: elmHight, width: elmWidth },
    } = element;

    const {
      occupiedOffset: { x: draggedLeft, y: draggedTop },
      draggedElm: {
        offset: { height: draggedHight, width: draggedWidth },
      },
    } = this.draggable;

    // Reset dragged offset.
    this.draggedOffset.setAxes(0, 0);
    this.elmTransition.setAxes(0, 0);

    if (axis === "y") {
      this.setDistanceIndicators(
        {
          dragged: draggedTop,
          element: elmPosition.y,
        },
        {
          dragged: draggedHight,
          element: elmHight,
        },
        "y"
      );

      return;
    }

    this.setDistanceIndicators(
      {
        dragged: draggedLeft,
        element: elmPosition.x,
      },
      {
        dragged: draggedWidth,
        element: elmWidth,
      },
      "x"
    );
  }

  /**
   * Updates element instance and calculates the required transform distance. It
   * invokes for each eligible element in the parent container.
   *
   * @param id -
   */
  protected updateElement(id: string, isIncrease: boolean, initAxis: Axis) {
    const element = store.registry[id];

    const { SK } = store.registry[id].keys;

    const siblingsGrid = store.siblingsGridContainer[SK];

    const isContainerHasCol =
      this.draggable.gridPlaceholder.x + 1 <= siblingsGrid.x;

    const axis = isContainerHasCol ? "x" : "y";

    if (initAxis !== axis) {
      throw new Error(
        `Axis is not the same as initAxis is ${initAxis} and axis is ${axis}`
      );
    }

    const elmDirection = isIncrease ? -1 : 1;

    this.calculateDistance(element, axis);

    this.draggable.updateNumOfElementsTransformed(elmDirection);

    // TODO: always true for the first element
    if (!this.isParentLocked) {
      /**
       * By updating the dragged translate, we guarantee that dragged
       * transformation will not triggered until dragged is over threshold
       * which will be detected by isDraggedOutPosition.
       *
       * However, this is only effective when dragged is fit in its new
       * translate.
       *
       * And we have new translate only once. The first element matched the
       * condition is the breaking point element.
       */

      const {
        offset: { width, height },
        currentPosition: { x, y },
      } = element;

      this.draggable.threshold.setMainThreshold(this.draggable.draggedElm.id, {
        width,
        height,
        left: x,
        top: y,
      });
    }

    emitInteractiveEvent("onDragOver", element);

    const { currentPosition, grid } = element;

    this.draggable.occupiedOffset.setAxes(
      currentPosition.x + this.draggedOffset.x,
      currentPosition.y + this.draggedOffset.y
    );

    const draggedDirection = -1 * elmDirection;

    this.draggable.occupiedTranslate.increase(
      draggedDirection * this.draggedAccumulatedTransition.x,
      draggedDirection * this.draggedAccumulatedTransition.y
    );

    this.draggable.gridPlaceholder.clone(grid);

    /**
     * Start transforming process
     */
    this.siblingsEmptyElmIndex[axis] = element.setPosition(
      store.getElmSiblingsListById(this.draggable.draggedElm.id)!,
      this.effectedElemDirection,
      this.elmTransition,
      this.draggable.operationID,
      this.siblingsEmptyElmIndex,
      axis
    );

    emitInteractiveEvent("onDragLeave", element);
  }
}

export default DistanceCalculator;
