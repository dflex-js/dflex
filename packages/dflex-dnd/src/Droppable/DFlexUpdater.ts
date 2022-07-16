/* eslint-disable no-param-reassign */
import { DFlexNode } from "@dflex/core-instance";

import { Direction, IPointAxes, PointNum } from "@dflex/utils";
import type { IPointNum, Axis, RectDimensions } from "@dflex/utils";

import type DraggableInteractive from "../Draggable";

import { store } from "../LayoutManager";

const MAX_TRANSFORM_COUNT = 99; /** Infinite transform count */

let infiniteTransformCount: number = 0;
let elmInActiveArea: string | null = null;
let prevElmInActiveArea: string | null = null;

function throwOnInfiniteTransformation(id: string) {
  elmInActiveArea = id;

  if (prevElmInActiveArea !== elmInActiveArea) {
    infiniteTransformCount = 0;
    prevElmInActiveArea = elmInActiveArea;
  }

  infiniteTransformCount += 1;

  if (infiniteTransformCount > MAX_TRANSFORM_COUNT) {
    throw new Error(
      `Element ${id} is being transformed endlessly. This is causing infinite recursion affecting the element updater.` +
        `This is most likely caused by a wrong threshold calculations.`
    );
  }
}

function composeElmMeta(element: DFlexNode) {
  return {
    id: element.id,
    index: element.order.self,
    target: store.interactiveDOM.get(element.id),
  };
}

type InsertionELmMeta = {
  isRestoredLastPosition: boolean;
  position: IPointNum;
  isEmpty: boolean;
  isOrphan: boolean;
  elm: DFlexNode | null;
  prevElm: DFlexNode | null;
};

export const APPEND_EMPTY_ELM_ID = "";

export function isEmptyBranch(lst: string[]) {
  const { length } = lst;

  return length === 0 || (length === 1 && lst[0] === APPEND_EMPTY_ELM_ID);
}

export function getInsertionELmMeta(
  insertAt: number,
  SK: string
): InsertionELmMeta {
  const lst = store.getElmBranchByKey(SK);

  const { length } = lst;

  // Restore the last known current position.
  const { lastElmPosition, originLength } = store.containers.get(SK)!;

  const position = new PointNum(0, 0);
  const isEmpty = isEmptyBranch(lst);

  const isLastEmpty = lst[length - 1] === APPEND_EMPTY_ELM_ID;

  // ["id"] || ["id", ""]
  const isOrphan = !isEmpty && (length === 1 || (length === 2 && isLastEmpty));

  let isRestoredLastPosition = false;

  let elm: null | DFlexNode = null;
  let prevElm: null | DFlexNode = null;

  if (lastElmPosition) {
    // If empty then restore it.
    position.clone(lastElmPosition);
    isRestoredLastPosition = true;
  }

  if (!isEmpty) {
    const isInsertedLast = insertAt === length - 1;
    let prevIndex = insertAt - 1;

    // Then the priority is to restore the last position.
    if (isInsertedLast) {
      let at = insertAt;

      if (isLastEmpty) {
        prevIndex -= 1;
        at -= 1;
      }

      elm = store.registry.get(lst[at])!;

      if (lastElmPosition) {
        if (length <= originLength) {
          position.clone(lastElmPosition);
          // Did we retorted the same element?
          isRestoredLastPosition = !lastElmPosition.isEqual(
            elm.currentPosition
          );
        } else {
          isRestoredLastPosition = false;
          position.clone(elm.currentPosition);
        }
      } else {
        position.clone(elm.currentPosition);
      }
    } else {
      elm = store.registry.get(lst[insertAt])!;
      position.clone(elm.currentPosition);
    }

    // Assign the previous element if not orphan.
    if (!isOrphan && prevIndex >= 0) {
      prevElm = store.registry.get(lst[prevIndex])!;
    }
  }

  return {
    isEmpty,
    isOrphan,
    isRestoredLastPosition,
    position,
    elm,
    prevElm,
  };
}

