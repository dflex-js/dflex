import { IPointAxes, PointNum } from "@dflex/utils";
import type { IPointNum } from "@dflex/utils";

import { INode } from "@dflex/core-instance";
import type { DraggedEvent, SiblingsEvent } from "../types";

import store from "../DnDStore";

import type { IDraggableInteractive } from "../Draggable";
import DistanceCalculator from "./DistanceCalculator";

function emitSiblingsEvent(
  type: SiblingsEvent["type"],
  payload: Omit<SiblingsEvent, "type" | "timeStamp">
) {
  const evt: SiblingsEvent = {
    ...payload,
    timeStamp: Date.now(),
    type,
  };

  store.emitEvent(evt);
}

export function isIDEligible(
  destinationElmID: string,
  currentDraggedID: string
) {
  return (
    destinationElmID &&
    destinationElmID.length > 0 &&
    destinationElmID !== currentDraggedID &&
    store.registry[destinationElmID] &&
    store.registry[destinationElmID].ref !== null
  );
}

function isIDEligible2Move(
  destinationElmID: string,
  currentDraggedID: string,
  isScrollEnabled: boolean
) {
  if (!isIDEligible(destinationElmID, currentDraggedID)) {
    return false;
  }

  // Won't trigger any resume if auto-scroll is disabled.
  if (store.registry[destinationElmID].isPaused) {
    if (isScrollEnabled) {
      const { SK } = store.registry[currentDraggedID].keys;

      const { scrollX, scrollY } = store.containers[SK].scroll;

      store.registry[destinationElmID].resume(scrollX, scrollY);

      return true;
    }

    return false;
  }

  return true;
}

/**
 * Class includes all transformation methods related to droppable.
 */
class Droppable extends DistanceCalculator {
  #scrollAnimatedFrame: number | null;

  readonly #initialScroll: IPointNum;

  readonly #scrollAxes: IPointNum;

  #scrollSpeed: number;

  #regularDragging: boolean;

  #isOnDragOutContainerEvtEmitted: boolean;

  #isOnDragOutThresholdEvtEmitted: boolean;

  /** This is only related to insert method as the each element has it's own for
   * transformation. */
  #animatedDraggedInsertionFrame: number | null;

  static INDEX_OUT_CONTAINER = NaN;

  static APPEND_EMPTY_ELM_ID = "";

  constructor(draggable: IDraggableInteractive) {
    super(draggable);

    this.#scrollAnimatedFrame = null;

    const { scrollX, scrollY } =
      store.containers[this.draggable.migration.latest().key].scroll;

    this.#initialScroll = new PointNum(scrollX, scrollY);

    this.#scrollSpeed = this.draggable.scroll.initialSpeed;

    /*
     * The reason for using this instance instead of calling the store
     * instance/listeners:
     * - There's a delay. Change of scrollY/X is not updated immediately. You
     *   have to wait for the next frame, as it's throttled and then get the value.
     * - The store instance is not available if there's no overflow.
     * - Guarantee same position for dragging. In scrolling/overflow case, or
     *   regular scrolling.
     */
    this.#scrollAxes = new PointNum(
      this.#initialScroll.x,
      this.#initialScroll.y
    );

    /**
     * This is true until there's a scrolling. Then, the scroll will handle the
     * scroll with dragging to ensure both are executed in the same frame.
     */
    this.#regularDragging = true;

    if (this.draggable.isDraggedPositionFixed) {
      // @ts-expect-error
      this.draggable.changeStyle(this.draggable.changeToFixedStyleProps, true);
      this.#moveDown(1);
    }

    this.#isOnDragOutContainerEvtEmitted = false;
    this.#isOnDragOutThresholdEvtEmitted = false;
    this.#animatedDraggedInsertionFrame = null;

