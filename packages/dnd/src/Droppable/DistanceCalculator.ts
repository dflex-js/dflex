import type { CoreInstanceInterface } from "@dflex/core-instance";

import { Direction, PointNum } from "@dflex/utils";
import type { IPointNum, Axis } from "@dflex/utils";

import type { InteractivityEvent } from "../types";
import type { DraggableInteractiveInterface } from "../Draggable";

import store from "../DnDStore";

import type { DistanceCalculatorInterface } from "./types";

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

  #elmTransition: IPointNum;

  #draggedOffset: IPointNum;

  #draggedTransition: IPointNum;

  #siblingsEmptyElmIndex: number;

  /** Isolated form the threshold and predict is-out based on the controllers */
  protected isParentLocked: boolean;

  constructor(draggable: DraggableInteractiveInterface) {
    this.draggable = draggable;

    /**
     * Next element calculated transition space.
     */
    this.#elmTransition = new PointNum(0, 0);

    /**
     * Same as elmTransition but for dragged.
     */
    this.#draggedOffset = new PointNum(0, 0);

    this.#draggedTransition = new PointNum(0, 0);

    this.#siblingsEmptyElmIndex = NaN;

    this.isParentLocked = false;
  }

  setDistanceIndicators(
    element: CoreInstanceInterface,
    axis: Axis,
    elmDirection: Direction
  ) {
    const {
      occupiedPosition: occupiedOffset,
      draggedElm: { offset: draggedRect },
    } = this.draggable;

    const { currentPosition: elmPosition, offset: elmOffset } = element;

    const positionDiff = Math.abs(elmPosition[axis] - occupiedOffset[axis]);

    this.#draggedTransition[axis] = positionDiff;
    this.#elmTransition[axis] = positionDiff;

    const rectType = axis === "x" ? "width" : "height";

    const rectDiff = Math.abs(elmOffset[rectType] - draggedRect[rectType]);

    // Then dragged and element transition already set.
    if (rectDiff === 0) return;

    const equalizer = draggedRect[rectType] < elmOffset[rectType] ? 1 : -1;

    if (elmDirection === -1) {
      this.#draggedTransition[axis] += equalizer * rectDiff;
      this.#draggedOffset[axis] = equalizer * rectDiff;
    } else {
      this.#elmTransition[axis] += -1 * equalizer * rectDiff;
    }
  }

  updateDraggable(element: CoreInstanceInterface, elmDirection: Direction) {
    const { currentPosition, grid } = element;

    this.draggable.occupiedPosition.setAxes(
      currentPosition.x + this.#draggedOffset.x,
      currentPosition.y + this.#draggedOffset.y
    );

    const draggedDirection = -1 * elmDirection;

    this.draggable.occupiedTranslate.increase(
      this.#draggedTransition.getMultiplied(draggedDirection)
    );

    this.draggable.gridPlaceholder.clone(grid);
  }

  /**
   * Updates element instance and calculates the required transform distance. It
   * invokes for each eligible element in the parent container.
   *
   * @param id -
   */
  protected updateElement(id: string, isIncrease: boolean) {
    const element = store.registry[id];

    const {
      keys: { SK },
    } = element;

    const siblingsGrid = store.siblingsGridContainer[SK];

    const isContainerHasCol =
      this.draggable.gridPlaceholder.x + 1 <= siblingsGrid.x;

    let axis: Axis;

    if (!isContainerHasCol) {
      axis = "y";

      // const isContainerHasRowAbove =
      //   this.draggable.gridPlaceholder.y + 1 <= siblingsGrid.y;

      // if (isContainerHasRowAbove) {
      //   // Bi-directional
      //   axis = "z";
      // }
    } else {
      axis = "x";
    }

    const elmDirection: Direction = isIncrease ? -1 : 1;

    this.#draggedOffset.setAxes(0, 0);
    this.#elmTransition.setAxes(0, 0);

    this.setDistanceIndicators(element, axis, elmDirection);

    this.updateDraggable(element, elmDirection);

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

    /**
     * Start transforming process
     */
    this.#siblingsEmptyElmIndex = element.setPosition(
      store.getElmBranchByKey(this.draggable.migration.latest().key),
      elmDirection,
      this.#elmTransition,
      this.draggable.operationID,
      this.#siblingsEmptyElmIndex,
      axis
    );

    emitInteractiveEvent("onDragLeave", element);
  }
}

export default DistanceCalculator;