export function handleElmMigration(
  SK: string,
  originSK: string,
  appendOffset: RectDimensions
) {
  const containerDist = store.containers.get(SK)!;

  // Append the newest element to the end of the branch.
  containerDist.registerNewElm(appendOffset);

  const origin = store.getElmBranchByKey(originSK);

  // Don't reset empty branch keep the boundaries.
  if (origin.length === 0) return;
  const containerOrigin = store.containers.get(originSK)!;

  containerOrigin.resetIndicators();

  origin.forEach((elmID) => {
    const elm = store.registry.get(elmID)!;

    containerOrigin.registerNewElm(elm.getOffset());
    elm.grid.clone(containerOrigin.grid);
  });

  const lastInOrigin = store.registry.get(origin[origin.length - 1])!;

  containerOrigin.preservePosition(lastInOrigin.currentPosition);
}

class DFlexUpdater {
  protected draggable: DraggableInteractive;

  private elmTransition: IPointNum;

  private draggedPositionOffset: IPointNum;

  private draggedTransition: IPointNum;

  /** Isolated form the threshold and predict is-out based on the controllers */
  protected isParentLocked: boolean;

  constructor(draggable: DraggableInteractive) {
    this.draggable = draggable;

    /**
     * Next element calculated transition space.
     */
    this.elmTransition = new PointNum(0, 0);

    /**
     * Same as elmTransition but for dragged.
     */
    this.draggedPositionOffset = new PointNum(0, 0);

    this.draggedTransition = new PointNum(0, 0);

    this.isParentLocked = false;
  }

  private setDistanceBtwPositions(
    element: DFlexNode,
    axis: Axis,
    elmDirection: Direction
  ) {
    const { occupiedPosition, draggedElm } = this.draggable;

    const positionDiff = Math.abs(
      element.currentPosition[axis] - occupiedPosition[axis]
    );

    const rectDiff = element.getRectDiff(draggedElm, axis);

    if (elmDirection === -1) {
      this.draggedTransition[axis] = positionDiff + rectDiff;
      this.draggedPositionOffset[axis] = rectDiff;

      this.elmTransition[axis] = positionDiff;
    } else {
      this.draggedTransition[axis] = positionDiff;
      this.draggedPositionOffset[axis] = 0;

      this.elmTransition[axis] = positionDiff - rectDiff;
    }
  }

  private updateDraggable(element: DFlexNode, elmDirection: Direction) {
    const { currentPosition, grid } = element;

    this.draggable.occupiedPosition.setAxes(
      currentPosition.x + this.draggedPositionOffset.x,
      currentPosition.y + this.draggedPositionOffset.y
    );

    const draggedDirection = -1 * elmDirection;

    this.draggable.occupiedTranslate.increase(
      this.draggedTransition.getMultiplied(draggedDirection)
    );

    this.draggable.gridPlaceholder.clone(grid);
  }

  private updateIndicators(
    element: DFlexNode,
    axis: Axis,
    elmDirection: Direction
  ) {
    this.elmTransition.setAxes(0, 0);
    this.draggedTransition.setAxes(0, 0);
    this.draggedPositionOffset.setAxes(0, 0);

    this.setDistanceBtwPositions(element, axis, elmDirection);
    this.updateDraggable(element, elmDirection);
  }

  protected updateDraggedThresholdPosition(x: number, y: number) {
    const {
      threshold,
      draggedElm: { id, initialOffset },
    } = this.draggable;

    threshold.updateMainThreshold(
      id,
      {
        width: initialOffset.width,
        height: initialOffset.height,
        left: x,
        top: y,
      },
      false
    );
  }

  private addDraggedOffsetToElm(
    position: IPointAxes,
    elm: DFlexNode,
    axis: Axis
  ) {
    const rectType = DFlexNode.getRectByAxis(axis);

    const { draggedElm } = this.draggable;

    // This initiation needs to append dragged rect based on targeted axis.
    position[axis] += draggedElm.initialOffset[rectType];

    const rectDiff =
      elm.initialOffset[rectType] - draggedElm.initialOffset[rectType];

    position[axis] += rectDiff;
  }

