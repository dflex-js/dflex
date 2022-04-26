import type { INode } from "@dflex/core-instance";

import { Direction, PointNum } from "@dflex/utils";
import type { IPointNum, Axis } from "@dflex/utils";

import type { InteractivityEvent } from "../types";
import type { IDraggableInteractive } from "../Draggable";

import store from "../DnDStore";

function emitInteractiveEvent(
  type: InteractivityEvent["type"],
  element: INode
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
class DistanceCalculator {
  protected draggable: IDraggableInteractive;

  #elmTransition: IPointNum;

  #draggedPositionOffset: IPointNum;

  #draggedTransition: IPointNum;

  #siblingsEmptyElmIndex: number;

  /** Isolated form the threshold and predict is-out based on the controllers */
  protected isParentLocked: boolean;

  static getRectByAxis(axis: Axis) {
    return axis === "x" ? "width" : "height";
  }

  static DEFAULT_SYNTHETIC_MARGIN = 10;

  constructor(draggable: IDraggableInteractive) {
    this.draggable = draggable;

    /**
     * Next element calculated transition space.
     */
    this.#elmTransition = new PointNum(0, 0);

    /**
     * Same as elmTransition but for dragged.
     */
    this.#draggedPositionOffset = new PointNum(0, 0);

    this.#draggedTransition = new PointNum(0, 0);

    this.#siblingsEmptyElmIndex = NaN;

    this.isParentLocked = false;
  }

  #getDiff(
    element: INode,
    axis: Axis,
    type: keyof Pick<INode, "offset" | "currentPosition"> | "occupiedPosition"
  ) {
    const { occupiedPosition, draggedElm } = this.draggable;

    const { currentPosition, offset: elmOffset } = element;

    let diff = 0;

    if (type === "currentPosition") {
      diff = currentPosition[axis] - draggedElm.currentPosition[axis];

      diff += draggedElm.translate[axis];

      return diff;
    }

    if (type === "occupiedPosition") {
      diff = Math.abs(currentPosition[axis] - occupiedPosition[axis]);

      return diff;
    }

    const rectType = DistanceCalculator.getRectByAxis(axis);

    diff = elmOffset[rectType] - draggedElm.offset[rectType];

    return diff;
  }

  #setDistanceBtwPositions(
    element: INode,
    axis: Axis,
    elmDirection: Direction
  ) {
    const positionDiff = this.#getDiff(element, axis, "occupiedPosition");
    const rectDiff = this.#getDiff(element, axis, "offset");

    if (elmDirection === -1) {
      this.#draggedTransition[axis] = positionDiff + rectDiff;
      this.#draggedPositionOffset[axis] = rectDiff;

      this.#elmTransition[axis] = positionDiff;
    } else {
      this.#draggedTransition[axis] = positionDiff;
      this.#draggedPositionOffset[axis] = 0;

      this.#elmTransition[axis] = positionDiff - rectDiff;
    }
  }

  #updateDraggable(element: INode, elmDirection: Direction) {
    const { currentPosition, grid } = element;

    this.draggable.occupiedPosition.setAxes(
      currentPosition.x + this.#draggedPositionOffset.x,
      currentPosition.y + this.#draggedPositionOffset.y
    );

    const draggedDirection = -1 * elmDirection;

    this.draggable.occupiedTranslate.increase(
      this.#draggedTransition.getMultiplied(draggedDirection)
    );

    this.draggable.gridPlaceholder.clone(grid);
  }

  #updateIndicators(element: INode, axis: Axis, elmDirection: Direction) {
    this.#elmTransition.setAxes(0, 0);
    this.#draggedTransition.setAxes(0, 0);
    this.#draggedPositionOffset.setAxes(0, 0);

    this.#setDistanceBtwPositions(element, axis, elmDirection);
    this.#updateDraggable(element, elmDirection);
  }

  protected updateDraggedThresholdPosition(x: number, y: number) {
    const {
      threshold,
      draggedElm: { id, offset },
    } = this.draggable;

    threshold.setMainThreshold(id, {
      width: offset.width,
      height: offset.height,
      left: x,
      top: y,
    });
  }

  protected getInsertionOccupiedTranslate(elmIndex: number, SK: string) {
    const lst = store.getElmBranchByKey(SK);

    let targetElm = store.registry[lst[elmIndex]];

    // If element is not in the list, it means we have orphaned elements the
    // list is empty se we restore the last known position.
    if (!targetElm) {
      const { firstElmPosition, lastElmPosition } = store.containers[SK];

      if (lst.length === 0) {
        targetElm = {
          currentPosition: firstElmPosition,
        } as INode;

        // Clear.
        store.containers[SK].setFirstElmPosition(null);
      } else {
        targetElm = {
          currentPosition: lastElmPosition,
        } as INode;
      }
    }

    // Getting diff with `currentPosition` includes the element transition
    // as well.
    const x = this.#getDiff(targetElm, "x", "currentPosition");
    const y = this.#getDiff(targetElm, "y", "currentPosition");

    this.updateDraggedThresholdPosition(x, y);

    return { x, y };
  }

  #getMarginBottom(distLst: string[], originLst: string[], axis: Axis) {
    const { length } = distLst;

    const last = store.registry[distLst[length - 1]];

    if (length > 1) {
      const prevLast = store.registry[distLst[length - 2]];

      if (prevLast) {
        return (
          last.currentPosition[axis] -
          (axis === "x" ? prevLast.getRectRight() : prevLast.getRectBottom())
        );
      }
    }

    const { draggedElm } = this.draggable;

    const nextElmIndex = draggedElm.order.self + 1;

    if (nextElmIndex < originLst.length) {
      const nextElm = store.registry[originLst[nextElmIndex]];

      if (nextElm) {
        // If the origin is not the first element, we need to add the margin
        // to the top.
        return (
          nextElm.currentPosition[axis] -
          (axis === "x"
            ? draggedElm.getRectRight()
            : draggedElm.getRectBottom())
        );
      }
    }

    return DistanceCalculator.DEFAULT_SYNTHETIC_MARGIN;
  }

  protected getInsertionOccupiedPosition(
    newSK: string,
    originSK: string,
    axis: Axis
  ) {
    const distLst = store.getElmBranchByKey(newSK);

    // Get the stored position if the branch is empty.
    if (distLst.length === 0) {
      // Restore the last known current position.
      const { firstElmPosition } = store.containers[newSK];

      return firstElmPosition!;
    }

    const lastElm = store.registry[distLst[distLst.length - 1]];

    // The essential position should be stimulate to case where position is
    // to last element in the list. So when the dragged enters the list its
    // element can go down based on this position.
    const insertionPosition = {
      x: lastElm.currentPosition.x,
      y: lastElm.currentPosition.y,
    };

    const rectType = DistanceCalculator.getRectByAxis(axis);

    const { draggedElm } = this.draggable;

    // This initiation needs to append dragged rect based on targeted axis.
    insertionPosition[axis] += draggedElm.offset[rectType];

    const rectDiff = lastElm.offset[rectType] - draggedElm.offset[rectType];

    insertionPosition[axis] += rectDiff;

    insertionPosition[axis] += this.#getMarginBottom(
      distLst,
      store.getElmBranchByKey(originSK),
      axis
    );

    return insertionPosition;
  }

  /**
   * Updates element instance and calculates the required transform distance. It
   * invokes for each eligible element in the parent container.
   */
  protected updateElement(id: string, isIncrease: boolean) {
    const element = store.registry[id];

    const {
      keys: { SK },
    } = element;

    const { grid: siblingsGrid } = store.containers[SK];

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

    this.#updateIndicators(element, axis, elmDirection);

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
        currentPosition: { x, y },
      } = element;

      this.updateDraggedThresholdPosition(x, y);
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
