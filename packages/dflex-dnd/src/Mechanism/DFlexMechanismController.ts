import {
  AxesPoint,
  Axis,
  BoxNum,
  createTimeout,
  featureFlags,
  PointNum,
  PREFIX_CYCLE,
  TimeoutFunction,
} from "@dflex/utils";

import { DFLEX_EVENTS, scheduler, store } from "../LayoutManager";
import type DraggableInteractive from "../Draggable";

import {
  APPEND_EMPTY_ELM_ID,
  handleElmMigration,
  isEmptyBranch,
} from "./DFlexPositionUpdater";
import DFlexScrollableElement from "./DFlexScrollableElement";

export function isIDEligible(elmID: string, draggedID: string): boolean {
  const { registry } = store;

  if (__DEV__) {
    if (typeof elmID !== "string") {
      throw new Error(`isIDEligible: elmID is not defined: ${elmID}`);
    }
  }

  return (
    elmID.length > 0 &&
    elmID !== draggedID &&
    registry.has(elmID) &&
    !registry.get(elmID)!.readonly
  );
}

class DFlexMechanismController extends DFlexScrollableElement {
  private isOnDragOutThresholdEvtEmitted: boolean;

  /** This is only related to insert method as the each element has it's own for
   * transformation. */
  private _animatedDraggedInsertionFrame: number | null;

  private _detectNearestContainerThrottle: TimeoutFunction;

  protected _hasBeenScrolling: boolean;

  private _listAppendPosition: AxesPoint | null;

  private _deadZoneStabilizer: {
    area: BoxNum;
    direction: Record<Axis, string>;
  };

  static INDEX_OUT_CONTAINER = NaN;

  /**
   * Gets the last valid element from the list which sometime can be empty
   * string if there's appending transition.
   * ["valid-id", ""] => "valid-id"
   * ["valid-id"] => "valid-id"
   */
  static getTheLastValidElm(lst: string[], draggedID: string) {
    for (let i = lst.length - 1; i >= 0; i -= 1) {
      const id = lst[i];
      if (isIDEligible(id, draggedID)) {
        return store.registry.get(id)!;
      }
    }

    throw new Error(`No valid element found.${lst}\n`);
  }

  constructor(draggable: DraggableInteractive) {
    super(draggable);

    this._hasBeenScrolling = false;
    this.isOnDragOutThresholdEvtEmitted = false;
    this._animatedDraggedInsertionFrame = null;
    [this._detectNearestContainerThrottle] = createTimeout(0);
    this._listAppendPosition = null;
    this._isParentLocked = false;

    this._deadZoneStabilizer = {
      area: new BoxNum(0, 0, 0, 0),
      direction: { x: "", y: "" },
    };

    if (__DEV__) {
      Object.seal(this);
    }
  }

  private _detectDroppableIndex(): number | null {
    let droppableIndex = null;

    const { draggedElm } = this._draggable;

    const { SK } = store.migration.latest();

    const siblings = store.getElmSiblingsByKey(SK);

    for (let i = 0; i < siblings.length; i += 1) {
      const id = siblings[i];

      if (isIDEligible(id, draggedElm.id)) {
        const element = store.registry.get(id)!;

        const isQualified = element.rect.isBoxIntersect(
          this._draggable.getAbsoluteCurrentPos()
        );

        if (isQualified) {
          droppableIndex = i;

          break;
        }
      }
    }

    return droppableIndex;
  }

