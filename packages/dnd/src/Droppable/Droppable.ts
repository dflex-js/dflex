import { PointNum } from "@dflex/utils";
import type { IPointNum } from "@dflex/utils";
import type { DraggedEvent, SiblingsEvent } from "../types";

import store from "../DnDStore";

import type { DraggableInteractiveInterface } from "../Draggable";
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

      const { scrollX, scrollY } = store.siblingsScrollElement[SK];

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
  #preserveLastElmOffset?: IPointNum;

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

  constructor(draggable: DraggableInteractiveInterface) {
    super(draggable);

    this.#updateLastElmOffset();

    this.#scrollAnimatedFrame = null;

    const { scrollX, scrollY } =
      store.siblingsScrollElement[this.draggable.migration.latest().key];

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

    for (let i = 0; i < siblings!.length; i += 1) {
      const id = siblings![i];

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

  // eslint-disable-next-line class-methods-use-this
  #migrateContainerIndicators() {
    // const { oldSiblingsKey, oldIndex, newSiblingsKey } =
    //   this.migrationPlaceholder;
    // const originalSiblingList = store.getElmBranchByKey(
    //   oldSiblingsKey
    // ) as string[];
    // Delete the element from old sibling list.
    // originalSiblingList.splice(oldIndex, 1);
    // const newSiblingList = store.getElmBranchByKey(
    //   this.draggable.SKplaceholder!
    // ) as string[];
    // // insert element to new sibling list
    // newSiblingList.splice(
    //   this.draggable.draggedElm.order.self,
    //   0,
    //   this.draggable.draggedElm.id
    // );
    // console.log(
    //   "file: Droppable.ts ~ line 660 ~ newSiblingList",
    //   newSiblingList
    // );
    // this.draggable.SKplaceholder = newSK;
  }

  #detectNearestElm() {
    const siblings =
      store.DOMGen.branches[this.draggable.migration.latest().key];

    /**
     * If tempIndex is zero, the dragged is coming from the top. So, move them
     * down all: to=0
     */
    let hasToMoveSiblingsDown = true;

    let to = this.#detectDroppableIndex();

    if (typeof to !== "number") {
      // check if it's the last element

      if (!this.#checkIfDraggedIsLastElm()) return;

      to = siblings!.length - 1;

      hasToMoveSiblingsDown = false;
    }

    this.draggable.setDraggedTempIndex(to);

    this.lockParent(false);

    if (hasToMoveSiblingsDown) {
      this.#moveDown(to);
    }

    this.draggable.draggedElm.rmDateset("draggedOutContainer");
  }

  #detectNearestContainer() {
    const {
      draggedElm: { depth },
    } = this.draggable;

    let newSK;

    for (let i = 0; i < store.siblingDepth[depth].length; i += 1) {
      const SK = store.siblingDepth[depth][i];
      const isOut = this.draggable.isOutThreshold(SK);

      if (!isOut) {
        newSK = SK;

        const originalSiblingList = store.getElmBranchByKey(
          this.draggable.migration.latest().key
        ) as string[];

        const newSiblingList = store.getElmBranchByKey(newSK) as string[];

        // Remove the last element from the original list.
        // when the dragged is out of the container, the last element is the
        // placeholder as all the elements are stacked.
        originalSiblingList.pop();

        // Insert the element to the new list.
        newSiblingList.push("");

        this.draggable.migration.add(NaN, newSK);

        break;
      }
    }
  }

  #updateLastElmOffset() {
    let currentTop = 0;
    let currentLeft = 0;

    const siblings = store.getElmBranchByKey(
      this.draggable.migration.latest().key
    );

    if (siblings) {
      const lastIndex = siblings.length - 1;
      const id = siblings[lastIndex];

      // TODO: What causes this? Need investigation.
      if (id) {
        const element = store.registry[id];

        if (element && element.offset) {
          currentTop = element.currentPosition.y;
          currentLeft = element.currentPosition.x;
        }
      }
    }

    this.#preserveLastElmOffset = new PointNum(currentLeft, currentTop);
  }

  #checkIfDraggedIsLastElm() {
    const siblings = store.getElmBranchByKey(
      this.draggable.migration.latest().key
    );

    let isLast = false;

    for (let i = siblings!.length - 1; i >= 0; i -= 1) {
      const id = siblings![i];

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

          /**
           * Update threshold from here since there's no calling to updateElement.
           */
          this.draggable.threshold.setMainThreshold(
            this.draggable.draggedElm.id,
            {
              width: this.draggable.draggedElm.offset.width,
              height: this.draggable.draggedElm.offset.height,
              left: this.#preserveLastElmOffset!.x,
              top: this.#preserveLastElmOffset!.y,
            }
          );

          this.draggable.occupiedOffset.clone(this.#preserveLastElmOffset!);

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
    ) as string[];

    const from = this.draggable.migration.latest().index + 1;

    // this.leftAtIndex = this.draggable.indexPlaceholder;

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
    ) as string[];

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
    const siblingsGrid = store.siblingsGridContainer[SK];

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
    } = store.siblingsScrollElement[SK];

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
    } = store.siblingsScrollElement[SK];

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
    store.siblingsScrollElement[SK].hasThrottledFrame = 1;

    // @ts-expect-error - TODO: fix this
    this.draggable.isViewportRestricted = false;

    this.#regularDragging = false;

    this.#scrollAnimatedFrame = requestAnimationFrame(() => {
      this[on](x, y, direction);

      // Reset animation flags
      this.#scrollAnimatedFrame = null;
      store.siblingsScrollElement[SK].hasThrottledFrame = null;

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
      store.siblingsScrollElement[SK].hasThrottledFrame === null
    ) {
      if (store.siblingsScrollElement[SK].hasOverflowY) {
        const { scrollRect, scrollHeight, threshold } =
          store.siblingsScrollElement[SK];
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

      if (store.siblingsScrollElement[SK].hasOverflowX) {
        const { scrollRect, scrollHeight, threshold } =
          store.siblingsScrollElement[SK];
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

    if (!this.draggable.migration.latest().key) return;

    const siblings =
      store.DOMGen.branches[this.draggable.migration.latest().key];

    if (siblings === null) return;

    let isOutSiblingsContainer = false;

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

      this.#detectNearestContainer();

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
