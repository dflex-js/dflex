/* eslint-disable no-param-reassign */
import { DFlexElement } from "@dflex/core-instance";

import {
  BOTH_AXIS,
  featureFlags,
  getDimensionTypeByAxis,
  PointNum,
} from "@dflex/utils";
import type {
  AxesPoint,
  Direction,
  Axis,
  Axes,
  AbstractBox,
} from "@dflex/utils";

import type DraggableInteractive from "../Draggable";

import { store, DFLEX_EVENTS } from "../LayoutManager";

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
      `Element ${id} is being transformed endlessly. This is causing infinite recursion affecting the element updater. This is most likely caused by a wrong threshold calculations.`
    );
  }
}

function composeElmMeta(element: DFlexElement) {
  return {
    id: element.id,
    index: element.VDOMOrder.self,
    target: store.interactiveDOM.get(element.id),
  };
}

type InsertionELmMeta = {
  isRestoredLastPosition: boolean;
  position: PointNum;
  isEmpty: boolean;
  isOrphan: boolean;
  elm: DFlexElement | null;
  prevElm: DFlexElement | null;
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
  const siblings = store.getElmSiblingsByKey(SK);

  const { length } = siblings;

  // Restore the last known current position.
  const { lastElmPosition, _originLength: originLength } =
    store.containers.get(SK)!;

  const position = new PointNum(0, 0);
  const isEmpty = isEmptyBranch(siblings);

  const isLastEmpty = siblings[length - 1] === APPEND_EMPTY_ELM_ID;

  // ["id"] || ["id", ""]
  const isOrphan = !isEmpty && (length === 1 || (length === 2 && isLastEmpty));

  let isRestoredLastPosition = false;

  let elm: null | DFlexElement = null;
  let prevElm: null | DFlexElement = null;

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

      elm = store.registry.get(siblings[at])!;
      const pos = elm.rect.getPosition();

      if (lastElmPosition) {
        if (length <= originLength) {
          position.clone(lastElmPosition);
          // Did we retorted the same element?
          isRestoredLastPosition = !lastElmPosition.isInstanceEqual(pos);
        } else {
          isRestoredLastPosition = false;
          position.clone(pos);
        }
      } else {
        position.clone(pos);
      }
    } else {
      elm = store.registry.get(siblings[insertAt])!;
      const pos = elm.rect.getPosition();

      position.clone(pos);
    }

    // Assign the previous element if not orphan.
    if (!isOrphan && prevIndex >= 0) {
      prevElm = store.registry.get(siblings[prevIndex])!;
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
  distSK: string,
  originSK: string,
  rect: AbstractBox
) {
  // Handle the migration.
  const destinationContainer = store.containers.get(distSK)!;

  // Append the newest element to the end of the branch.
  destinationContainer._register(rect);

  const originSiblings = store.getElmSiblingsByKey(originSK);

  // Don't reset empty branch keep the boundaries.
  if (originSiblings.length === 0) {
    return;
  }

  const originContainer = store.containers.get(originSK)!;

  originContainer._resetIndicators(originSiblings.length);

  originSiblings.forEach((elmID) => {
    const elm = store.registry.get(elmID)!;

    const gridIndex = originContainer._register(elm.rect);

    elm.DOMGrid.clone(gridIndex);
  });

  const lastInOrigin = store.registry.get(
    originSiblings[originSiblings.length - 1]
  )!;

  originContainer._preservePosition(lastInOrigin.rect.getPosition());
}

class DFlexPositionUpdater {
  protected _draggable: DraggableInteractive;

  private _elmTransition: PointNum;

  private _draggedPositionOffset: PointNum;

  private _draggedTransition: PointNum;

  /** Isolated form the threshold and predict is-out based on the controllers */
  protected _isParentLocked: boolean;

  constructor(draggable: DraggableInteractive) {
    this._draggable = draggable;

    /**
     * Next element calculated transition space.
     */
    this._elmTransition = new PointNum(0, 0);

    /**
     * Same as elmTransition but for dragged.
     */
    this._draggedPositionOffset = new PointNum(0, 0);

    this._draggedTransition = new PointNum(0, 0);

    this._isParentLocked = false;
  }

