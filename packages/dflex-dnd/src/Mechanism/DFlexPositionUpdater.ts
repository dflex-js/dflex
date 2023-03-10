/* eslint-disable no-param-reassign */
import { DFlexElement } from "@dflex/core-instance";

import { Axes, BOTH_AXIS, featureFlags, PointNum } from "@dflex/utils";
import type { AxesPoint, Direction, Axis, AbstractBox } from "@dflex/utils";

import type { Siblings } from "@dflex/dom-gen";
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
  rect: AbstractBox
) {
  // Handle the migration.
  const containerDist = store.containers.get(distSK)!;

  // Append the newest element to the end of the branch.
  containerDist.registerNewElm(rect);

  const originBranch = store.getElmSiblingsByKey(originSK);

  // Don't reset empty branch keep the boundaries.
  if (originBranch.length === 0) {
    return;
  }

  const containerOrigin = store.containers.get(originSK)!;

  containerOrigin.resetIndicators(originBranch.length);

  originBranch.forEach((elmID) => {
    const elm = store.registry.get(elmID)!;

    containerOrigin.registerNewElm(elm.rect);

    elm.DOMGrid.clone(containerOrigin.grid);
  });

  const lastInOrigin = store.registry.get(
    originBranch[originBranch.length - 1]
  )!;

  containerOrigin.preservePosition(lastInOrigin.rect.getPosition());
}

class DFlexPositionUpdater {
  protected draggable: DraggableInteractive;

  private elmTransition: PointNum;

  private draggedPositionOffset: PointNum;

  private draggedTransition: PointNum;

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
    axis: Axis,
    elmDirection: Direction,
    element: DFlexElement
  ) {
    const { occupiedPosition, draggedElm } = this.draggable;

    const positionDiff = Math.abs(
      element.rect[axis === "x" ? "left" : "top"] - occupiedPosition[axis]
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

  private updateDraggable(
    axis: Axes,
    elmDirection: Direction,
    element: DFlexElement
  ) {
    const { rect, DOMGrid: grid } = element;

    this.draggable.occupiedPosition.setAxes(
      rect.left + this.draggedPositionOffset.x,
      rect.top + this.draggedPositionOffset.y
    );

    const draggedDirection = -1 * elmDirection;

    if (axis !== "z") {
      this.draggedTransition[axis] *= draggedDirection;
      this.draggable.occupiedTranslate[axis] += this.draggedTransition[axis];
    }

    // this.draggable.occupiedTranslate.clone(this.draggedTransition);

    // this.draggable.occupiedTranslate.increase(
    //   this.draggedTransition.getMultiplied(draggedDirection)
    // );

    this.draggable.gridPlaceholder.clone(grid);
  }

  private updateIndicators(
    axis: Axes,
    elmDirection: Direction,
    element: DFlexElement
  ) {
    this.elmTransition.setAxes(0, 0);
    this.draggedTransition.setAxes(0, 0);
    this.draggedPositionOffset.setAxes(0, 0);

    if (axis === "z") {
      BOTH_AXIS.forEach((_axis) => {
        this.setDistanceBtwPositions(_axis, elmDirection, element);
      });
    } else {
      this.setDistanceBtwPositions(axis, elmDirection, element);
    }

    this.updateDraggable(axis, elmDirection, element);
  }

  protected updateDraggedThresholdPosition(x: number, y: number) {
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

  private addDraggedOffsetToElm(
    position: AxesPoint,
    elm: DFlexElement,
    axis: Axis
  ) {
    const rectType = DFlexElement.getRectByAxis(axis);

    const { draggedElm } = this.draggable;

    // This initiation needs to append dragged rect based on targeted axis.
    position[axis] += draggedElm.rect[rectType];

    const rectDiff = elm.rect[rectType] - draggedElm.rect[rectType];

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

        this.addDraggedOffsetToElm(composedTranslate, elm!, axis);
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
      composedTranslate.y
    );

    return { translate: composedTranslate, grid: composedGrid };
  }

  protected getComposedOccupiedPosition(
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

    this.addDraggedOffsetToElm(composedPosition, elm!, axis);

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
    siblings: Siblings,
    cycleID: string,
    isIncrease: boolean
  ) {
    const { draggedElm, occupiedPosition, gridPlaceholder } = this.draggable;

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

    this.updateIndicators(axis, elmDirection, element);

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
      DFLEX_EVENTS.ON_DRAG_OVER,
      composeElmMeta(element)
    );

    element.reconcilePosition(
      axis,
      elmDirection,
      DOM,
      siblings,
      this.elmTransition,
      cycleID
    );

    this.draggable.events.dispatch(
      DFLEX_EVENTS.ON_DRAG_LEAVE,
      composeElmMeta(element)
    );
  }
}

export default DFlexPositionUpdater;
