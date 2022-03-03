import type { CoreInstanceInterface } from "@dflex/core-instance";

import { AxesCoordinates } from "@dflex/utils";
import type { Direction, EffectedElemDirection, Axes } from "@dflex/utils";

import type { InteractivityEvent } from "../types";
import type { DraggableDnDInterface } from "../Draggable";

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
  protected draggable: DraggableDnDInterface;

  protected effectedElemDirection: EffectedElemDirection;

  private elmTransition: AxesCoordinates;

  private draggedOffset: AxesCoordinates;

  private draggedAccumulatedTransition: AxesCoordinates;

  private siblingsEmptyElmIndex: AxesCoordinates;

  constructor(draggable: DraggableDnDInterface) {
    this.draggable = draggable;

    /**
     * Next element calculated transition space.
     */
    this.elmTransition = new AxesCoordinates(0, 0);

    /**
     * Same as elmTransition but for dragged.
     */
    this.draggedOffset = new AxesCoordinates(0, 0);

    this.draggedAccumulatedTransition = new AxesCoordinates(0, 0);

    this.siblingsEmptyElmIndex = new AxesCoordinates(-1, -1);

    /**
     * Elements effected by dragged direction.
     * Negative for up and right.
     */
    this.effectedElemDirection = {
      x: 1,
      y: 1,
    };
  }

  protected setEffectedElemDirection(isIncrease: boolean, axes: Axes) {
    this.effectedElemDirection[axes] = isIncrease ? -1 : 1;
  }

  protected updateOccupiedOffset(elmTop: number, elmLeft: number) {
    this.draggable.occupiedOffset.currentTop = elmTop + this.draggedOffset.y;
    this.draggable.occupiedOffset.currentLeft = elmLeft + this.draggedOffset.x;
  }

  /**
   *
   * @param position - Hight if the working axes is Y. Otherwise, it's width.
   * @param space - Hight if the working axes is Y. Otherwise, it's width.
   * @param axes - Axes(x or y).
   * @returns
   */
  private setDistanceIndicators(
    position: Difference,
    space: Difference,
    axes: Axes
  ) {
    const positionDifference = Math.abs(position.dragged - position.element);

    this.draggedAccumulatedTransition[axes] = positionDifference;
    this.elmTransition[axes] = positionDifference;

    const offsetDiff = Math.abs(space.dragged - space.element);

    if (offsetDiff === 0) return;

    if (space.dragged < space.element) {
      // console.log("elmHight is bigger");

      if (this.effectedElemDirection[axes] === -1) {
        // console.log("elm going up");

        this.draggedAccumulatedTransition[axes] += offsetDiff;
        this.draggedOffset[axes] = offsetDiff;
      } else {
        // console.log("elm going down");

        this.elmTransition[axes] -= offsetDiff;
      }

      return;
    }

    // console.log("elmHight is smaller");

    if (this.effectedElemDirection[axes] === -1) {
      // console.log("elm going up");

      this.draggedAccumulatedTransition[axes] -= offsetDiff;
      this.draggedOffset[axes] = -offsetDiff;
    } else {
      // console.log("elm going down");

      this.elmTransition[axes] += offsetDiff;
    }
  }

  private calculateDistance(element: CoreInstanceInterface, axes: Axes) {
    const {
      currentPosition: elmPosition,
      offset: { height: elmHight, width: elmWidth },
    } = element;

    const {
      occupiedOffset: { currentLeft: draggedLeft, currentTop: draggedTop },
      draggedElm: {
        offset: { height: draggedHight, width: draggedWidth },
      },
    } = this.draggable;

    // Reset dragged offset.
    this.draggedOffset.setAxes(0, 0);
    this.elmTransition.setAxes(0, 0);

    if (axes === "y") {
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

  private updateOccupiedTranslate(direction: 1 | -1) {
    this.draggable.occupiedTranslate.y +=
      direction * this.draggedAccumulatedTransition.y;

    this.draggable.occupiedTranslate.x +=
      direction * this.draggedAccumulatedTransition.x;
  }

  /**
   * Updates element instance and calculates the required transform distance. It
   * invokes for each eligible element in the parent container.
   *
   * @param id -
   */
  protected updateElement(
    id: string,
    axes: Axes,
    enforceDraggedDirection: Direction
  ) {
    const element = store.registry[id];

    this.calculateDistance(element, axes);

    this.draggable.incNumOfElementsTransformed(this.effectedElemDirection.x);

    // TODO: always true for the first element
    if (!this.draggable.isOutActiveSiblingsContainer) {
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

      this.draggable.threshold.updateElementThresholdMatrix(
        {
          width,
          height,
          left: x,
          top: y,
        },
        false
      );
    }

    emitInteractiveEvent("onDragOver", element);

    const { currentPosition } = element;

    this.updateOccupiedOffset(currentPosition.y, currentPosition.x);

    this.updateOccupiedTranslate(enforceDraggedDirection);

    /**
     * Start transforming process
     */
    this.siblingsEmptyElmIndex[axes] = element.setPosition(
      store.getElmSiblingsListById(this.draggable.draggedElm.id)!,
      this.effectedElemDirection,
      this.elmTransition,
      this.draggable.operationID,
      this.siblingsEmptyElmIndex,
      axes
    );

    emitInteractiveEvent("onDragLeave", element);
  }
}

export default DistanceCalculator;