  private _setDistanceBtwPositions(
    axis: Axis,
    elmDirection: Direction,
    elm: DFlexElement
  ) {
    const { occupiedPosition, draggedElm } = this._draggable;

    const positionDiff = Math.abs(
      elm.rect.getPositionDiff(axis, occupiedPosition)
    );

    const dimensionDiff = elm.rect.getDimensionDiff(axis, draggedElm.rect);

    if (elmDirection === -1) {
      this._draggedTransition[axis] = positionDiff + dimensionDiff;
      this._draggedPositionOffset[axis] = dimensionDiff;

      this._elmTransition[axis] = positionDiff;
    } else {
      this._draggedTransition[axis] = positionDiff;
      this._draggedPositionOffset[axis] = 0;

      this._elmTransition[axis] = positionDiff - dimensionDiff;
    }
  }

  private _updateDraggable(axis: Axis, elmDirection: Direction) {
    const draggedDirection = -1 * elmDirection;

    this._draggedTransition[axis] *= draggedDirection;
    this._draggable.occupiedTranslate[axis] += this._draggedTransition[axis];

    if (__DEV__) {
      if (featureFlags.enableMechanismDebugger) {
        // eslint-disable-next-line no-console
        console.log(
          "_updateDraggable: new grid is",
          this._draggable.gridPlaceholder
        );
      }
    }
  }

  private _updateIndicators(
    axis: Axes,
    elmDirection: Direction,
    elm: DFlexElement
  ) {
    // Reset all indicators.
    this._elmTransition.setAxes(0, 0);
    this._draggedTransition.setAxes(0, 0);
    this._draggedPositionOffset.setAxes(0, 0);

    const axisToProcess: readonly Axis[] = axis === "z" ? BOTH_AXIS : [axis];

    axisToProcess.forEach((_axis) => {
      this._setDistanceBtwPositions(_axis, elmDirection, elm);
      this._updateDraggable(_axis, elmDirection);
    });

    const { rect, DOMGrid: grid } = elm;

    this._draggable.occupiedPosition.setAxes(
      rect.left + this._draggedPositionOffset.x,
      rect.top + this._draggedPositionOffset.y
    );

    this._draggable.gridPlaceholder.clone(grid);
  }

  protected _updateDraggedThresholdPosition(x: number, y: number) {
    if (__DEV__) {
      if (featureFlags.enableMechanismDebugger) {
        // eslint-disable-next-line no-console
        console.log(`updateDraggedThresholdPosition: ${x}/${y}`);
      }
    }

    const {
      threshold,
      draggedElm: {
        id,
        rect: { width, height },
      },
    } = this._draggable;

    const composedBox = {
      top: y,
      right: x + width,
      bottom: y + height,
      left: x,
    };

    threshold.updateMainThreshold(id, composedBox, false);
  }

  private _addDraggedOffsetToElm(
    position: AxesPoint,
    elm: DFlexElement,
    axis: Axis
  ) {
    const dimensionType = getDimensionTypeByAxis(axis);

    const { draggedElm } = this._draggable;

    // This initiation needs to append dragged rect based on targeted axis.
    position[axis] += draggedElm.rect[dimensionType];

    const rectDiff = elm.rect.getDimensionDiff(axis, draggedElm.rect);

    position[axis] += rectDiff;
  }

  /**
   * It calculates the new translate of the dragged element along with grid
   * position inside the container.
   */
  protected _getComposedOccupiedTranslateAndGrid(
    SK: string,
    insertAt: number,
    insertFromTop: boolean,
    axis: Axis
  ) {
    const { isEmpty, isOrphan, position, elm, prevElm } = getInsertionELmMeta(
      insertAt,
      SK
    );

    const { draggedElm, containersTransition } = this._draggable;
    const { migration } = store;

    // Getting diff with `currentPosition` includes the element transition
    // as well.
    const composedTranslate = {
      x: DFlexElement.getDistance(position, draggedElm, "x"),
      y: DFlexElement.getDistance(position, draggedElm, "y"),
    };

    const composedGrid = new PointNum(0, 0);

    // Get the stored position if the branch is empty.
    if (!isEmpty) {
      if (!isOrphan) {
        const { DOMGrid: grid } = elm!;

        composedGrid.clone(grid);
      }

      if (insertFromTop) {
        // Don't decrease the first element.
        if (composedGrid[axis] - 1 >= 1) {
          composedGrid[axis] -= 1;
        }
      } else {
        composedGrid[axis] += 1;

        const { marginBottom: mb, marginTop: mt } = migration.prev();

        this._addDraggedOffsetToElm(composedTranslate, elm!, axis);
        composedTranslate[axis] += isOrphan
          ? typeof mt === "number"
            ? mt
            : typeof mb === "number"
            ? mb
            : containersTransition.margin
          : DFlexElement.getDisplacement(position, prevElm!, axis);
      }
    }

    this._updateDraggedThresholdPosition(
      composedTranslate.x,
      composedTranslate.y
    );

    return { translate: composedTranslate, grid: composedGrid };
  }