  private _detectNearestElm(): void {
    const { draggedElm, occupiedTranslate, gridPlaceholder } = this._draggable;
    const { migration } = store;

    const { SK } = migration.latest();

    const siblings = store.getElmSiblingsByKey(SK);
    const container = store.containers.get(SK)!;

    /**
     * If tempIndex is zero, the dragged is coming from the top. So, move them
     * down all: to=0
     */
    let hasToMoveSiblingsDown = true;

    const isEmpty = isEmptyBranch(siblings);

    let insertAt = isEmpty ? 0 : this._detectDroppableIndex();

    // Enforce attaching it from the bottom since it's already inside the container.
    if (typeof insertAt !== "number") {
      // Restore the last element position from the bottom.
      const { lastElmPosition } = container;
      if (!migration.isTransitioning && lastElmPosition) {
        this._updateDraggedThresholdPosition(
          lastElmPosition.x,
          lastElmPosition.y
        );
      }

      insertAt = siblings.length - 1;

      hasToMoveSiblingsDown = false;
    }

    this._draggable.setDraggedTempIndex(insertAt);

    this._lockParent(false);

    let draggedTransition: AxesPoint;
    let draggedGrid: PointNum;

    if (migration.isTransitioning) {
      ({ translate: draggedTransition, grid: draggedGrid } =
        this._getComposedOccupiedTranslateAndGrid(
          SK,
          insertAt,
          hasToMoveSiblingsDown,
          "y"
        ));
    }

    // If it has solo empty id then there's no need to move down. Because it's
    // empty branch.
    if (hasToMoveSiblingsDown && !isEmpty) {
      this._moveDown(insertAt);
    }

    draggedElm.removeAttribute(this._draggable.draggedDOM, "OUT_CONTAINER");

    // Clear it since it's used for insertion calculation.
    migration.clearMargin();

    if (migration.isTransitioning) {
      // Compose container boundaries and refresh the store.
      queueMicrotask(() => {
        const { x, y } = this._listAppendPosition!;

        // offset to append.
        // It has to be the biggest element offset. The last element in the list.
        const offset = {
          top: y,
          right: x + draggedElm.rect.width,
          bottom: y + draggedElm.rect.height,
          left: x,
        };

        occupiedTranslate.clone(draggedTransition);
        gridPlaceholder.clone(draggedGrid);

        let DOMGrid = draggedGrid;

        const lastElm = store.registry.get(siblings[siblings.length - 1])!;

        if (lastElm) {
          ({ DOMGrid } = lastElm);

          if (DOMGrid.y < draggedGrid.y) {
            DOMGrid = draggedGrid;
          }
        }

        handleElmMigration(SK, migration.prev().SK, offset);

        if (x === 0 && y === 0) {
          if (!this._draggable.enableCommit.enableAfterEndingDrag) {
            if (__DEV__) {
              // eslint-disable-next-line no-console
              console.warn(
                "Override enable commit to true. Transformation into empty container is not enabled yet."
              );
            }

            this._draggable.enableCommit.enableAfterEndingDrag = true;
          }
        }

        this._listAppendPosition = null;

        migration.complete();
      });
    }
  }

  private _detectNearestContainer(): void {
    const { draggedElm } = this._draggable;
    const { migration } = store;

    const { depth } = draggedElm;

    let newSK;

    const isOutInsertionArea = this._draggable.isOutThreshold(`${depth}`);

    if (isOutInsertionArea) {
      return;
    }

    const dp = store.getSiblingKeysByDepth(depth);

    const { SK: originSK } = migration.latest();

    for (let i = 0; i < dp.length; i += 1) {
      newSK = dp[i];

      // Check if it is not the same list and if the dragged is inside new one.
      if (newSK !== originSK && !this._draggable.isOutThreshold(newSK, true)) {
        migration.start();

        const destinationSiblings = store.getElmSiblingsByKey(newSK);
        const destinationContainer = store.containers.get(newSK)!;

        // TODO: This should be dynamic not hardcoded.
        const insertionAxis: Axis = "y";

        this._listAppendPosition = this._getComposedOccupiedPosition(
          newSK,
          insertionAxis
        );

        const originSiblings = store.getElmSiblingsByKey(originSK);
        const originContainer = store.containers.get(originSK)!;

        // Remove the last element from the original list.
        // when the dragged is out of the container, the last element is the
        // placeholder as all the elements are stacked.
        originSiblings.pop();
        originContainer._reduceGrid(insertionAxis);

        this._draggable.occupiedPosition.clone(this._listAppendPosition!);

        this._draggable.gridPlaceholder.setAxes(1, 1);

        draggedElm.keys.SK = newSK;

        // Insert the element to the new list. Empty string because when dragged
        // is out the branch sets its index as "".
        destinationSiblings.push(APPEND_EMPTY_ELM_ID);
        destinationContainer._extendGrid(insertionAxis);

        const cycleID = store.tracker.newTravel(PREFIX_CYCLE);

        this._draggable.session.push(cycleID);

        migration.add(
          NaN,
          draggedElm.id,
          newSK,
          cycleID,
          store.scrolls.get(newSK)!.hasOverflow.isOneTruthy()
        );

        break;
      }
    }
  }

