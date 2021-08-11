/**
 * Copyright (c) Jalal Maskoun.
 *
 * This source code is licensed under the AGPL3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
import type { CoreInstanceInterface } from "@dflex/core-instance";

import store from "../DnDStore";

import type { TempOffset, DraggableDnDInterface } from "../Draggable";

/**
 * Class includes all transformation methods related to droppable.
 */
class Droppable {
  protected draggable: DraggableDnDInterface;

  private elmTransitionY: number;

  private draggedAccumulatedTransitionY: number;

  private draggedYOffset: number;

  private leftDifference: number;

  private effectedElemDirection: 1 | -1;

  protected isListLocked: boolean;

  private leftAtIndex: number;

  private preserveLastElmOffset!: TempOffset;

  private siblingsEmptyElmIndex: number;

  private scrollAnimatedFrame: number | null;

  private isScrollOffsetInitiated: boolean;

  private scrollYOffset: number;

  private scrollXOffset: number;

  constructor(draggable: DraggableDnDInterface) {
    this.draggable = draggable;

    this.elmTransitionY = 0;

    this.draggedAccumulatedTransitionY = 0;
    this.draggedYOffset = 0;

    this.leftDifference = 0;

    /**
     * Elements effected by dragged direction.
     */
    this.effectedElemDirection = 1;

    this.isListLocked = false;

    this.leftAtIndex = -1;

    this.updateLastElmOffset();

    this.siblingsEmptyElmIndex = -1;

    this.scrollAnimatedFrame = null;

    this.isScrollOffsetInitiated = false;
    this.scrollYOffset = 0;
    this.scrollXOffset = 0;
  }

  /**
   * Gets the temporary index of dragged before it occupies new position.
   */
  getDraggedTempIndex() {
    return this.draggable.tempIndex;
  }

  private setDraggedTempIndex(tempIndex: number) {
    this.draggable.tempIndex = tempIndex;
    this.draggable.draggedElm.updateDataset(tempIndex);
  }