  protected _getComposedOccupiedPosition(
    SK: string,
    axis: Axis
  ): AxesPoint<number> {
    const distLst = store.getElmSiblingsByKey(SK);

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
        // Transformation into an empty container.

        // TODO: Calculate positions inside container.
        // container Rect + container padding + element margin.
        // Until it's done we fake the number to zero.
        return new PointNum(0, 0);
      }

      return position;
    }

    // The essential insertion position is the last element in the container
    // but also on some cases it's different from retrieved position.
    const composedPosition = elm!.rect.getPosition();

    this._addDraggedOffsetToElm(composedPosition, elm!, axis);

    const { containersTransition } = this._draggable;
    const { migration } = store;

    const { marginBottom: mb, marginTop: mt } = migration.latest();

    // Give the priority to the destination first then check the origin.
    const marginBottom = isRestoredLastPosition
      ? DFlexElement.getDisplacement(position, elm!, axis)
      : isOrphan
      ? typeof mt === "number"
        ? mt
        : typeof mb === "number"
        ? mb
        : containersTransition.margin
      : DFlexElement.getDisplacement(position, prevElm!, axis); // orphan to orphan.

    composedPosition[axis] += Math.abs(marginBottom);

    return composedPosition;
  }

  /**
   * Updates element instance and calculates the required transform distance. It
   * invokes for each eligible element in the parent container.
   */
  protected _updateElement(
    id: string,
    numberOfPassedElm: number,
    isIncrease: boolean
  ) {
    const { draggedElm, occupiedPosition, gridPlaceholder } = this._draggable;

    const { SK, cycleID } = store.migration.latest();

    const siblings = store.getElmSiblingsByKey(SK);

    const { _grid: maxContainerGridBoundaries } = store.containers.get(SK)!;

    if (__DEV__) {
      // DFLex doesn't have error msg transformer yet for production.
      throwOnInfiniteTransformation(id);
    }

    const [element, DOM] = store.getElmWithDOM(id);

    let axis: Axes = element.rect.isPositionedY({
      left: occupiedPosition.x,
      top: occupiedPosition.y,
      bottom: occupiedPosition.y + draggedElm.rect.height,
      right: occupiedPosition.x + draggedElm.rect.width,
    })
      ? "y"
      : "x";

    const onSameAxis = occupiedPosition.onSameAxis(
      axis,
      element.rect.getPosition()
    );

    if (!onSameAxis) {
      const isPartOfZGrid = (_axis: Axis) => {
        // eslint-disable-next-line no-underscore-dangle
        return element.DOMGrid[_axis] > 0 || gridPlaceholder[_axis] > 0;
      };

      if (axis === "y" && isPartOfZGrid("x")) {
        axis = "z";
      } else if (axis === "x" && isPartOfZGrid("y")) {
        axis = "z";
      }
    }

    if (__DEV__) {
      if (featureFlags.enableMechanismDebugger) {
        // eslint-disable-next-line no-console
        console.log(`Update element ${id} on axis: ${axis}`);
      }
    }

    const elmDirection: Direction = isIncrease ? -1 : 1;

    this._updateIndicators(axis, elmDirection, element);

    // TODO: always true for the first element
    if (!this._isParentLocked) {
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

      const { rect } = element;

      this._updateDraggedThresholdPosition(rect.left, rect.top);
    }

    this._draggable.events.dispatch(
      DFLEX_EVENTS.ON_DRAG_OVER,
      composeElmMeta(element)
    );

    element.reconcilePosition(
      axis,
      elmDirection,
      DOM,
      siblings,
      this._elmTransition,
      numberOfPassedElm,
      maxContainerGridBoundaries,
      cycleID
    );

    this._draggable.events.dispatch(
      DFLEX_EVENTS.ON_DRAG_LEAVE,
      composeElmMeta(element)
    );
  }
}

export default DFlexPositionUpdater;
