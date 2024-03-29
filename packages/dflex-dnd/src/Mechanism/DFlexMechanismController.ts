import {
  AxesPoint,
  Axis,
  DFlexCreateRAF,
  DFlexCreateTimeout,
  featureFlags,
  getOppositeAxis,
  PointNum,
  PREFIX_TRACKER_CYCLE,
  Threshold,
  ThresholdDeadZone,
  TimeoutFunction,
  tracker,
} from "@dflex/utils";

import { scheduler, store } from "../LayoutManager";

import { emitSiblingsEvent, emitDragMovedEvent, DFLEX_EVENTS } from "../Events";

import DraggableInteractive from "../Draggable";

import {
  APPEND_EMPTY_ELM_ID,
  handleElmMigration,
  isEmptyBranch,
} from "./DFlexPositionUpdater";

import DFlexScrollableElement from "./DFlexScrollableElement";

const {
  DRAG_EVENT: {
    ON_OUT_CONTAINER,
    ON_OUT_THRESHOLD,
    ON_ENTER_CONTAINER,
    ON_ENTER_THRESHOLD,
  },
  SIBLINGS_EVENT: { ON_LIFT_UP, ON_MOVE_DOWN },
} = DFLEX_EVENTS;

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
  private _RAF: ReturnType<typeof DFlexCreateRAF>;

  private _detectNearestContainerThrottle: TimeoutFunction;

  protected hasBeenScrolling: boolean;

  private _listAppendPosition: AxesPoint | null;

  /**
   * Used to manage the stabilizing zone that prevents the dragged element from getting stuck
   * between two intersected thresholds.
   */
  private _thresholdDeadZone: ThresholdDeadZone;

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

    this.hasBeenScrolling = false;

    this._RAF = DFlexCreateRAF();
    [this._detectNearestContainerThrottle] = DFlexCreateTimeout(0);

    this._listAppendPosition = null;

    this._thresholdDeadZone = new ThresholdDeadZone();

    if (__DEV__) {
      Object.seal(this);
    }
  }

  private _detectDroppableIndex(): number | null {
    let droppableIndex = null;

    const { draggedElm } = this.draggable;

    const { SK } = store.migration.latest();

    const siblings = store.getElmSiblingsByKey(SK);

    for (let i = 0; i < siblings.length; i += 1) {
      const id = siblings[i];

      if (isIDEligible(id, draggedElm.id)) {
        const element = store.registry.get(id)!;

        const isQualified = element.rect.isBoxIntersect(
          this.draggable.positions.getPos(true),
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
    const { draggedElm, occupiedTranslate, gridPlaceholder } = this.draggable;
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
        this.updateDraggedThresholdPosition(
          lastElmPosition.x,
          lastElmPosition.y,
        );
      }

      insertAt = siblings.length - 1;

      hasToMoveSiblingsDown = false;
    }

    this.draggable.setDraggedTempIndex(insertAt);

    this._updateContainerLockState(false);

    let draggedTransition: AxesPoint;
    let draggedGrid: PointNum;

    if (migration.isTransitioning) {
      ({ translate: draggedTransition, grid: draggedGrid } =
        this.getComposedOccupiedTranslateAndGrid(
          SK,
          insertAt,
          hasToMoveSiblingsDown,
          "y",
        ));
    }

    // If it has solo empty id then there's no need to move down. Because it's
    // empty branch.
    if (hasToMoveSiblingsDown && !isEmpty) {
      this._moveDown(insertAt);
    }

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
          if (!this.draggable.enableCommit.enableAfterEndingDrag) {
            if (__DEV__) {
              // eslint-disable-next-line no-console
              console.warn(
                "Override enable commit to true. Transformation into empty container is not enabled yet.",
              );
            }

            this.draggable.enableCommit.enableAfterEndingDrag = true;
          }
        }

        this._listAppendPosition = null;

        migration.complete();
      });
    }
  }

  private _detectNearestContainer(): void {
    const { draggedElm } = this.draggable;
    const { migration } = store;

    const { depth } = draggedElm;

    let newSK;

    const depthKey = Threshold.depthKey(depth);

    const isOutInsertionArea = this.draggable.isOutThreshold(depthKey);

    if (isOutInsertionArea) {
      return;
    }

    const dp = store.getSiblingKeysByDepth(depth);

    const { SK: originSK } = migration.latest();

    for (let i = 0; i < dp.length; i += 1) {
      newSK = dp[i];

      // Check if it is not the same list and if the dragged is inside new one.
      if (newSK !== originSK && !this.draggable.isOutThreshold(newSK, true)) {
        migration.start();

        const destinationSiblings = store.getElmSiblingsByKey(newSK);
        const destinationContainer = store.containers.get(newSK)!;

        // TODO: This should be dynamic not hardcoded.
        const insertionAxis: Axis = "y";

        this._listAppendPosition = this.getComposedOccupiedPosition(
          newSK,
          insertionAxis,
        );

        const originSiblings = store.getElmSiblingsByKey(originSK);
        const originContainer = store.containers.get(originSK)!;

        // Remove the last element from the original list.
        // when the dragged is out of the container, the last element is the
        // placeholder as all the elements are stacked.
        originSiblings.pop();
        originContainer.reduceGrid(insertionAxis);

        this.draggable.occupiedPosition.clone(this._listAppendPosition!);

        this.draggable.gridPlaceholder.setAxes(1, 1);

        draggedElm.keys.SK = newSK;

        // Insert the element to the new list. Empty string because when dragged
        // is out the branch sets its index as "".
        destinationSiblings.push(APPEND_EMPTY_ELM_ID);
        destinationContainer.extendGrid(insertionAxis);

        const cycleID = tracker.newTravel(PREFIX_TRACKER_CYCLE);

        this.draggable.session.push(cycleID);

        migration.add(
          NaN,
          draggedElm.id,
          newSK,
          true,
          cycleID,
          store.scrolls.get(newSK)!.hasOverflow.isOneTruthy(),
        );

        break;
      }
    }
  }

  /**
   * Filling the space when the head of the list is leaving the list.
   */
  private _fillHeadUp(): void {
    const { occupiedPosition, draggedElm, events } = this.draggable;
    const { migration } = store;

    const { SK, index } = migration.latest();

    const siblings = store.getElmSiblingsByKey(SK);

    const from = index + 1;

    if (index > 0) {
      const prevElm = store.registry.get(
        siblings[migration.latest().index - 1],
      )!;

      // Store it before lost it when the index is changed to the next one.
      migration.preserveVerticalMargin(
        "top",
        occupiedPosition.y - prevElm.rect.bottom,
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
          `_fillHeadUp: Error in calculating next element.\n Siblings: ${siblings}\n Calculated index: ${from}`,
        );
      }

      return;
    }

    // Store it before lost it when the index is changed to the next one.
    migration.preserveVerticalMargin(
      "bottom",
      nextElm.rect.top - (occupiedPosition.y + draggedElm.rect.height),
    );

    if (events) {
      emitSiblingsEvent(events, ON_LIFT_UP, {
        drag: store.interactiveDOM.get(draggedElm.id)!,
        siblings,
        from: from - 1,
        to: siblings.length - 1,
      });
    }

    this.draggable.setDraggedTempIndex(
      DFlexMechanismController.INDEX_OUT_CONTAINER,
    );

    for (let i = from; i < siblings.length; i += 1) {
      /**
       * Don't update translate because it's not permanent. Releasing dragged
       * means undoing last position.
       */
      const id = siblings[i];

      if (isIDEligible(id, draggedElm.id)) {
        this.updateElement(id, 1, true, true);
      }
    }
  }

  /**
   *
   * @param to - index
   */
  private _moveDown(to: number): void {
    const { events, draggedElm } = this.draggable;
    const { migration } = store;

    const { SK } = migration.latest();

    const siblings = store.getElmSiblingsByKey(SK);

    const { length } = siblings;

    if (events) {
      emitSiblingsEvent(events, ON_MOVE_DOWN, {
        drag: store.interactiveDOM.get(draggedElm.id)!,
        siblings,
        from: to,
        to: length - 1,
      });
    }

    for (let i = length - 1; i >= to; i -= 1) {
      const id = siblings[i];

      if (isIDEligible(id, draggedElm.id)) {
        this.updateElement(id, 1, false, true);
      }
    }
  }

  private _actionCaller(
    axis: Axis,
    oppositeAxis: Axis,
    grid: PointNum,
    isSingleAxis: boolean,
    shouldDecrease: boolean,
  ): void {
    const { gridPlaceholder } = this.draggable;

    const newPos = shouldDecrease
      ? gridPlaceholder[axis] + 1
      : gridPlaceholder[axis] - 1;

    if (__DEV__) {
      if (newPos < -1) {
        throw new Error(
          "_actionCaller: the new grid position can't be below -1",
        );
      }

      if (featureFlags.enableMechanismDebugger) {
        // eslint-disable-next-line no-console
        console.log(
          `Detecting dragged new ${
            axis === "x" ? "col" : "row"
          }: ${newPos}. siblingsGrid-${axis} is ${grid[axis]}`,
        );
      }
    }

    // Leaving from top.
    if (newPos === -1) {
      // lock the parent
      this._updateContainerLockState(true);

      this._fillHeadUp();

      return;
    }

    // Leaving from bottom.
    if (newPos > grid[axis]) {
      // lock the parent
      this._updateContainerLockState(true);

      return;
    }

    // Switch elements if thresholds are intersected.
    const {
      draggedElm: { id: draggedID },
    } = this.draggable;

    const { SK, index } = store.migration.latest();

    const siblings = store.getElmSiblingsByKey(SK);

    let elmIndex: number;

    if (isSingleAxis) {
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

          throw new Error(
            `Unable to find the target element index for the occupied grid: ${JSON.stringify(
              grid,
            )}.\n` +
              `This error occurs when attempting to calculate the index of the target element in a non-single axis scenario.\n` +
              `Incorrect handling of 'isSingleAxis' can lead to issues in determining the target element index.`,
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
            siblings,
          )}`,
        );
      }

      return;
    }

    const elmThreshold = this.draggable.threshold.getElmMainThreshold(
      store.registry.get(id)!.rect,
    );
    const draggedThreshold = this.draggable.threshold.thresholds[draggedID];

    const isThresholdIntersected = elmThreshold.isBoxIntersect(
      this.draggable.threshold.thresholds[draggedID],
    );

    // TODO: `else` case is not tested.
    if (isThresholdIntersected) {
      // Create a stabilizing zone to prevent the dragged element from getting stuck
      // between two intersected thresholds. For example, if the element is moved into
      // a new area but still triggers the previous threshold due to being stuck
      // inside this zone, it can cause a jarring behavior with a back and forth
      // transition.

      const {
        positions,
        scroll: { enable },
      } = this.draggable;

      // Record the direction of movement on the specified axis.
      const movementDirection = positions.getMovementDirection(axis, enable);

      this._thresholdDeadZone.setZone(
        axis,
        movementDirection,
        elmThreshold,
        draggedThreshold,
      );

      this.draggable.setDraggedTempIndex(elmIndex);

      const numberOfPassedElm = Math.abs(index - elmIndex);

      if (__DEV__) {
        if (numberOfPassedElm < 0 || numberOfPassedElm >= siblings.length) {
          throw new Error(
            `_actionCaller: invalid numberOfPassedElm: ${numberOfPassedElm}`,
          );
        }
      }

      this.updateElement(id, numberOfPassedElm, shouldDecrease, false);
    } else {
      if (__DEV__) {
        if (featureFlags.enableMechanismDebugger) {
          // eslint-disable-next-line no-console
          console.warn(
            "Switching element in not possible because elements threshold are not intersected",
          );
        }
      }

      // lock the parent
      this._updateContainerLockState(true);

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
    } = this.draggable;

    const { grid } = store.containers.get(SK)!;

    // One column or one row?
    const oppositeAxis = getOppositeAxis(axis);

    const isSingleAxis = grid[oppositeAxis] === 0;

    if (__DEV__) {
      if (featureFlags.enableMechanismDebugger) {
        // eslint-disable-next-line no-console
        console.log(
          `Detecting that element has ${
            isSingleAxis ? "single" : "multiple"
          } axis ${axis}`,
        );
      }
    }

    // Check if top or bottom.
    if (isOut[id].isTruthyByAxis(axis)) {
      const shouldDecrease = axis === "y" ? isOut[id].bottom : isOut[id].right;

      const {
        positions,
        scroll: { enable },
      } = this.draggable;

      const currentMovementDir = positions.getMovementDirection(axis, enable);
      const draggedPos = positions.getPos(false);

      const isInsideDeadZone = this._thresholdDeadZone.isInside(
        axis,
        currentMovementDir,
        draggedPos,
      );

      // Ignore if draggable inside dead zone with the same movement direction.
      if (isInsideDeadZone) {
        if (__DEV__) {
          if (featureFlags.enableMechanismDebugger) {
            // eslint-disable-next-line no-console
            console.log(
              `Threshold trigger ignored: Dragged element is inside the dead zone.`,
            );
          }
        }

        return true;
      }

      this._actionCaller(
        axis,
        oppositeAxis,
        grid,
        isSingleAxis,
        shouldDecrease,
      );

      return true;
    }

    if (isSingleAxis) {
      // lock the parent
      this._updateContainerLockState(true);

      this._fillHeadUp();

      return true;
    }

    return false;
  }

  /**
   * Updates the lock state of the parent container based on whether the dragged element
   * is out of it. Additionally, it clears the threshold dead zone.
   *
   * @param isOut - A boolean indicating if the dragged element is out of its
   * parent container.
   */
  private _updateContainerLockState(isOut: boolean): void {
    if (__DEV__) {
      if (featureFlags.enableMechanismDebugger) {
        // eslint-disable-next-line no-console
        console.log(`_lockParent: ${isOut}.`);
      }
    }

    if (isOut === this.isParentLocked) {
      if (__DEV__) {
        throw new Error(
          `Invalid lock state. Parent is already ${
            isOut ? "unlocked" : "locked"
          }.`,
        );
      }

      return;
    }

    const { draggedElm, events } = this.draggable;

    if (events) {
      const { id } = draggedElm;

      const element = store.interactiveDOM.get(id)!;

      emitDragMovedEvent(
        events,
        isOut ? ON_OUT_CONTAINER : ON_ENTER_CONTAINER,
        {
          id,
          element,
          index: store.migration.latest().index,
        },
      );
    }

    this.isParentLocked = isOut;
    this._thresholdDeadZone.clear();
  }

  /**
   * Updates the lock state based on whether the dragged element exceeds a
   * specified threshold.
   *
   * @param isOut - A boolean indicating if the dragged element has
   * exceeded the threshold.
   */
  private _updateThresholdLockState(isOut: boolean): void {
    if (__DEV__) {
      if (featureFlags.enableMechanismDebugger) {
        // eslint-disable-next-line no-console
        console.log(`_updateThresholdLockState: ${isOut}.`);
      }
    }

    if (isOut === this.isOutsideThreshold) {
      if (__DEV__) {
        throw new Error(
          `Invalid lock state. Threshold is already ${
            isOut ? "out" : "within"
          } limits.`,
        );
      }

      return;
    }

    const { draggedElm, events } = this.draggable;

    if (events) {
      const { id } = draggedElm;
      const { migration } = store;

      const element = store.interactiveDOM.get(id)!;

      emitDragMovedEvent(
        events,
        isOut ? ON_OUT_THRESHOLD : ON_ENTER_THRESHOLD,
        {
          id,
          element,
          index: migration.latest().index,
        },
      );
    }

    this.isOutsideThreshold = isOut;
  }

  private _dragOutThreshold(): void {
    if (!this.isOutsideThreshold) {
      this._updateThresholdLockState(true);
    }

    // Guessing what axis the exit happened.
    const isTriggered = this._actionByAxis("y");

    if (isTriggered) {
      return;
    }

    this._actionByAxis("x");
  }

  private _dragOutContainer(): void {
    const { containersTransition } = this.draggable;

    const { migration } = store;

    if (!this.isParentLocked) {
      this._updateContainerLockState(true);
    }

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
    }
  }

  private _dragInsideContainer(): void {
    const [RAF, , isCompleted] = this._RAF;

    if (isCompleted()) {
      RAF(() => {
        this._detectNearestElm();
      }, false);
    }
  }

  private _postScrollDragHandler(SK: string, x: number, y: number): void {
    const isOutSiblingsContainer = this.draggable.isOutThreshold(SK);

    if (!isOutSiblingsContainer && this.isParentLocked) {
      const [scrollOffsetX, scrollOffsetY] = this._calculateScrollOffsets(SK);

      // Update the position before calling the detector.
      this.draggable.positions.setPos(x, y, scrollOffsetX, scrollOffsetY);
      this._detectNearestElm();
    }

    this.hasBeenScrolling = false;
  }

  private _calculateScrollOffsets(SK: string): [number, number] {
    const {
      totalScrollRect: { left, top },
    } = store.scrolls.get(SK)!;

    const { x, y } = this.initialScrollPosition;

    const scrollOffsetX = left - x;
    const scrollOffsetY = top - y;

    return [scrollOffsetX, scrollOffsetY];
  }

  private _processScroll(x: number, y: number, SK: string): boolean {
    let isOutSiblingsContainer = false;

    const {
      scroll: { enable },
    } = this.draggable;

    // If scrolling is disable, do nothing.
    if (!enable) {
      return false;
    }

    const [container, scroll] = store.getContainers(SK)!;

    const rect = container.getBoundaries();

    const isInside = rect.isInsideThreshold(scroll.visibleScrollRect);

    // If rect is entirely visible, do nothing.
    if (isInside) {
      if (this.hasBeenScrolling) {
        this._postScrollDragHandler(SK, x, y);

        return true;
      }

      return false;
    }

    this.scrollFeed(x, y, SK);

    if (this.hasActiveScrolling()) {
      if (!this.hasBeenScrolling) {
        scheduler(store, null, {
          onUpdate: () => {
            isOutSiblingsContainer = this.draggable.isOutThreshold(SK);

            // When it's inside the container, then the siblings are not lifted
            if (!(isOutSiblingsContainer || this.isParentLocked)) {
              this._updateContainerLockState(true);
              this._fillHeadUp();
            }
          },
        });

        this.hasBeenScrolling = true;
      }

      return true;
    }

    if (this.hasBeenScrolling) {
      this._postScrollDragHandler(SK, x, y);

      return true;
    }

    return false;
  }

  dragAt(x: number, y: number): void {
    if (!store.isLayoutAvailable) {
      return;
    }

    const { migration } = store;

    const { SK } = migration.latest();

    let isOutSiblingsContainer = false;

    const isHandledByScroll = this._processScroll(x, y, SK);

    if (isHandledByScroll) {
      return;
    }

    const [scrollOffsetX, scrollOffsetY] = this._calculateScrollOffsets(SK);

    this.draggable.dragWithOffset(x, y, scrollOffsetX, scrollOffsetY);

    if (migration.isTransitioning) {
      return;
    }

    if (this.draggable.isOutThreshold()) {
      if (!this.isParentLocked) {
        this._dragOutThreshold();

        return;
      }

      isOutSiblingsContainer = this.draggable.isOutThreshold(SK);

      // When it's out but still inside its container.
      if (!isOutSiblingsContainer) {
        this._dragInsideContainer();

        return;
      }

      this._dragOutContainer();

      return;
    }

    /**
     * When dragged is out parent and returning to it.
     */
    if (this.isParentLocked) {
      isOutSiblingsContainer = this.draggable.isOutThreshold(SK);

      if (isOutSiblingsContainer) {
        return;
      }

      this._dragInsideContainer();

      return;
    }

    // Still inside the threshold.
    if (this.isOutsideThreshold) {
      this._updateThresholdLockState(false);
    }
  }
}

export default DFlexMechanismController;
