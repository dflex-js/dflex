import { Node } from "@dflex/core-instance";
import type { INode } from "@dflex/core-instance";

import { Direction, PointNum } from "@dflex/utils";
import type { IPointNum, Axis } from "@dflex/utils";

import type { InteractivityEvent } from "../types";
import type { IDraggableInteractive } from "../Draggable";

import store from "../DnDStore";
import Droppable from "./Droppable";

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

  #getMarginBasedOnDragged(lst: string[], axis: Axis, isAfter: boolean) {
    const { draggedElm } = this.draggable;

    const elmIndex = isAfter
      ? draggedElm.order.self + 1
      : draggedElm.order.self - 1;

    if (elmIndex >= 0 && elmIndex < lst.length) {
      const nextElm = store.registry[lst[elmIndex]];

      if (nextElm) {
        // If the origin is not the first element, we need to add the margin
        // to the top.
        return nextElm.getDisplacement(draggedElm, axis);
      }
    }

    return DistanceCalculator.DEFAULT_SYNTHETIC_MARGIN;
  }

  #getInsertionELmMeta(insertAt: number, SK: string) {
    const lst = store.getElmBranchByKey(SK);

    const { length } = lst;

    let isExtended = insertAt > length - 1;
    let elm;

    const { draggedElm } = this.draggable;

    // Restore the last known current position.
    const { lastElmPosition } = store.containers[SK];

    let position;

    if (length === 0) {
      position = lastElmPosition;
    } else if (
      insertAt === length - 1 &&
      lst[insertAt] === Droppable.APPEND_EMPTY_ELM_ID
    ) {
      if (lastElmPosition) {
        position = lastElmPosition;
      } else {
        isExtended = true;
        elm = Droppable.getTheLastValidElm(lst, draggedElm.id);
        position = elm.currentPosition;
      }
    } else {
      elm = store.registry[lst[insertAt]];
      position = elm.currentPosition;
    }

    return {
      elm,
      position,
      isExtended,
    };
  }

  protected getInsertionOccupiedTranslate(insertAt: number, SK: string) {
    const { position, isExtended } = this.#getInsertionELmMeta(insertAt, SK);

    const { draggedElm } = this.draggable;

    // Getting diff with `currentPosition` includes the element transition
    // as well.
    const x = Node.getDistance(position, draggedElm, "x");
    const y = Node.getDistance(position, draggedElm, "y");

    if (isExtended) {
      const r = this.#getMarginBasedOnDragged(
        store.getElmBranchByKey(SK),
        "y",
        false
      );
    }
    this.updateDraggedThresholdPosition(x, y);

    return { x, y };
  }

  protected getInsertionOccupiedPosition(
    SK: string,
    originSK: string,
    axis: Axis
  ) {
    const distLst = store.getElmBranchByKey(SK);

    const { length } = distLst;

    const { position, elm, isExtended } = this.#getInsertionELmMeta(
      length - 1,
      SK
    );

    // Get the stored position if the branch is empty.
    if (!elm) return position;

    const lastElm = store.registry[distLst[length - 1]];

    // The essential position should be stimulate to case where position is
    // to last element in the list. So when the dragged enters the list its
    // element can go down based on this position.
    const insertionPosition = {
      x: position.x,
      y: position.y,
    };

    const rectType = Node.getRectByAxis(axis);

    const { draggedElm } = this.draggable;

    // This initiation needs to append dragged rect based on targeted axis.
    insertionPosition[axis] += draggedElm.offset[rectType];

    const rectDiff = lastElm.offset[rectType] - draggedElm.offset[rectType];

    insertionPosition[axis] += rectDiff;

    let marginBottom = 0;

    // Extract margin bottom.
    if (length > 1) {
      const prevLast = store.registry[distLst[length - 2]];

      marginBottom = lastElm.getDisplacement(prevLast, axis);
    } else if (!isExtended) {
      const diff =
        axis === "x" ? lastElm.getRectRight() : lastElm.getRectBottom();

      marginBottom = position[axis] - diff;
    } else {
      marginBottom = this.#getMarginBasedOnDragged(
        store.getElmBranchByKey(originSK),
        axis,
        true
      );
    }

    insertionPosition[axis] += Math.abs(marginBottom);

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
