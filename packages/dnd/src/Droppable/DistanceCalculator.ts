import type { CoreInstanceInterface } from "@dflex/core-instance";

import type { InteractivityEvent } from "../types";
import type { DraggableDnDInterface } from "../Draggable";

import store from "../DnDStore";

import type {
  DistanceCalculatorInterface,
  EffectedElemDirection,
} from "./types";

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

  private elmTransitionY: number;

  private elmTransitionX: number;

  private draggedAccumulatedTransitionY: number;

  private draggedAccumulatedTransitionX: number;

  private draggedYOffset: number;

  private draggedXOffset: number;

  private siblingsEmptyElmIndex: number;

  constructor(draggable: DraggableDnDInterface) {
    this.draggable = draggable;

    this.elmTransitionY = 0;
    this.elmTransitionX = 0;

    this.draggedAccumulatedTransitionY = 0;
    this.draggedAccumulatedTransitionX = 0;
    this.draggedYOffset = 0;
    this.draggedXOffset = 0;

    /**
     * Elements effected by dragged direction.
     */
    this.effectedElemDirection = {
      x: 1,
      y: 1,
    };

    this.siblingsEmptyElmIndex = -1;
  }

  protected setEffectedElemDirectionV(isUp: boolean) {
    this.effectedElemDirection.y = isUp ? -1 : 1;
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

    this.draggedYOffset = 0;
    this.draggedXOffset = 0;

    this.elmTransitionY = 0;
    this.elmTransitionX = 0;

    // eslint-disable-next-line no-unused-vars
    const leftDifference = Math.abs(elmLeft! - draggedLeft);

    const topDifference = Math.abs(elmTop! - draggedTop);

    this.draggedAccumulatedTransitionY = topDifference;
    this.elmTransitionY = topDifference;

    const heightOffset = Math.abs(draggedHight - elmHight);

    if (heightOffset === 0) return;

    if (draggedHight < elmHight) {
      // console.log("elmHight is bigger");

      if (this.effectedElemDirection.x === -1) {
        // console.log("elm going up");

        this.draggedAccumulatedTransitionY += heightOffset;
        this.draggedYOffset = heightOffset;
      } else {
        // console.log("elm going down");

        this.elmTransitionY -= heightOffset;
      }

      return;
    }

    // console.log("elmHight is smaller");

    if (this.effectedElemDirection.x === -1) {
      // console.log("elm going up");

      this.draggedAccumulatedTransitionY -= heightOffset;
      this.draggedYOffset = -heightOffset;
    } else {
      // console.log("elm going down");

      this.elmTransitionY += heightOffset;
    }
  }

  protected updateOccupiedOffset(elmTop: number, elmLeft: number) {
    this.draggable.occupiedOffset.currentTop = elmTop + this.draggedYOffset;
    this.draggable.occupiedOffset.currentLeft = elmLeft;
  }

  private updateOccupiedTranslate(direction: 1 | -1) {
    this.draggable.occupiedTranslate.y +=
      direction * this.draggedAccumulatedTransitionY;

    this.draggable.occupiedTranslate.x += 0;
  }

  /**
   * Updates element instance and calculates the required transform distance. It
   * invokes for each eligible element in the parent container.
   *
   * @param id -
   */
  protected updateElement(
    id: string,
    isUpdateDraggedTranslate: boolean,
    draggedDirection?: 1 | -1
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

    if (isUpdateDraggedTranslate) {
      this.updateOccupiedTranslate(draggedDirection!);
    }

    /**
     * Start transforming process
     */
    this.siblingsEmptyElmIndex = element.setYPosition(
      store.getElmSiblingsListById(this.draggable.draggedElm.id)!,
      this.effectedElemDirection.y,
      this.elmTransitionY,

      this.draggable.operationID,
      this.siblingsEmptyElmIndex
    );

    emitInteractiveEvent("onDragLeave", element);
  }
}

export default DistanceCalculator;
