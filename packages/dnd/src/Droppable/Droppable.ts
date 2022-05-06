import { IPointAxes, PointNum } from "@dflex/utils";
import type { IPointNum } from "@dflex/utils";

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

export function isIDEligible(elmID: string, draggedID: string) {
  return (
    elmID &&
    elmID.length > 0 &&
    elmID !== draggedID &&
    store.registry[elmID] &&
    store.registry[elmID].ref !== null
  );
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

  static isIDEligible2Move(
    elmID: string,
    draggedID: string,
    isScrollEnabled: boolean
  ) {
    if (!isIDEligible(elmID, draggedID)) {
      return false;
    }

    // Won't trigger any resume if auto-scroll is disabled.
    if (store.registry[elmID].isPaused) {
      if (isScrollEnabled) {
        const { SK } = store.registry[draggedID].keys;

        const { scrollX, scrollY } = store.containers[SK].scroll;

        store.registry[elmID].resume(scrollX, scrollY);

        return true;
      }

      return false;
    }

    return true;
  }

  /**
   * Gets the last valid element from the list which sometime can be empty
   * string if there's appending transition.
   * ["valid-id", ""] => "valid-id"
   * ["valid-id"] => "valid-id"
   */
  static getTheLastValidElm(lst: string[], draggedID: string) {
    for (let i = lst.length - 1; i >= 0; i -= 1) {
      const id = lst[i];
      if (Droppable.isIDEligible2Move(id, draggedID, false)) {
        return store.registry[id];
      }
    }

    throw new Error(`No valid element found.${lst}\n`);
  }

  /**
   * Orphan when it's empty or has one empty string.
   */
  static isOrphan(lst: string[]) {
    const { length } = lst;

    return (
      length === 0 || (length === 1 && lst[0] === Droppable.APPEND_EMPTY_ELM_ID)
    );
  }

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
        Droppable.isIDEligible2Move(
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
    const { migration, draggedElm, occupiedTranslate } = this.draggable;

    const { key: SK } = migration.latest();

    const siblings = store.getElmBranchByKey(SK);

    /**
     * If tempIndex is zero, the dragged is coming from the top. So, move them
     * down all: to=0
     */
    let hasToMoveSiblingsDown = true;

    const isOrphan = Droppable.isOrphan(siblings);

    let insertAt = isOrphan ? 0 : this.#detectDroppableIndex();

    // Enforce attaching it from the bottom since it's already inside the container.
    if (typeof insertAt !== "number") {
      if (!migration.isTransitioning) {
        // Restore the last element position from the bottom.
        const { lastElmPosition } = store.containers[SK];

        this.updateDraggedThresholdPosition(
          lastElmPosition.x,
          lastElmPosition.y
        );
      }

      insertAt = siblings.length - 1;

      hasToMoveSiblingsDown = false;
    }

    this.draggable.setDraggedTempIndex(insertAt);

    this.lockParent(false);

    let draggedTransition: IPointAxes;

    if (migration.isTransitioning) {
      draggedTransition = this.getComposedOccupiedTranslate(
        SK,
        insertAt,
        migration.prev().key,
        hasToMoveSiblingsDown,
        "y"
      );
    }

    // If it has solo empty id then there's no need to move down. Because it's
    // empty branch.
    if (hasToMoveSiblingsDown && !isOrphan) {
      this.#moveDown(insertAt);
    }

    draggedElm.rmDateset("draggedOutContainer");

    if (migration.isTransitioning) {
      queueMicrotask(() => {
        // offset to append.
        // It has to be the biggest element offset. The last element in the list.
        const offset = {
          height: draggedElm.offset.height,
          width: draggedElm.offset.width,
          left: this.appendElmMeta!.position.x,
          top: this.appendElmMeta!.position.y,
        };

        occupiedTranslate.clone(draggedTransition);

        store.handleElmMigration(SK, migration.prev().key, draggedElm.depth, {
          offset,
          grid: new PointNum(1, 1),
        });

        store.containers[SK].preservePosition(this.appendElmMeta!.position);

        migration.complete();
      });
    }
  }

  #detectNearestContainer() {
    const { migration, draggedElm } = this.draggable;

    const { depth } = draggedElm;

    let newSK;

    const isOutInsertionArea = this.draggable.isOutThreshold(`${depth}`);

    if (isOutInsertionArea) return;

    const dp = store.getBranchesByDepth(depth);

    const { key: originSK } = migration.latest();

    for (let i = 0; i < dp.length; i += 1) {
      newSK = dp[i];

      // Check if it is not the same list and if the dragged is inside new one.
      if (newSK !== originSK && !this.draggable.isOutThreshold(newSK, true)) {
        const destinationList = store.getElmBranchByKey(newSK);

        this.appendElmMeta = this.getInsertionELmMeta(
          destinationList.length - 1,
          newSK
        );

        migration.start();

        const originList = store.getElmBranchByKey(originSK);

        // Remove the last element from the original list.
        // when the dragged is out of the container, the last element is the
        // placeholder as all the elements are stacked.
        originList.pop();

        const occupiedPosition = this.getComposedOccupiedPosition(
          this.appendElmMeta,
          originSK,
          "y"
        );

        this.draggable.occupiedPosition.clone(occupiedPosition);

        this.draggable.gridPlaceholder.setAxes(1, 1);

        draggedElm.keys.SK = newSK;

        // Insert the element to the new list. Empty string because when dragged
        // is out the branch sets its index as "".
        destinationList.push(Droppable.APPEND_EMPTY_ELM_ID);

        migration.add(NaN, newSK);

        break;
      }
    }
  }

  #switchElement(isIncrease: boolean) {
    const siblings = store.getElmBranchByKey(
      this.draggable.migration.latest().key
    );

    const elmIndex =
      this.draggable.migration.latest().index + -1 * (isIncrease ? -1 : 1);

    const id = siblings![elmIndex];

    if (
      Droppable.isIDEligible2Move(
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
        Droppable.isIDEligible2Move(
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
        Droppable.isIDEligible2Move(
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