  /**
   * Filling the space when the head of the list is leaving the list.
   */
  private _fillHeadUp(): void {
    const { occupiedPosition, draggedElm, events } = this._draggable;
    const { migration } = store;

    const { SK, index } = migration.latest();

    const siblings = store.getElmSiblingsByKey(SK);

    const from = index + 1;

    if (index > 0) {
      const prevElm = store.registry.get(
        siblings[migration.latest().index - 1]
      )!;

      // Store it before lost it when the index is changed to the next one.
      migration.preserveVerticalMargin(
        "top",
        occupiedPosition.y - prevElm.rect.bottom
      );
    }

    if (from === siblings.length) {
      return;
    }

    if (__DEV__) {
      if (featureFlags.enableMechanismDebugger) {
        // eslint-disable-next-line no-console
        console.log(`_fillHeadUp from: ${from}`);
      }
    }

    const nextElm = store.registry.get(siblings[from]);

    if (!nextElm) {
      if (__DEV__) {
        throw new Error(
          `_fillHeadUp: Error in calculating next element.\n Siblings: ${siblings}\n Calculated index: ${from}`
        );
      }

      return;
    }

    // Store it before lost it when the index is changed to the next one.
    migration.preserveVerticalMargin(
      "bottom",
      nextElm.rect.top - (occupiedPosition.y + draggedElm.rect.height)
    );

    events.dispatch(DFLEX_EVENTS.ON_LIFT_UP, {
      siblings,
      from,
      to: siblings.length,
    });

    this._draggable.setDraggedTempIndex(
      DFlexMechanismController.INDEX_OUT_CONTAINER
    );

    for (let i = from; i < siblings.length; i += 1) {
      /**
       * Don't update translate because it's not permanent. Releasing dragged
       * means undoing last position.
       */
      const id = siblings[i];

      if (isIDEligible(id, draggedElm.id)) {
        this._updateElement(id, 1, true);
      }
    }
  }

  /**
   *
   * @param to - index
   */
  private _moveDown(to: number): void {
    const { events, draggedElm } = this._draggable;
    const { migration } = store;

    const { SK } = migration.latest();

    const siblings = store.getElmSiblingsByKey(SK);

    events.dispatch(DFLEX_EVENTS.ON_MOVE_DOWN, {
      siblings,
      from: siblings!.length - 1,
      to: siblings.length,
    });

    for (let i = siblings.length - 1; i >= to; i -= 1) {
      const id = siblings[i];

      if (isIDEligible(id, draggedElm.id)) {
        this._updateElement(id, 1, false);
      }
    }
  }

