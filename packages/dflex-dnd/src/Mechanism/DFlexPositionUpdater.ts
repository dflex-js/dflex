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

import { store } from "../LayoutManager";

import { DFLEX_EVENTS, createInteractivityPayload } from "../Events";

const MAX_TRANSFORM_COUNT = 99; /** Infinite transform count */

let infiniteTransformCount: number = 0;
let elmInActiveArea: string | null = null;
let prevElmInActiveArea: string | null = null;

const {
  INTERACTIVITY_EVENT: { ON_DRAG_LEAVE, ON_DRAG_OVER },
} = DFLEX_EVENTS;

function throwOnInfiniteTransformation(id: string) {
  elmInActiveArea = id;

  if (prevElmInActiveArea !== elmInActiveArea) {
    infiniteTransformCount = 0;
    prevElmInActiveArea = elmInActiveArea;
  }

  infiniteTransformCount += 1;

  if (infiniteTransformCount > MAX_TRANSFORM_COUNT) {
    throw new Error(
      `Element ${id} is being transformed endlessly. This is causing infinite recursion affecting the element updater. This is most likely caused by a wrong threshold calculations.`,
    );
  }
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
  SK: string,
): InsertionELmMeta {
  const siblings = store.getElmSiblingsByKey(SK);

  const { length } = siblings;

  // Restore the last known current position.
  const { lastElmPosition, originLength } = store.containers.get(SK)!;

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
  rect: AbstractBox,
) {
  // Handle the migration.
  const destinationContainer = store.containers.get(distSK)!;

  // Append the newest element to the end of the branch.
  destinationContainer.register(rect);

  const originSiblings = store.getElmSiblingsByKey(originSK);

  // Don't reset empty branch keep the boundaries.
  if (originSiblings.length === 0) {
    return;
  }

  const originContainer = store.containers.get(originSK)!;

  originContainer.resetIndicators(originSiblings.length);

  originSiblings.forEach((elmID) => {
    const elm = store.registry.get(elmID)!;

    const gridIndex = originContainer.register(elm.rect);

    elm.DOMGrid.clone(gridIndex);
  });

  const lastInOrigin = store.registry.get(
    originSiblings[originSiblings.length - 1],
  )!;

  originContainer.preservePosition(lastInOrigin.rect.getPosition());
}

class DFlexPositionUpdater {
  protected draggable: DraggableInteractive;

  private _elmTransition: PointNum;

  private _draggedPositionOffset: PointNum;

  private _draggedTransition: PointNum;

  /**
   * Indicates whether the parent element is in a locked state.
   * When locked, it signifies that the dragged element is currently outside the
   * active/parent container.
   * This state is used to control interactions, when the element is outside its
   * designated area of operation.
   */
  protected isParentLocked: boolean;

  /**
   * Indicates whether the dragged element is currently outside a specified threshold.
   * When true, it means the element has surpassed a defined distance from its
   * original position.
   * This state can be used to trigger actions when the element exceeds a
   * certain threshold.
   */
  protected isOutsideThreshold: boolean;

  constructor(draggable: DraggableInteractive) {
    this.draggable = draggable;

    /**
     * Next element calculated transition space.
     */
    this._elmTransition = new PointNum(0, 0);

    /**
     * Same as elmTransition but for dragged.
     */
    this._draggedPositionOffset = new PointNum(0, 0);

    this._draggedTransition = new PointNum(0, 0);

    this.isParentLocked = false;
    this.isOutsideThreshold = false;
  }

  private _setDistanceBtwPositions(
    axis: Axis,
    elmDirection: Direction,
    elm: DFlexElement,
  ) {
    const { occupiedPosition, draggedElm } = this.draggable;

    const positionDiff = Math.abs(
      elm.rect.getPositionDiff(axis, occupiedPosition),
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
    this.draggable.occupiedTranslate[axis] += this._draggedTransition[axis];

    if (__DEV__) {
      if (featureFlags.enableMechanismDebugger) {
        // eslint-disable-next-line no-console
        console.log(
          "_updateDraggable: new grid is",
          this.draggable.gridPlaceholder,
        );
      }
    }
  }

  private _updateIndicators(
    axis: Axes,
    elmDirection: Direction,
    elm: DFlexElement,
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

    this.draggable.occupiedPosition.setAxes(
      rect.left + this._draggedPositionOffset.x,
      rect.top + this._draggedPositionOffset.y,
    );

    this.draggable.gridPlaceholder.clone(grid);
  }

  protected updateDraggedThresholdPosition(x: number, y: number) {
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
    } = this.draggable;

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
    axis: Axis,
  ) {
    const dimensionType = getDimensionTypeByAxis(axis);

    const { draggedElm } = this.draggable;

    // This initiation needs to append dragged rect based on targeted axis.
    position[axis] += draggedElm.rect[dimensionType];

    const rectDiff = elm.rect.getDimensionDiff(axis, draggedElm.rect);

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
    axis: Axis,
  ) {
    const { isEmpty, isOrphan, position, elm, prevElm } = getInsertionELmMeta(
      insertAt,
      SK,
    );

    const { draggedElm, containersTransition } = this.draggable;
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

    this.updateDraggedThresholdPosition(
      composedTranslate.x,
      composedTranslate.y,
    );

    return { translate: composedTranslate, grid: composedGrid };
  }

  protected getComposedOccupiedPosition(
    SK: string,
    axis: Axis,
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

    const { containersTransition } = this.draggable;
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
  protected updateElement(
    id: string,
    numberOfPassedElm: number,
    isIncrease: boolean,
  ) {
    const { draggedElm, occupiedPosition, gridPlaceholder } = this.draggable;

    const { SK, cycleID } = store.migration.latest();

    const siblings = store.getElmSiblingsByKey(SK);

    const { grid: maxContainerGridBoundaries } = store.containers.get(SK)!;

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
      element.rect.getPosition(),
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

      const { rect } = element;

      this.updateDraggedThresholdPosition(rect.left, rect.top);
    }

    this.draggable.events.dispatch(
      ON_DRAG_OVER,
      createInteractivityPayload(element, store),
    );

    element.reconcilePosition(
      axis,
      elmDirection,
      DOM,
      siblings,
      this._elmTransition,
      numberOfPassedElm,
      maxContainerGridBoundaries,
      cycleID,
    );

    this.draggable.events.dispatch(
      ON_DRAG_LEAVE,
      createInteractivityPayload(element, store),
    );
  }
}

export default DFlexPositionUpdater;