  /**
   * It calculates the new translate of the dragged element along with grid
   * position inside the container.
   */
  protected getComposedOccupiedTranslateAndGrid(
    SK: string,
    insertAt: number,
    insertFromTop: boolean,
    axis: Axis
  ) {
    const { isEmpty, isOrphan, position, elm, prevElm } = getInsertionELmMeta(
      insertAt,
      SK
    );

    const { draggedElm, migration, containersTransition } = this.draggable;

    // Getting diff with `currentPosition` includes the element transition
    // as well.
    const composedTranslate = {
      x: DFlexNode.getDistance(position, draggedElm, "x"),
      y: DFlexNode.getDistance(position, draggedElm, "y"),
    };

    const composedGrid = new PointNum(1, 1);

    // Get the stored position if the branch is empty.
    if (!isEmpty) {
      if (!isOrphan) {
        const { grid } = elm!;

        composedGrid.clone(grid);
      }

      if (insertFromTop) {
        // Don't decrease the first element.
        if (composedGrid[axis] - 1 >= 1) composedGrid[axis] -= 1;
      } else {
        composedGrid[axis] += 1;

        const { marginBottom: mb, marginTop: mt } = migration.prev();

        this.addDraggedOffsetToElm(composedTranslate, elm!, axis);
        composedTranslate[axis] += !isOrphan
          ? DFlexNode.getDisplacement(position, prevElm!, axis)
          : typeof mt === "number"
          ? mt
          : typeof mb === "number"
          ? mb
          : containersTransition.margin;
      }
    }

    this.updateDraggedThresholdPosition(
      composedTranslate.x,
      composedTranslate.y
    );

    return { translate: composedTranslate, grid: composedGrid };
  }

  protected getComposedOccupiedPosition(SK: string, axis: Axis) {
    const distLst = store.getElmBranchByKey(SK);

    const { length } = distLst;

    const {
      isEmpty,
      isOrphan,
      position,
      isRestoredLastPosition,
      elm,
      prevElm,
    } = getInsertionELmMeta(length - 1, SK);

    // Get the stored position if the branch is empty.
    if (isEmpty) {
      if (!isRestoredLastPosition) {
        throw new Error(
          "Transformation into an empty container in not supported yet."
        );
      }

      return position;
    }

    // The essential insertion position is the last element in the container
    // but also on some cases it's different from retrieved position.
    const composedPosition = elm!.currentPosition.getInstance();

    this.addDraggedOffsetToElm(composedPosition, elm!, axis);

    const { migration, containersTransition } = this.draggable;

    const { marginBottom: mb, marginTop: mt } = migration.latest();

    // Give the priority to the destination first then check the origin.
    const marginBottom = isRestoredLastPosition
      ? DFlexNode.getDisplacement(position, elm!, axis)
      : !isOrphan
      ? DFlexNode.getDisplacement(position, prevElm!, axis)
      : typeof mt === "number"
      ? mt
      : typeof mb === "number"
      ? mb
      : containersTransition.margin; // orphan to orphan.

    composedPosition[axis] += Math.abs(marginBottom);

    return composedPosition;
  }

  /**
   * Updates element instance and calculates the required transform distance. It
   * invokes for each eligible element in the parent container.
   */
  protected updateElement(id: string, isIncrease: boolean) {
    if (__DEV__) {
      // DFLex doesn't have error msg transformer yet for production.
      throwOnInfiniteTransformation(id);
    }

    const [element, DOM] = store.getElmWithDOM(id);

    const {
      keys: { SK },
    } = element;

    const { grid: siblingsGrid } = store.containers.get(SK)!;

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

    this.updateIndicators(element, axis, elmDirection);

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

    this.draggable.events.dispatch("ON_DRAG_OVER", composeElmMeta(element));

    const { migration } = this.draggable;

    element.setPosition(
      DOM,
      store.getElmBranchByKey(migration.latest().SK),
      elmDirection,
      this.elmTransition,
      migration.latest().id,
      axis
    );

    this.draggable.events.dispatch("ON_DRAG_LEAVE", composeElmMeta(element));
  }
}

export default DFlexUpdater;
