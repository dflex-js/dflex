import { AxesCoordinates } from "@dflex/utils";
import type { Axes, AxesCoordinatesInterface } from "@dflex/utils";
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
  private leftAtIndex: number;

  private preserveLastElmOffset?: AxesCoordinatesInterface;

  private scrollAnimatedFrame: number | null;

  private initialScrollY: number;

  private initialScrollX: number;

  private scrollSpeed: number;

  private scrollTop: number;

  private scrollLeft: number;

  private regularDragging: boolean;

  private isOnDragOutContainerEvtEmitted: boolean;

  private isOnDragOutThresholdEvtEmitted: boolean;

  /** This is only related to insert method as the each element has it's own for
   * transformation. */
  private animatedDraggedInsertionFrame: number | null;

  protected axes: Axes;

  constructor(draggable: DraggableInteractiveInterface) {
    super(draggable);

    this.leftAtIndex = -1;

    this.updateLastElmOffset();

    this.scrollAnimatedFrame = null;

    const { SK } = store.registry[this.draggable.draggedElm.id].keys;

    const { scrollX, scrollY } = store.siblingsScrollElement[SK];

    this.initialScrollY = scrollY;
    this.initialScrollX = scrollX;

    this.scrollSpeed = this.draggable.scroll.initialSpeed;

    /*
     * The reason for using this instance instead of calling the store
     * instance/listeners:
     * - There's a delay. Change of scrollY/X is not updated immediately. You
     *   have to wait for the next frame, as it's throttled and then get the value.
     * - The store instance is not available if there's no overflow.
     * - Guarantee same position for dragging. In scrolling/overflow case, or
     *   regular scrolling.
     */
    this.scrollTop = this.initialScrollY;
    this.scrollLeft = this.initialScrollX;

    /**
     * This is true until there's a scrolling. Then, the scroll will handle the
     * scroll with dragging to ensure both are executed in the same frame.
     */
    this.regularDragging = true;

    if (this.draggable.isDraggedPositionFixed) {
      // @ts-expect-error
      this.draggable.changeStyle(this.draggable.changeToFixedStyleProps, true);
      this.moveDown(1);
    }

    this.isOnDragOutContainerEvtEmitted = false;
    this.isOnDragOutThresholdEvtEmitted = false;
    this.animatedDraggedInsertionFrame = null;

    this.isDraggedOutContainerEarlyDetection = false;

    this.axes = store.siblingsAlignment[SK] === "Horizontal" ? "x" : "y";
  }

  draggedEventGenerator(type: DraggedEvent["type"]): DraggedEvent {
    return {
      id: this.draggable.draggedElm.id,
      index: this.getDraggedTempIndex(),
      timeStamp: Date.now(),
      type,
    };
  }

  emitDraggedEvent(type: DraggedEvent["type"]) {
    if (type === "onDragOutThreshold") {
      if (!this.isOnDragOutThresholdEvtEmitted) {
        store.emitEvent(this.draggedEventGenerator(type));

        this.isOnDragOutThresholdEvtEmitted = true;
      }

      return;
    }

    if (type === "onDragOutContainer" && !this.isOnDragOutContainerEvtEmitted) {
      store.emitEvent(this.draggedEventGenerator(type));

      this.isOnDragOutContainerEvtEmitted = true;
    }
  }

  /**
   * Gets the temporary index of dragged before it occupies new position.
   */
  getDraggedTempIndex() {
    return this.draggable.indexPlaceholder;
  }

  private updateLastElmOffset() {
    let currentTop = 0;
    let currentLeft = 0;

    const siblings = store.getElmSiblingsListById(this.draggable.draggedElm.id);

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

    this.preserveLastElmOffset = new AxesCoordinates(currentLeft, currentTop);
  }

  private checkIfDraggedIsLastElm() {
    const siblings = store.getElmSiblingsListById(this.draggable.draggedElm.id);

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
              left: this.preserveLastElmOffset!.x,
              top: this.preserveLastElmOffset!.y,
            }
          );

          this.updateOccupiedOffset(
            this.preserveLastElmOffset!.y,
            this.preserveLastElmOffset!.x
          );

          break;
        }

        break;
      }
    }

    return isLast;
  }

  private detectDroppableIndex() {
    let droppableIndex = null;
    const siblings = store.getElmSiblingsListById(this.draggable.draggedElm.id);

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

  private switchElement() {
    const siblings = store.getElmSiblingsListById(this.draggable.draggedElm.id);

    const elmIndex =
      this.draggable.indexPlaceholder +
      -1 * this.effectedElemDirection[this.axes];

    const id = siblings![elmIndex];

    if (
      isIDEligible2Move(
        id,
        this.draggable.draggedElm.id,
        this.draggable.scroll.enable
      )
    ) {
      this.draggable.setDraggedTempIndex(elmIndex);

      this.updateElement(
        id,
        this.axes,
        this.effectedElemDirection.y === -1 ? 1 : -1
      );
    }
  }

  /**
   * Filling the space when the head of the list is leaving the list.
   */
  private fillHeadUp() {
    const siblings = store.getElmSiblingsListById(
      this.draggable.draggedElm.id
    ) as string[];

    const from = this.draggable.indexPlaceholder + 1;

    this.leftAtIndex = this.draggable.indexPlaceholder;

    emitSiblingsEvent("onLiftUpSiblings", {
      siblings,
      from,
      to: siblings.length,
    });

    this.draggable.setDraggedTempIndex(-1);

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
        this.updateElement(id, this.axes, 1);
      }
    }
  }

  /**
   *
   * @param to - index
   */
  private moveDown(to: number) {
    const siblings = store.getElmSiblingsListById(
      this.draggable.draggedElm.id
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
        this.updateElement(id, this.axes, -1);
      }
    }
  }

  private draggedOutPosition() {
    const {
      draggedElm: { id },
      threshold: { isOut },
      // indexPlaceholder,
    } = this.draggable;

    /**
     * Leaving from head or tail are enhancement mechanism. Both do move the
     * siblings and lock the container.
     */
    if (this.draggable.isLeavingFromHead()) {
      this.fillHeadUp();

      return;
    }

    if (this.draggable.isLeavingFromTail()) {
      this.lockParent(true);

      return;
    }
    /**
     * normal movement inside the parent
     */

    /**
     * Going out from the list: Right/left.
     */
    if (isOut[id].isOutX()) {
      // Is is out parent?

      // move element up
      this.setEffectedElemDirection(true, this.axes);

      // lock the parent
      this.lockParent(true);

      this.fillHeadUp();

      return;
    }

    /**
     * Normal state, switch.
     */

    const isLeftUp: boolean =
      this.draggable.threshold.isOut[this.draggable.draggedElm.id]
        .isLeftFromBottom ||
      (!this.draggable.threshold.isOut[this.draggable.draggedElm.id]
        .isLeftFromTop &&
        !this.draggable.threshold.isOut[this.draggable.draggedElm.id]
          .isLeftFromBottom);

    // inside the list, effected should be related to mouse movement
    this.setEffectedElemDirection(
      this.axes === "y" ? isLeftUp : this.draggable.isMovingAwayFrom.x,
      this.axes
    );

    this.switchElement();
  }

  private lockParent(isOut: boolean) {
    this.isDraggedOutContainerEarlyDetection = isOut;
  }

  /**
   *
   * @param y -
   */
  private draggedIsComingIn(y: number) {
    const siblings = store.getElmSiblingsListById(this.draggable.draggedElm.id);

    /**
     * If tempIndex is zero, the dragged is coming from the top. So, move them
     * down all: to=0
     */
    let to: number | null = 0;
    let hasToMoveSiblingsDown = true;

    /**
     * Otherwise, detect where it coming from and update tempIndex
     * accordingly.
     */
    if (this.draggable.indexPlaceholder !== 0) {
      to = this.detectDroppableIndex();

      if (typeof to !== "number") {
        // check if it's the last element

        if (!this.checkIfDraggedIsLastElm()) return;

        to = siblings!.length - 1;

        hasToMoveSiblingsDown = false;
      }

      this.draggable.setDraggedTempIndex(to);

      /**
       * Last prevY update when leaving the parent container. When we have
       * coming element inside we need new value so we can assign isMoveDown
       * correctly.
       */
      this.draggable.mousePoints.y = y;
    }

    this.lockParent(false);

    /**
     * Moving element down by setting is up to false
     */
    this.setEffectedElemDirection(false, this.axes);

    if (hasToMoveSiblingsDown) {
      this.moveDown(to);

      /**
       * Now, resitting direction by figuring out if dragged settled up/dwn.
       */
      const isElmUp = this.leftAtIndex > this.draggable.indexPlaceholder;

      this.setEffectedElemDirection(isElmUp, this.axes);
    } else {
      this.setEffectedElemDirection(true, this.axes);
    }

    /**
     * Reset index.
     */
    this.leftAtIndex = -1;

    this.draggable.draggedElm.rmDateset("draggedOutContainer");
  }

  private scrollElementOnY(x: number, y: number, direction: 1 | -1) {
    let nextScrollTop = this.scrollTop;

    nextScrollTop += direction * this.scrollSpeed;

    const draggedYShift = y + nextScrollTop - this.initialScrollY;

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
        this.scrollTop = nextScrollTop;
      } else {
        this.scrollTop = scrollHeight - scrollRect.height;
      }
    } else if (currentTop >= 0) {
      this.scrollTop = nextScrollTop;
    } else {
      this.scrollTop = 0;
    }

    scrollContainer.scrollTop = this.scrollTop;

    this.draggable.dragAt(
      x + this.scrollLeft - this.initialScrollX,
      y + this.scrollTop - this.initialScrollY
    );
  }

  private scrollElementOnX(x: number, y: number, direction: 1 | -1) {
    let nextScrollLeft = this.scrollLeft;

    nextScrollLeft += direction * this.scrollSpeed;

    const draggedXShift = x + nextScrollLeft - this.initialScrollX;

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
        this.scrollLeft = nextScrollLeft;
      } else {
        this.scrollLeft = scrollHeight - scrollRect.width;
      }
    } else if (currentRight >= 0) {
      this.scrollLeft = currentRight;
    } else {
      this.scrollLeft = 0;
    }

    scrollContainer.scrollLeft = this.scrollLeft;

    this.draggable.dragAt(
      x + this.scrollLeft - this.initialScrollX,
      y + this.scrollTop - this.initialScrollY
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

    this.regularDragging = false;

    this.scrollAnimatedFrame = requestAnimationFrame(() => {
      this[on](x, y, direction);

      // Reset animation flags
      this.scrollAnimatedFrame = null;
      store.siblingsScrollElement[SK].hasThrottledFrame = null;

      this.scrollSpeed += this.draggable.scroll.initialSpeed;
    });
  }

  private scrollManager(x: number, y: number) {
    const { SK } = store.registry[this.draggable.draggedElm.id].keys;

    /**
     * Manage scrolling.
     */
    if (
      this.draggable.scroll.enable &&
      this.scrollAnimatedFrame === null &&
      store.siblingsScrollElement[SK].hasThrottledFrame === null
    ) {
      if (store.siblingsScrollElement[SK].hasOverflowY) {
        const { scrollRect, scrollHeight, threshold } =
          store.siblingsScrollElement[SK];
        if (
          this.draggable.isMovingAwayFrom.y &&
          y >= threshold!.thresholds[SK].bottom &&
          this.scrollTop + scrollRect.height < scrollHeight
        ) {
          this.scrollElement(x, y, 1, "scrollElementOnY");
          return;
        }

        if (y <= threshold!.thresholds[SK].top && this.scrollTop > 0) {
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
          this.scrollLeft + scrollRect.width < scrollHeight
        ) {
          this.scrollElement(x, y, 1, "scrollElementOnX");
          return;
        }

        if (x <= threshold!.thresholds[SK].left && this.scrollLeft > 0) {
          this.scrollElement(x, y, -1, "scrollElementOnX");
        }
      }

      /**
       * Scroll turns the flag off. But regular dragging will be resumed
       * when the drag is outside the auto scrolling area.
       */
      this.regularDragging = true;

      /**
       * Reset scrollSpeed.
       */
      this.scrollSpeed = this.draggable.scroll.initialSpeed;
    }
  }

  private detectNearestContainer() {
    const { id } = this.draggable.draggedElm;

    const { parent } = store.getElmTreeById(id);

    if (!parent) {
      const { SK } = store.registry[id].keys;

      const { hasDocumentAsContainer } = store.siblingsScrollElement[SK];

      // No parent assigned by registry and the hightest one is document.
      if (hasDocumentAsContainer) return;

      // Handle this case later.
      return;
    }

    // At this point, the element has a parent.
    const parentsID = store.getElmSiblingsById(parent.id);

    if (!parentsID || !Array.isArray(parentsID)) return;

    // Initialize parents branch.
    store.initSiblingsScrollAndVisibilityIfNecessary(parent.keys.SK);

    parentsID.forEach((parentID) => {
      // TODO: Handle this case later.
      // eslint-disable-next-line no-unused-vars
      const parentContainerInstance = store.registry[parentID];
    });
  }

  dragAt(x: number, y: number) {
    if (this.regularDragging) {
      this.draggable.dragAt(
        x + this.scrollLeft - this.initialScrollX,
        y + this.scrollTop - this.initialScrollY
      );
    }

    const siblings = store.getElmSiblingsListById(this.draggable.draggedElm.id);

    if (siblings === null) return;

    let isOutSiblingsContainer = false;

    const { SK } = store.registry[this.draggable.draggedElm.id].keys;

    if (this.draggable.isOutThreshold()) {
      this.emitDraggedEvent("onDragOutThreshold");

      this.scrollManager(x, y);

      if (!this.isDraggedOutContainerEarlyDetection) {
        this.draggable.draggedElm.setDataset("draggedOutPosition", true);

        this.draggedOutPosition();

        return;
      }

      this.draggable.draggedElm.rmDateset("draggedOutPosition");

      isOutSiblingsContainer = this.draggable.isOutThreshold(SK);

      // when it's out, and on of theses is true then it's happening.
      if (!isOutSiblingsContainer) {
        if (this.animatedDraggedInsertionFrame === null) {
          this.animatedDraggedInsertionFrame = window.requestAnimationFrame(
            () => {
              this.draggedIsComingIn(y);

              this.animatedDraggedInsertionFrame = null;
            }
          );
        }

        return;
      }

      this.draggable.draggedElm.setDataset("draggedOutContainer", true);

      this.emitDraggedEvent("onDragOutContainer");

      this.isDraggedOutContainerEarlyDetection = true;

      this.detectNearestContainer();

      return;
    }

    if (this.isOnDragOutThresholdEvtEmitted) {
      this.isOnDragOutThresholdEvtEmitted = false;
    }

    /**
     * When dragged is out parent and returning to it.
     */
    if (this.isDraggedOutContainerEarlyDetection) {
      isOutSiblingsContainer = this.draggable.isOutThreshold(SK);

      if (isOutSiblingsContainer) {
        return;
      }

      this.isOnDragOutContainerEvtEmitted = false;

      if (this.animatedDraggedInsertionFrame === null) {
        this.animatedDraggedInsertionFrame = window.requestAnimationFrame(
          () => {
            this.draggedIsComingIn(y);

            this.animatedDraggedInsertionFrame = null;
          }
        );
      }
    }
  }
}

export default Droppable;
