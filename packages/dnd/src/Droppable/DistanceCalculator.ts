/* eslint-disable max-classes-per-file */
import type { CoreInstanceInterface } from "@dflex/core-instance";

import type { InteractivityEvent } from "../types";
import type { DraggableDnDInterface } from "../Draggable";

import store from "../DnDStore";

import type {
  DistanceCalculatorInterface,
  EffectedElemDirection,
  Direction,
  Axes,
} from "./types";

import AxesCoordinates from "./AxesCoordinates";

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
    this.elmTransition = new AxesCoordinates();

    /**
     * Same as elmTransition but for dragged.
     */
    this.draggedOffset = new AxesCoordinates();

    this.draggedAccumulatedTransition = new AxesCoordinates();

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

  protected setEffectedElemDirection(isUp: boolean, isRight: boolean) {
    this.effectedElemDirection.y = isUp ? -1 : 1;
    this.effectedElemDirection.x = isRight ? -1 : 1;
  }

  protected updateOccupiedOffset(elmTop: number, elmLeft: number) {
    this.draggable.occupiedOffset.currentTop = elmTop + this.draggedOffset.y;
    this.draggable.occupiedOffset.currentLeft = elmLeft + this.draggedOffset.x;
  }

  private calculateYDistance(element: CoreInstanceInterface) {
    const {
      currentLeft: elmLeft,
      currentTop: elmTop,
      // @ts-expect-error
      offset: { height: elmHight },
    } = element;

    const {
      occupiedOffset: { currentLeft: draggedLeft, currentTop: draggedTop },
      draggedElm: {
        // @ts-expect-error
        offset: { height: draggedHight },
      },
    } = this.draggable;

    this.elmTransition.setAxes(0, 0);
    this.draggedOffset.setAxes(0, 0);

    // eslint-disable-next-line no-unused-vars
    const leftDifference = Math.abs(elmLeft! - draggedLeft);

    const topDifference = Math.abs(elmTop! - draggedTop);

    this.draggedAccumulatedTransition.y = topDifference;
    this.elmTransition.y = topDifference;

    const heightOffset = Math.abs(draggedHight - elmHight);

    if (heightOffset === 0) return;

    if (draggedHight < elmHight) {
      // console.log("elmHight is bigger");

      if (this.effectedElemDirection.y === -1) {
        // console.log("elm going up");

        this.draggedAccumulatedTransition.y += heightOffset;
        this.draggedOffset.y = heightOffset;
      } else {
        // console.log("elm going down");

        this.elmTransition.y -= heightOffset;
      }

      return;
    }

    // console.log("elmHight is smaller");

    if (this.effectedElemDirection.y === -1) {
      // console.log("elm going up");

      this.draggedAccumulatedTransition.y -= heightOffset;
      this.draggedOffset.y = -heightOffset;
    } else {
      // console.log("elm going down");

      this.elmTransition.y += heightOffset;
    }
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

    this.calculateYDistance(element);

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
        // @ts-expect-error
        offset: { width, height },
        currentLeft,
        currentTop,
      } = element;

      this.draggable.threshold.updateElementThresholdMatrix(
        {
          width,
          height,
          left: currentLeft!,
          top: currentTop!,
        },
        false
      );
    }

    emitInteractiveEvent("onDragOver", element);

    const { currentLeft: elmLeft, currentTop: elmTop } = element;

    this.updateOccupiedOffset(elmTop!, elmLeft!);

    this.updateOccupiedTranslate(enforceDraggedDirection);

    /**
     * Start transforming process
     */
    this.siblingsEmptyElmIndex.y = element.setYPosition(
      store.getElmSiblingsListById(this.draggable.draggedElm.id)!,
      this.effectedElemDirection.y,
      this.elmTransition.y,

      this.draggable.operationID,
      this.siblingsEmptyElmIndex.y
    );

    emitInteractiveEvent("onDragLeave", element);
  }
}

export default DistanceCalculator;