  private _actionCaller(
    axis: Axis,
    oppositeAxis: Axis,
    grid: PointNum,
    isMonoGrid: boolean,
    shouldDecrease: boolean
  ): void {
    const { gridPlaceholder } = this._draggable;

    const newPos = shouldDecrease
      ? gridPlaceholder[axis] + 1
      : gridPlaceholder[axis] - 1;

    if (__DEV__) {
      if (newPos < -1) {
        throw new Error(
          "_actionCaller: the new grid position can't be below -1"
        );
      }

      if (featureFlags.enableMechanismDebugger) {
        // eslint-disable-next-line no-console
        console.log(
          `Detecting dragged new ${
            axis === "x" ? "col" : "row"
          }: ${newPos}. siblingsGrid-${axis} is ${grid[axis]}`
        );
      }
    }

    // Leaving from top.
    if (newPos === -1) {
      // lock the parent
      this._lockParent(true);

      this._fillHeadUp();

      return;
    }

    // Leaving from bottom.
    if (newPos > grid[axis]) {
      // lock the parent
      this._lockParent(true);

      return;
    }

    // Switch elements if thresholds are intersected.
    const {
      draggedElm: { id: draggedID },
    } = this._draggable;

    const { SK, index } = store.migration.latest();

    const siblings = store.getElmSiblingsByKey(SK);

    let elmIndex: number;

    if (isMonoGrid) {
      elmIndex = index + (shouldDecrease ? 1 : -1);
    } else {
      const occupiedGrid = {
        x: 0,
        y: 0,
      };

      occupiedGrid[axis] = newPos;
      occupiedGrid[oppositeAxis] = gridPlaceholder[oppositeAxis];

      elmIndex = siblings.findIndex((id) => {
        if (isIDEligible(id, draggedID)) {
          const elm = store.registry.get(id)!;

          const is = elm.DOMGrid.isInstanceEqual(occupiedGrid);

          return is;
        }

        return false;
      });

      if (elmIndex === -1) {
        if (__DEV__) {
          if (draggedID.includes("dflex-draggable-mirror")) {
            return;
          }

          // eslint-disable-next-line no-console
          console.warn(
            `_actionCaller: unable to find targeted element index for: ${JSON.stringify(
              occupiedGrid
            )}`
          );
        }

        return;
      }
    }

    const id = siblings[elmIndex];

    if (__DEV__) {
      if (featureFlags.enableMechanismDebugger) {
        // eslint-disable-next-line no-console
        console.log(`Switching element position to occupy: ${id}`);
      }
    }

    if (!(id && isIDEligible(id, draggedID))) {
      if (__DEV__) {
        // TODO: investigate this error here and why it happens when migrated between containers.
        // eslint-disable-next-line no-console
        console.warn(
          `_actionCaller: incorrect element index: ${elmIndex} for siblings: ${JSON.stringify(
            siblings
          )}`
        );
      }

      return;
    }

    const elmThreshold = this._draggable.threshold.getElmMainThreshold(
      store.registry.get(id)!.rect
    );

    const isIntersect = elmThreshold.isBoxIntersect(
      this._draggable.threshold.thresholds[draggedID]
    );

    // TODO: `else` case is not tested.
    if (isIntersect) {
      // Create stabilizing zone to prevent dragged from being stuck between two
      // intersected thresholds.
      // E.g: Moved into new one but triggered the previous one because it's stuck
      // inside the zone causing jarring behavior; the back and forth transition.
      const surroundingBox = elmThreshold.getSurroundingBox(
        this._draggable.threshold.thresholds[draggedID]
      );

      this._deadZoneStabilizer.area.clone(surroundingBox);
      this._deadZoneStabilizer.direction[axis] =
        this._draggable.getDirectionByAxis(axis);

      this._draggable.setDraggedTempIndex(elmIndex);
      const numberOfPassedElm = Math.abs(index - elmIndex);

      if (__DEV__) {
        if (numberOfPassedElm < 0 || numberOfPassedElm >= siblings.length) {
          throw new Error(
            `_actionCaller: invalid numberOfPassedElm: ${numberOfPassedElm}`
          );
        }
      }

      this._updateElement(id, numberOfPassedElm, shouldDecrease);
    } else {
      if (__DEV__) {
        if (featureFlags.enableMechanismDebugger) {
          // eslint-disable-next-line no-console
          console.warn(
            "Switching element in not possible because elements threshold are not intersected"
          );
        }
      }

      // lock the parent
      this._lockParent(true);

      this._fillHeadUp();
    }
  }

  private _actionByAxis(axis: Axis): boolean {
    const {
      draggedElm: {
        id,
        keys: { SK },
      },
      threshold: { isOut },
    } = this._draggable;

    const { _grid: grid } = store.containers.get(SK)!;

    // One column or one row?
    const oppositeAxis = axis === "y" ? "x" : "y";

    const isMonoGrid = grid[oppositeAxis] === 0;

    // Check if top or bottom.
    if (isOut[id].isTruthyByAxis(axis)) {
      const shouldDecrease = axis === "y" ? isOut[id].bottom : isOut[id].right;

      const isInsideDeadZone = this._draggable
        .getAbsoluteCurrentPos()
        .isInsideThreshold(this._deadZoneStabilizer.area);

      if (isInsideDeadZone) {
        const currentDir = this._draggable.getDirectionByAxis(axis);

        const withTheSameDir =
          currentDir === this._deadZoneStabilizer.direction[axis];

        // Ignore if draggable inside dead zone with the same direction.
        if (withTheSameDir) {
          return true;
        }
      }

      this._actionCaller(axis, oppositeAxis, grid, isMonoGrid, shouldDecrease);

      return true;
    }

    if (isMonoGrid) {
      // lock the parent
      this._lockParent(true);

      this._fillHeadUp();

      return true;
    }

    return false;
  }

  // Guessing what axis the exit happened.
  private _draggedOutPositionNotifier(): void {
    const isTriggered = this._actionByAxis("y");

    if (isTriggered) {
      return;
    }

    this._actionByAxis("x");
  }