  private setEffectedElemDirection(isUp: boolean) {
    this.effectedElemDirection = isUp ? -1 : 1;
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
          // @ts-expect-error Checking for offset availability means current is valid
          if (element) ({ currentTop, currentLeft } = element);
        }
      }
    }

    this.preserveLastElmOffset = {
      currentLeft,
      currentTop,
    };
  }

  private updateOccupiedOffset(elmTop: number, elmLeft: number) {
    this.draggable.occupiedOffset.currentTop = elmTop + this.draggedYOffset;
    this.draggable.occupiedOffset.currentLeft = elmLeft;
  }

  private updateOccupiedTranslate(direction: 1 | -1) {
    this.draggable.occupiedTranslate.translateY +=
      direction * this.draggedAccumulatedTransitionY;

    this.draggable.occupiedTranslate.translateX += 0;
  }

  private calculateYDistance(element: CoreInstanceInterface) {
    const {
      currentLeft: elmLeft,
      currentTop: elmTop,
      // @ts-expect-error
      offset: { height: elmHight },
    } = element;

    const {
      occupiedOffset: { currentLeft: draggedLeft, currentTop: draggedTop },
      draggedElm: {
        // @ts-expect-error
        offset: { height: draggedHight },
      },
    } = this.draggable;

    this.draggedYOffset = 0;
    this.elmTransitionY = 0;

    this.leftDifference = Math.abs(elmLeft! - draggedLeft);

    const topDifference = Math.abs(elmTop! - draggedTop);

    this.draggedAccumulatedTransitionY = topDifference;
    this.elmTransitionY = topDifference;

    const heightOffset = Math.abs(draggedHight - elmHight);

    if (heightOffset === 0) return;

    if (draggedHight < elmHight) {
      // console.log("elmHight is bigger");

      if (this.effectedElemDirection === -1) {
        // console.log("elm going up");

        this.draggedAccumulatedTransitionY += heightOffset;
        this.draggedYOffset = heightOffset;
      } else {
        // console.log("elm going down");

        this.elmTransitionY -= heightOffset;
      }

      return;
    }

    // console.log("elmHight is smaller");

    if (this.effectedElemDirection === -1) {
      // console.log("elm going up");

      this.draggedAccumulatedTransitionY -= heightOffset;
      this.draggedYOffset = -heightOffset;
    } else {
      // console.log("elm going down");

      this.elmTransitionY += heightOffset;
    }
  }

  /**
   * Updates element instance and calculates the required transform distance. It
   * invokes for each eligible element in the parent container.
   *
   * @param id -
   */
  private updateElement(
    id: string,
    isUpdateDraggedTranslate: boolean,
    draggedDirection?: 1 | -1
  ) {
    const element = store.registry[id];

    this.calculateYDistance(element);

    this.draggable.incNumOfElementsTransformed(this.effectedElemDirection);

    // TODO: always true for the first element
    if (!this.isListLocked) {
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
      this.draggable.setThreshold(
        element.currentTop!,
        element.currentLeft!,
        element.offset!.height
      );
    }

    // element.onDragOver();

    const { currentLeft: elmLeft, currentTop: elmTop } = element;

    this.updateOccupiedOffset(elmTop!, elmLeft!);

    if (isUpdateDraggedTranslate) {
      this.updateOccupiedTranslate(draggedDirection!);
    }

    /**
     * Start transforming process
     */
    this.siblingsEmptyElmIndex = element.setYPosition(
      store.getElmSiblingsListById(this.draggable.draggedElm.id)!,
      this.effectedElemDirection,
      this.elmTransitionY,

      this.draggable.operationID,
      this.siblingsEmptyElmIndex
    );

    // element.onDragLeave();
  }

  private isElemAboveDragged(elmCurrentOffsetTop: number) {
    return elmCurrentOffsetTop < this.draggable.tempOffset.currentTop;
  }

  private checkIfDraggedIsLastElm() {
    const siblings = store.getElmSiblingsListById(this.draggable.draggedElm.id);

    let isLast = false;

    for (let i = siblings!.length - 1; i >= 0; i -= 1) {
      const id = siblings![i];

      if (this.isIDEligible2Move(id)) {
        const element = store.registry[id];

        const { currentTop } = element;

        const isQualified = this.isElemAboveDragged(currentTop!);

        if (isQualified) {
          isLast = true;

          /**
           * Update threshold from here since there's no calling to updateElement.
           */
          this.draggable.setThreshold(
            this.preserveLastElmOffset.currentTop,
            this.preserveLastElmOffset.currentLeft,
            element.offset!.height
          );

          this.updateOccupiedOffset(
            this.preserveLastElmOffset.currentTop,
            this.preserveLastElmOffset.currentLeft
          );

          break;
        }

        break;
      }
    }

    return isLast;
  }

  /**
   * Compares the dragged offset with element offset and returns
   * true if element is matched.
   *
   * @param elmCurrentOffsetTop -
   */
  private isElemUnderDragged(elmCurrentOffsetTop: number) {
    /**
     * Element is Switchable when it's under dragged.
     */
    return elmCurrentOffsetTop > this.draggable.tempOffset.currentTop;
  }

  private detectDroppableIndex() {
    let droppableIndex = null;
    const siblings = store.getElmSiblingsListById(this.draggable.draggedElm.id);

    for (let i = 0; i < siblings!.length; i += 1) {
      const id = siblings![i];

      if (this.isIDEligible2Move(id)) {
        const element = store.registry[id];

        const { currentTop } = element;

        const isQualified = this.isElemUnderDragged(currentTop!);

        if (isQualified) {
          droppableIndex = i;

          break;
        }
      }
    }

    return droppableIndex;
  }

  protected isIDEligible(id: string) {
    return (
      id &&
      id.length > 0 &&
      id !== this.draggable.draggedElm.id &&
      store.registry[id] &&
      store.registry[id].ref !== null
    );
  }

  /**
   *
   * @param id -
   */
  private isIDEligible2Move(id: string) {
    if (!this.isIDEligible(id)) {
      return false;
    }

    // Won't trigger any resume if auto-scroll is disabled.
    if (store.registry[id].isPaused) {
      if (this.draggable.scroll.enable) {
        store.registry[id].resume(store.scrollX, store.scrollY);

        return true;
      }

      return false;
    }

    return true;
  }

  private switchElement() {
    const siblings = store.getElmSiblingsListById(this.draggable.draggedElm.id);

    const elmIndex = this.draggable.tempIndex + -1 * this.effectedElemDirection;
    const id = siblings![elmIndex];

    if (this.isIDEligible2Move(id)) {
      this.setDraggedTempIndex(elmIndex);

      this.updateElement(id, true, this.effectedElemDirection === -1 ? 1 : -1);
    }
  }

  private liftUp() {
    const siblings = store.getElmSiblingsListById(this.draggable.draggedElm.id);

    const from = this.draggable.tempIndex + 1;

    this.leftAtIndex = this.draggable.tempIndex;
    this.setDraggedTempIndex(-1);

    for (let i = from; i < siblings!.length; i += 1) {
      /**
       * Don't update translate because it's not permanent. Releasing dragged
       * means undoing last position.
       */
      const id = siblings![i];

      if (this.isIDEligible2Move(id)) {
        this.updateElement(id, true, 1);
      }
    }
  }

  /**
   *
   * @param to - index
   */
  private moveDown(to: number) {
    const siblings = store.getElmSiblingsListById(this.draggable.draggedElm.id);

    for (let i = siblings!.length - 1; i >= to; i -= 1) {
      const id = siblings![i];

      if (this.isIDEligible2Move(id)) {
        this.updateElement(id, true, -1);
      }
    }
  }

  private draggedOutPosition() {
    if (this.draggable.isLeavingFromTop()) {
      /**
       * If leaving and parent locked, do nothing.
       */

      // move element up
      this.setEffectedElemDirection(true);

      // lock the parent
      this.isListLocked = true;

      this.liftUp();

      return;
    }

    if (this.draggable.isLeavingFromBottom()) {
      this.isListLocked = true;

      return;
    }

    if (!this.isListLocked) {
      /**
       * normal movement inside the parent
       */

      /**
       * Going out from the list: Right/left.
       */
      if (this.draggable.isOutPositionHorizontally) {
        // Is is out parent?

        // move element up
        this.setEffectedElemDirection(true);

        // lock the parent
        this.isListLocked = true;

        this.liftUp();

        return;
      }

      /**
       * Normal state, switch.
       */

      // inside the list, effected should be related to mouse movement
      this.setEffectedElemDirection(this.draggable.isMovingDown);

      this.switchElement();
    }
  }

  private unlockParent() {
    this.isListLocked = false;
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
    if (this.draggable.tempIndex !== 0) {
      to = this.detectDroppableIndex();

      if (typeof to !== "number") {
        // check if it's the last element

        if (!this.checkIfDraggedIsLastElm()) return;

        to = siblings!.length - 1;

        hasToMoveSiblingsDown = false;
      }

      this.setDraggedTempIndex(to);

      /**
       * Last prevY update when leaving the parent container. When we have
       * coming element inside we need new value so we can assign isMoveDown
       * correctly.
       */
      this.draggable.prevY = y;
    }

    this.unlockParent();

    /**
     * Moving element down by setting is up to false
     */
    this.setEffectedElemDirection(false);

    if (hasToMoveSiblingsDown) {
      this.moveDown(to);

      /**
       * Now, resitting direction by figuring out if dragged settled up/dwn.
       */
      const isElmUp = this.leftAtIndex > this.draggable.tempIndex;

      this.setEffectedElemDirection(isElmUp);
    } else {
      this.setEffectedElemDirection(true);
    }

    /**
     * Reset index.
     */
    this.leftAtIndex = -1;
  }

  private initScrollOffset() {
    this.scrollYOffset = store.scrollY;
    this.scrollXOffset = store.scrollX;
  }

  private scrollElementOnY(x: number, y: number, direction: 1 | -1) {
    store.documentScrollingElement.scrollTop +=
      direction * this.draggable.scroll.speed;

    this.draggable.dragAt(
      x,
      y + store.documentScrollingElement.scrollTop - this.scrollYOffset!
    );
  }

  private scrollElementOnX(x: number, y: number, direction: 1 | -1) {
    store.documentScrollingElement.scrollLeft +=
      direction * this.draggable.scroll.speed;

    this.draggable.dragAt(
      x + store.documentScrollingElement.scrollLeft - this.scrollXOffset!,
      y
    );
  }

  private scrollElement(
    x: number,
    y: number,
    direction: 1 | -1,
    on: "scrollElementOnX" | "scrollElementOnY"
  ) {
    // Prevent store from implementing any animation response.
    store.hasThrottledFrame = 1;

    this.scrollAnimatedFrame = requestAnimationFrame(() => {
      if (!this.isScrollOffsetInitiated) {
        this.initScrollOffset();
        this.isScrollOffsetInitiated = true;
      }

      this[on](x, y, direction);

      // Reset animation flags
      this.scrollAnimatedFrame = null;
      store.hasThrottledFrame = null;
    });
  }

  /**
   * Invokes draggable method responsible of transform.
   * Monitors dragged translate and called related methods. Which controls the
   * active and droppable method.
   *
   * @param x- mouse X coordinate
   * @param y- mouse Y coordinate
   */
  dragAt(x: number, y: number) {
    const siblings = store.getElmSiblingsListById(this.draggable.draggedElm.id);

    if (
      this.draggable.scroll.enable &&
      this.scrollAnimatedFrame === null &&
      !store.hasThrottledFrame
    ) {
      const { sK } = store.registry[this.draggable.draggedElm.id].keys;

      if (store.siblingsOverflow[sK].y) {
        if (
          y + store.documentScrollingElement.scrollTop - this.scrollYOffset <
            store.siblingsBoundaries[sK].bottom &&
          y >= store.scrollThreshold.maxY
        ) {
          this.scrollElement(x, y, 1, "scrollElementOnY");

          return;
        }

        if (y <= store.scrollThreshold.minY) {
          this.scrollElement(x, y, -1, "scrollElementOnY");

          return;
        }
      }

      if (store.siblingsOverflow[sK].x) {
        if (
          x + store.documentScrollingElement.scrollLeft - this.scrollXOffset <
            store.siblingsBoundaries[sK].minRight &&
          x >= store.scrollThreshold.maxX
        ) {
          this.scrollElement(x, y, 1, "scrollElementOnX");

          return;
        }

        if (x <= store.scrollThreshold.minX) {
          this.scrollElement(x, y, -1, "scrollElementOnX");

          return;
        }
      }
    }

    if (this.isScrollOffsetInitiated) {
      this.draggable.dragAt(
        x + store.scrollX - this.scrollXOffset,
        y + store.scrollY - this.scrollYOffset
      );
    } else {
      this.draggable.dragAt(x, y);
    }

    if (siblings === null) return;

    let isOutSiblingsContainer = false;
    const { sK } = store.registry[this.draggable.draggedElm.id].keys;

    this.draggable.setDraggedMovingDown(y);

    if (this.draggable.isOutThreshold()) {
      if (!this.isListLocked) {
        this.draggedOutPosition();

        return;
      }

      isOutSiblingsContainer = this.draggable.isOutThreshold(sK);

      // // when it's out, and on of theses is true then it's happening.
      if (!isOutSiblingsContainer) {
        this.draggedIsComingIn(y);

        return;
      }

      return;
    }

    /**
     * When dragged is out parent and returning to it.
     */
    if (this.isListLocked) {
      isOutSiblingsContainer = this.draggable.isOutThreshold(sK);

      if (!isOutSiblingsContainer) {
        this.draggedIsComingIn(y);
      }
    }
  }
}

export default Droppable;