    this.isParentLocked = false;
  }

  #draggedEventGenerator(type: DraggedEvent["type"]): DraggedEvent {
    return {
      id: this.draggable.draggedElm.id,
      index: this.getDraggedTempIndex(),
      timeStamp: Date.now(),
      type,
    };
  }

  #emitDraggedEvent(type: DraggedEvent["type"]) {
    if (type === "onDragOutThreshold") {
      if (!this.#isOnDragOutThresholdEvtEmitted) {
        store.emitEvent(this.#draggedEventGenerator(type));

        this.#isOnDragOutThresholdEvtEmitted = true;
      }

      return;
    }

    if (
      type === "onDragOutContainer" &&
      !this.#isOnDragOutContainerEvtEmitted
    ) {
      store.emitEvent(this.#draggedEventGenerator(type));

      this.#isOnDragOutContainerEvtEmitted = true;
    }
  }

  /**
   * Gets the temporary index of dragged before it occupies new position.
   */
  getDraggedTempIndex() {
    return this.draggable.migration.latest().index;
  }

  #detectDroppableIndex() {
    let droppableIndex = null;

    const siblings = store.getElmBranchByKey(
      this.draggable.migration.latest().key
    );

    for (let i = 0; i < siblings.length; i += 1) {
      const id = siblings[i];

      if (
        isIDEligible2Move(
          id,
          this.draggable.draggedElm.id,
          this.draggable.scroll.enable
        )
      ) {
        const element = store.registry[id];

        const isQualified = element.isPositionedUnder(
          this.draggable.positionPlaceholder.y
        );

        if (isQualified) {
          droppableIndex = i;

          break;
        }
      }
    }

    return droppableIndex;
  }

  #detectNearestElm() {
    const {
      migration,
      draggedElm,
      threshold,
      occupiedTranslate,
      occupiedPosition,
      gridPlaceholder,
    } = this.draggable;

    const siblings = store.DOMGen.branches[migration.latest().key];

    /**
     * If tempIndex is zero, the dragged is coming from the top. So, move them
     * down all: to=0
     */
    let hasToMoveSiblingsDown = true;

    const hasEmptyElmID =
      siblings.length === 1 && siblings[0] === Droppable.APPEND_EMPTY_ELM_ID;

    let insertAt = hasEmptyElmID ? 0 : this.#detectDroppableIndex();

    if (typeof insertAt !== "number") {
      // Check if it's the last element
      if (!this.#checkIfDraggedIsLastElm()) return;

      insertAt = siblings.length - 1;

      hasToMoveSiblingsDown = false;
    }

    this.draggable.setDraggedTempIndex(insertAt);

    this.lockParent(false);

    // If it has solo empty id then there's no need to move down. Because it's
    // empty branch.
    if (hasToMoveSiblingsDown && !hasEmptyElmID) {
      this.#moveDown(insertAt);
    }

    draggedElm.rmDateset("draggedOutContainer");

    if (migration.isTransitioning) {
      occupiedTranslate.clone(migration.insertionTransform!);

      const activeList = store.getElmBranchByKey(migration.latest().key);

      threshold.setMainThreshold(draggedElm.id, {
        height: draggedElm.offset.height,
        width: draggedElm.offset.width,
        left: this.draggable.occupiedPosition.x,
        top: this.draggable.occupiedPosition.y,
      });

      queueMicrotask(() => {
        if (hasEmptyElmID) {
          const offset = {
            height: draggedElm.offset.height,
            width: draggedElm.offset.width,
            left: occupiedPosition.x,
            top: occupiedPosition.y,
          };

          store.handleElmMigration(
            migration.latest().key,
            migration.prev().key,
            {
              offset,
              grid: gridPlaceholder,
            }
          );

          migration.complete(occupiedPosition);

          return;
        }

        const lastElm = store.registry[activeList[activeList.length - 1]];

        const offset = {
          height: draggedElm.offset.height,
          width: draggedElm.offset.width,
          left: lastElm.currentPosition.x,
          top: lastElm.currentPosition.y,
        };

        store.handleElmMigration(migration.latest().key, migration.prev().key, {
          offset,
          grid: lastElm.grid,
        });

        migration.complete(lastElm.currentPosition);
      });
    }
  }

  #detectNearestContainer() {
    const { migration, draggedElm } = this.draggable;

    let newSK;

    const dp = store.getBranchesByDepth(draggedElm.depth);

    for (let i = 0; i < dp.length; i += 1) {
      newSK = dp[i];

      const isOut = this.draggable.isOutThreshold(newSK);

      if (!isOut) {
        // Coming back to the same container.
        if (newSK === migration.latest().key) {
          return;
        }

        migration.start();

        const originList = store.getElmBranchByKey(migration.latest().key);

        if (originList.length === 1) {
          // Preserve the last known current position so we can restore it later if the
          // container has new insertion.
          store.containers[migration.latest().key].preserveFirstElmPosition(
            store.registry[originList[0]].currentPosition
          );
        }

        // Remove the last element from the original list.
        // when the dragged is out of the container, the last element is the
        // placeholder as all the elements are stacked.
        originList.pop();

        const draggedTransition: IPointAxes = {
          x: 0,
          y: 0,
        };

        const newSiblingList = store.getElmBranchByKey(newSK);

        // TODO: Update axis instead of using Y as constant.
        if (newSiblingList.length > 0) {
          const firstElm = store.registry[newSiblingList[0]];

          // Getting diff with `currentPosition` includes the element transition
          // as well.
          draggedTransition.x = this.getDiff(firstElm, "x", "currentPosition");
          draggedTransition.y = this.getDiff(firstElm, "y", "currentPosition");

          // Calculate the new occupiedPosition
          const lastElm =
            store.registry[newSiblingList[newSiblingList.length - 1]];
          const prevLastElm =
            store.registry[newSiblingList[newSiblingList.length - 2]];

          const diffY =
            lastElm.currentPosition.y -
            (prevLastElm ? prevLastElm.getRectBottom() : 0);

          const offsetDiffY = Math.abs(
            draggedElm.offset.height - lastElm.offset.height
          );

          this.draggable.occupiedPosition.setAxes(
            lastElm.currentPosition.x + 0,
            lastElm.currentPosition.y +
              draggedElm.offset.height +
              diffY -
              offsetDiffY
          );
        } else {
          // Restore the last known current position.
          const { preservedFirstElmPosition: currentPosition } =
            store.containers[newSK];

          draggedTransition.x = this.getDiff(
            { currentPosition } as INode,
            "x",
            "currentPosition"
          );

          draggedTransition.y = this.getDiff(
            { currentPosition } as INode,
            "y",
            "currentPosition"
          );

          this.draggable.occupiedPosition.clone(currentPosition!);

          store.containers[newSK].preserveFirstElmPosition(null);
        }

        this.draggable.gridPlaceholder.setAxes(1, 1);

        draggedElm.keys.SK = newSK;

        // Insert the element to the new list. Empty string because when dragged
        // is out the branch sets its index as "".
        newSiblingList.push(Droppable.APPEND_EMPTY_ELM_ID);

        migration.add(NaN, newSK, draggedTransition);

        break;
      }
    }
  }

  #checkIfDraggedIsLastElm() {
    const siblings = store.getElmBranchByKey(
      this.draggable.migration.latest().key
    );

    let isLast = false;

    for (let i = siblings.length - 1; i >= 0; i -= 1) {
      const id = siblings[i];

      if (
        isIDEligible2Move(
          id,
          this.draggable.draggedElm.id,
          this.draggable.scroll.enable
        )
      ) {
        const element = store.registry[id];

        const isQualified = !element.isPositionedUnder(
          this.draggable.positionPlaceholder.y
        );

        if (isQualified) {
          isLast = true;

          const { threshold, draggedElm, migration, occupiedPosition } =
            this.draggable;

          /**
           * Update threshold from here since there's no calling to updateElement.
           */
          threshold.setMainThreshold(draggedElm.id, {
            width: draggedElm.offset.width,
            height: draggedElm.offset.height,
            left: migration.lastElmPosition.x,
            top: migration.lastElmPosition.y,
          });

          occupiedPosition.clone(migration.lastElmPosition);

          break;
        }

        break;
      }
    }

    return isLast;
  }

  #switchElement(isIncrease: boolean) {
    const siblings = store.getElmBranchByKey(
      this.draggable.migration.latest().key
    );

    const elmIndex =
      this.draggable.migration.latest().index + -1 * (isIncrease ? -1 : 1);

    const id = siblings![elmIndex];

    if (
      isIDEligible2Move(
        id,
        this.draggable.draggedElm.id,
        this.draggable.scroll.enable
      )
    ) {
      this.draggable.setDraggedTempIndex(elmIndex);

      this.updateElement(id, isIncrease);
    }
  }

  /**
   * Filling the space when the head of the list is leaving the list.
   */
  #fillHeadUp() {
    const siblings = store.getElmBranchByKey(
      this.draggable.migration.latest().key
    );

    const from = this.draggable.migration.latest().index + 1;

    emitSiblingsEvent("onLiftUpSiblings", {
      siblings,
      from,
      to: siblings.length,
    });

    this.draggable.setDraggedTempIndex(Droppable.INDEX_OUT_CONTAINER);

    for (let i = from; i < siblings.length; i += 1) {
      /**
       * Don't update translate because it's not permanent. Releasing dragged
       * means undoing last position.
       */
      const id = siblings[i];

      if (
        isIDEligible2Move(
          id,
          this.draggable.draggedElm.id,
          this.draggable.scroll.enable
        )
      ) {
        this.updateElement(id, true);
      }
    }
  }

  /**
   *
   * @param to - index
   */
  #moveDown(to: number) {
    const siblings = store.getElmBranchByKey(
      this.draggable.migration.latest().key
    );

    emitSiblingsEvent("onMoveDownSiblings", {
      siblings,
      from: siblings!.length - 1,
      to,
    });

    for (let i = siblings.length - 1; i >= to; i -= 1) {
      const id = siblings[i];

      if (
        isIDEligible2Move(
          id,
          this.draggable.draggedElm.id,
          this.draggable.scroll.enable
        )
      ) {
        this.updateElement(id, false);
      }
    }
  }

  #draggedOutPosition() {
    const {
      draggedElm: { id },
      threshold: { isOut },
      gridPlaceholder,
    } = this.draggable;

    const { SK } = store.registry[id].keys;
    const { grid: siblingsGrid } = store.containers[SK];

    if (isOut[id].isOutY()) {
      const newRow = isOut[id].isLeftFromBottom
        ? gridPlaceholder.y + 1
        : gridPlaceholder.y - 1;

      // Leaving from top.
      if (newRow === 0) {
        // lock the parent
        this.lockParent(true);

        this.#fillHeadUp();

        return;
      }

      // Leaving from bottom.
      if (newRow > siblingsGrid.y) {
        // lock the parent
        this.lockParent(true);

        return;
      }

      this.#switchElement(isOut[id].isLeftFromBottom);

      return;
    }

    const newCol = isOut[id].isLeftFromRight
      ? gridPlaceholder.x + 1
      : gridPlaceholder.x - 1;

    if (newCol <= 0 || newCol > siblingsGrid.x) {
      // lock the parent
      this.lockParent(true);

      this.#fillHeadUp();

      return;
    }

    this.#switchElement(isOut[id].isLeftFromRight);
  }

  private lockParent(isOut: boolean) {
    this.isParentLocked = isOut;
  }

  // TODO: Merge scrollElementOnY/scrollElementOnx with one method scrollElement.
  private scrollElementOnY(x: number, y: number, direction: 1 | -1) {
    let nextScrollTop = this.#scrollAxes.y;

    nextScrollTop += direction * this.#scrollSpeed;

    const draggedYShift = y + nextScrollTop - this.#initialScroll.y;

    const currentTop = draggedYShift - this.draggable.innerOffset.y;

    const currentBottom = currentTop + this.draggable.draggedElm.offset.height;

    const { SK } = store.registry[this.draggable.draggedElm.id].keys;

    const {
      scrollHeight,
      scrollContainerRef: scrollContainer,
      scrollRect,
    } = store.containers[SK].scroll;

    if (direction === 1) {
      if (currentBottom <= scrollHeight) {
        this.#scrollAxes.y = nextScrollTop;
      } else {
        this.#scrollAxes.y = scrollHeight - scrollRect.height;
      }
    } else if (currentTop >= 0) {
      this.#scrollAxes.y = nextScrollTop;
    } else {
      this.#scrollAxes.y = 0;
    }

    scrollContainer.scrollTop = this.#scrollAxes.y;

    this.draggable.dragAt(
      x + this.#scrollAxes.x - this.#initialScroll.x,
      y + this.#scrollAxes.y - this.#initialScroll.y
    );
  }

  private scrollElementOnX(x: number, y: number, direction: 1 | -1) {
    let nextScrollLeft = this.#scrollAxes.x;

    nextScrollLeft += direction * this.#scrollSpeed;

    const draggedXShift = x + nextScrollLeft - this.#initialScroll.x;

    const currentLeft = draggedXShift - this.draggable.innerOffset.x;

    const currentRight = currentLeft + this.draggable.draggedElm.offset.width;

    const { SK } = store.registry[this.draggable.draggedElm.id].keys;

    const {
      scrollHeight,
      scrollContainerRef: scrollContainer,
      scrollRect,
    } = store.containers[SK].scroll;

    if (direction === 1) {
      if (currentRight <= scrollHeight) {
        this.#scrollAxes.x = nextScrollLeft;
      } else {
        this.#scrollAxes.x = scrollHeight - scrollRect.width;
      }
    } else if (currentRight >= 0) {
      this.#scrollAxes.x = currentRight;
    } else {
      this.#scrollAxes.x = 0;
    }

    scrollContainer.scrollLeft = this.#scrollAxes.x;

    this.draggable.dragAt(
      x + this.#scrollAxes.x - this.#initialScroll.x,
      y + this.#scrollAxes.y - this.#initialScroll.y
    );
  }

  private scrollElement(
    x: number,
    y: number,
    direction: 1 | -1,
    on: "scrollElementOnX" | "scrollElementOnY"
  ) {
    const { SK } = store.registry[this.draggable.draggedElm.id].keys;

    // Prevent store from implementing any animation response.
    store.containers[SK].scroll.hasThrottledFrame = 1;

    // @ts-expect-error
    this.draggable.isViewportRestricted = false;

    this.#regularDragging = false;

    this.#scrollAnimatedFrame = requestAnimationFrame(() => {
      this[on](x, y, direction);

      // Reset animation flags
      this.#scrollAnimatedFrame = null;
      store.containers[SK].scroll.hasThrottledFrame = null;

      this.#scrollSpeed += this.draggable.scroll.initialSpeed;
    });
  }

  private scrollManager(x: number, y: number) {
    const { SK } = store.registry[this.draggable.draggedElm.id].keys;

    /**
     * Manage scrolling.
     */
    if (
      this.draggable.scroll.enable &&
      this.#scrollAnimatedFrame === null &&
      store.containers[SK].scroll.hasThrottledFrame === null
    ) {
      if (store.containers[SK].scroll.hasOverflowY) {
        const { scrollRect, scrollHeight, threshold } =
          store.containers[SK].scroll;
        if (
          this.draggable.isMovingAwayFrom.y &&
          y >= threshold!.thresholds[SK].bottom &&
          this.#scrollAxes.y + scrollRect.height < scrollHeight
        ) {
          this.scrollElement(x, y, 1, "scrollElementOnY");
          return;
        }

        if (y <= threshold!.thresholds[SK].top && this.#scrollAxes.y > 0) {
          this.scrollElement(x, y, -1, "scrollElementOnY");
          return;
        }
      }

      if (store.containers[SK].scroll.hasOverflowX) {
        const { scrollRect, scrollHeight, threshold } =
          store.containers[SK].scroll;
        if (
          this.draggable.isMovingAwayFrom.x &&
          x >= threshold!.thresholds[SK].right &&
          this.#scrollAxes.x + scrollRect.width < scrollHeight
        ) {
          this.scrollElement(x, y, 1, "scrollElementOnX");
          return;
        }

        if (x <= threshold!.thresholds[SK].left && this.#scrollAxes.x > 0) {
          this.scrollElement(x, y, -1, "scrollElementOnX");
        }
      }

      /**
       * Scroll turns the flag off. But regular dragging will be resumed
       * when the drag is outside the auto scrolling area.
       */
      this.#regularDragging = true;

      /**
       * Reset scrollSpeed.
       */
      this.#scrollSpeed = this.draggable.scroll.initialSpeed;
    }
  }

  dragAt(x: number, y: number) {
    if (this.#regularDragging) {
      this.draggable.dragAt(
        x + this.#scrollAxes.x - this.#initialScroll.x,
        y + this.#scrollAxes.y - this.#initialScroll.y
      );
    }

    let isOutSiblingsContainer = false;

    if (this.draggable.migration.isTransitioning) {
      return;
    }

    if (this.draggable.isOutThreshold()) {
      this.#emitDraggedEvent("onDragOutThreshold");

      this.scrollManager(x, y);

      if (!this.isParentLocked) {
        this.draggable.draggedElm.setDataset("draggedOutPosition", true);

        this.#draggedOutPosition();

        return;
      }

      this.draggable.draggedElm.rmDateset("draggedOutPosition");

      isOutSiblingsContainer = this.draggable.isOutThreshold(
        this.draggable.migration.latest().key
      );

      // when it's out, and on of theses is true then it's happening.
      if (!isOutSiblingsContainer) {
        if (this.#animatedDraggedInsertionFrame === null) {
          this.#animatedDraggedInsertionFrame = window.requestAnimationFrame(
            () => {
              this.#detectNearestElm();

              this.#animatedDraggedInsertionFrame = null;
            }
          );
        }

        return;
      }

      this.draggable.draggedElm.setDataset("draggedOutContainer", true);

      this.#emitDraggedEvent("onDragOutContainer");

      this.isParentLocked = true;

      if (this.draggable.enableContainersTransition) {
        this.#detectNearestContainer();

        if (this.draggable.migration.isTransitioning) {
          queueMicrotask(() => {
            this.#detectNearestElm();
          });

          return;
        }
      }

      return;
    }

    if (this.#isOnDragOutThresholdEvtEmitted) {
      this.#isOnDragOutThresholdEvtEmitted = false;
    }

    /**
     * When dragged is out parent and returning to it.
     */
    if (this.isParentLocked) {
      isOutSiblingsContainer = this.draggable.isOutThreshold(
        this.draggable.migration.latest().key
      );

      if (isOutSiblingsContainer) {
        return;
      }

      this.#isOnDragOutContainerEvtEmitted = false;

      if (this.#animatedDraggedInsertionFrame === null) {
        this.#animatedDraggedInsertionFrame = window.requestAnimationFrame(
          () => {
            this.#detectNearestElm();

            this.#animatedDraggedInsertionFrame = null;
          }
        );
      }
    }
  }
}

export default Droppable;
