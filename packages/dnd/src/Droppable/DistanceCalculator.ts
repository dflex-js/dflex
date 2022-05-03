/* eslint-disable no-param-reassign */
import { Node } from "@dflex/core-instance";
import type { INode } from "@dflex/core-instance";

import { Direction, IPointAxes, PointNum } from "@dflex/utils";
import type { IPointNum, Axis } from "@dflex/utils";

import type { InteractivityEvent } from "../types";
import type { IDraggableInteractive } from "../Draggable";

import store from "../DnDStore";
import Droppable from "./Droppable";
import type { InsertionELmMeta } from "./types";

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

  #setDistanceBtwPositions(
    element: INode,
    axis: Axis,
    elmDirection: Direction
  ) {
    const { occupiedPosition, draggedElm } = this.draggable;

    const positionDiff = Math.abs(
      element.currentPosition[axis] - occupiedPosition[axis]
    );

    const rectDiff = element.getRectDiff(draggedElm, axis);

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

  #getInsertionELmMeta(
    insertAt: number,
    SK: string,
    isRetrievePrevElm?: true | never
  ): InsertionELmMeta {
    const lst = store.getElmBranchByKey(SK);

    const { length } = lst;

    const { draggedElm } = this.draggable;

    // Restore the last known current position.
    const { lastElmPosition } = store.containers[SK];

    const position = new PointNum(0, 0);

    let isRestoredLastPosition = false;
    let isOrphan = false;
    let elm: null | INode = null;

    let isRetrievePrevElmValid = false;
    let prevIndex = NaN;

    if (Droppable.isOrphan(lst)) {
      position.clone(lastElmPosition);
      isOrphan = true;
      isRestoredLastPosition = true;
    } else {
      const isInsertedLast = insertAt === length - 1;

      prevIndex = insertAt - 1;

      isRetrievePrevElmValid = isRetrievePrevElm
        ? prevIndex >= 0 && prevIndex < length
        : false;

      if (isInsertedLast) {
        elm = Droppable.getTheLastValidElm(lst, draggedElm.id);
        const elmPos = elm.currentPosition;

        if (lastElmPosition) {
          position.clone(lastElmPosition);
          isRestoredLastPosition = !lastElmPosition.isEqual(elmPos);
        } else {
          position.clone(elmPos);
        }
      } else {
        elm = store.registry[lst[insertAt]];
        position.clone(elm.currentPosition);
      }
    }

    return {
      elm,
      isOrphan,
      isRestoredLastPosition,
      position,
      ...(isRetrievePrevElmValid && {
        prevElm: store.registry[lst[prevIndex]],
      }),
    } as InsertionELmMeta;
  }

  #addDraggedOffsetToElm(position: IPointAxes, elm: INode | null, axis: Axis) {
    const rectType = Node.getRectByAxis(axis);

    const { draggedElm } = this.draggable;

    // This initiation needs to append dragged rect based on targeted axis.
    position[axis] += draggedElm.offset[rectType];

    if (elm) {
      const rectDiff = elm.offset[rectType] - draggedElm.offset[rectType];

      position[axis] += rectDiff;
    }
  }

  #getMarginBtwElmAndDragged(lst: string[], insertAt: number, axis: Axis) {
    const { draggedElm } = this.draggable;

    if (insertAt >= 0 && insertAt < lst.length) {
      const elm = store.registry[lst[insertAt]];

      if (elm) {
        // If the origin is not the first element, we need to add the margin
        // to the top.
        return elm.getDisplacement(draggedElm, axis);
      }
    }

    return DistanceCalculator.DEFAULT_SYNTHETIC_MARGIN;
  }

  protected getComposedOccupiedTranslate(
    insertAt: number,
    SK: string,
    insertFromAbove: boolean,
    axis: Axis
  ) {
    const { position, elm, isRestoredLastPosition } = this.#getInsertionELmMeta(
      insertAt,
      SK,
      true
    );

    const { draggedElm } = this.draggable;

    // Getting diff with `currentPosition` includes the element transition
    // as well.
    const composedTranslate = {
      x: Node.getDistance(position, draggedElm, "x"),
      y: Node.getDistance(position, draggedElm, "y"),
    };

    if (!isRestoredLastPosition && !insertFromAbove) {
      this.#addDraggedOffsetToElm(composedTranslate, elm, axis);
      // Add margin.
    }

    this.updateDraggedThresholdPosition(
      composedTranslate.x,
      composedTranslate.y
    );

    return composedTranslate;
  }

  protected getComposedOccupiedPosition(
    newSK: string,
    originSK: string,
    axis: Axis
  ) {
    const distLst = store.getElmBranchByKey(newSK);

    const { length } = distLst;

    const {
      position,
      isOrphan,
      isRestoredLastPosition,
      elm: lastElm,
      prevElm,
    } = this.#getInsertionELmMeta(length - 1, newSK, true);

    // Restore the last known current position.

    // Get the stored position if the branch is empty.
    if (isOrphan) {
      return position;
    }

    // The essential insertion position is the last element in the container
    // but also on some cases it's different from retrieved position.
    const composedPosition = {
      x: lastElm.currentPosition.x,
      y: lastElm.currentPosition.y,
    };

    this.#addDraggedOffsetToElm(composedPosition, lastElm, axis);

    const { draggedElm } = this.draggable;

    const marginBottom =
      length > 1 && prevElm
        ? Node.getDisplacement(lastElm.currentPosition, prevElm!, axis)
        : isRestoredLastPosition
        ? Node.getDisplacement(position, lastElm, axis)
        : // Absolute orphan list, one element no restored available.
          this.#getMarginBtwElmAndDragged(
            store.getElmBranchByKey(originSK),
            draggedElm.order.self + 1,
            axis
          );

    composedPosition[axis] += Math.abs(marginBottom);

    return composedPosition;
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