  private _lockParent(isOut: boolean) {
    if (__DEV__) {
      if (featureFlags.enableMechanismDebugger) {
        // eslint-disable-next-line no-console
        console.log(`_lockParent: ${isOut}.`);
      }
    }

    this._isParentLocked = isOut;
  }

  dragAt(x: number, y: number) {
    if (!store.isLayoutAvailable) {
      return;
    }

    const { draggedElm, draggedDOM, containersTransition, scroll, events } =
      this._draggable;

    const { migration } = store;

    const { SK } = migration.latest();

    let isOutSiblingsContainer = false;

    let scrollOffsetX = 0;
    let scrollOffsetY = 0;

    if (scroll.enable) {
      this._scrollFeed(x, y, SK);

      if (this.hasActiveScrolling()) {
        if (!this._hasBeenScrolling) {
          scheduler(store, null, {
            onUpdate: () => {
              isOutSiblingsContainer = this._draggable.isOutThreshold(SK);

              // When it's inside the container, then the siblings are not lifted
              if (!(isOutSiblingsContainer || this._isParentLocked)) {
                this._lockParent(true);

                this._fillHeadUp();
              }
            },
          });

          this._hasBeenScrolling = true;
        }

        return;
      }

      const { totalScrollRect } = store.scrolls.get(SK)!;

      if (this._hasBeenScrolling) {
        isOutSiblingsContainer = this._draggable.isOutThreshold(SK);

        if (!isOutSiblingsContainer && this._isParentLocked) {
          scrollOffsetX = totalScrollRect.left - this._initialScrollPosition.x;
          scrollOffsetY = totalScrollRect.top - this._initialScrollPosition.y;

          // Update the position before calling the detector.
          this._draggable.setCurrentPos(x, y, scrollOffsetX, scrollOffsetY);

          this._detectNearestElm();
        }

        this._hasBeenScrolling = false;

        return;
      }
    }

    const { totalScrollRect } = store.scrolls.get(SK)!;

    scrollOffsetX = totalScrollRect.left - this._initialScrollPosition.x;
    scrollOffsetY = totalScrollRect.top - this._initialScrollPosition.y;

    this._draggable.dragWithOffset(x, y, scrollOffsetX, scrollOffsetY);

    if (migration.isTransitioning) {
      return;
    }

    if (this._draggable.isOutThreshold()) {
      events.dispatch(DFLEX_EVENTS.ON_OUT_THRESHOLD, {
        id: draggedElm.id,
        index: store.migration.latest().index,
      });

      if (!this._isParentLocked) {
        draggedElm.setAttribute(draggedDOM, "OUT_POS", "true");

        this._draggedOutPositionNotifier();

        return;
      }

      draggedElm.removeAttribute(draggedDOM, "OUT_POS");

      isOutSiblingsContainer = this._draggable.isOutThreshold(SK);

      // When it's out but still inside its container.
      if (!isOutSiblingsContainer) {
        if (this._animatedDraggedInsertionFrame === null) {
          this._animatedDraggedInsertionFrame = requestAnimationFrame(() => {
            this._detectNearestElm();

            this._animatedDraggedInsertionFrame = null;
          });
        }

        return;
      }

      draggedElm.setAttribute(draggedDOM, "OUT_CONTAINER", "true");

      events.dispatch(DFLEX_EVENTS.ON_OUT_CONTAINER, {
        id: draggedElm.id,
        index: store.migration.latest().index,
      });

      this._isParentLocked = true;

      if (containersTransition.enable) {
        const cb = () => {
          this._detectNearestContainer();

          if (migration.isTransitioning) {
            scheduler(store, null, {
              onUpdate: () => {
                this._detectNearestElm();
              },
            });
          }
        };

        this._detectNearestContainerThrottle(cb, true);

        return;
      }

      return;
    }

    if (this.isOnDragOutThresholdEvtEmitted) {
      this.isOnDragOutThresholdEvtEmitted = false;
    }

    /**
     * When dragged is out parent and returning to it.
     */
    if (this._isParentLocked) {
      isOutSiblingsContainer = this._draggable.isOutThreshold(SK);

      if (isOutSiblingsContainer) {
        return;
      }

      if (this._animatedDraggedInsertionFrame === null) {
        this._animatedDraggedInsertionFrame = requestAnimationFrame(() => {
          this._detectNearestElm();

          this._animatedDraggedInsertionFrame = null;
        });
      }
    }
  }
}

export default DFlexMechanismController;
