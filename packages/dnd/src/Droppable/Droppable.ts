import type { CoreInstanceInterface } from "@dflex/core-instance";

import store from "../DnDStore";

import type { TempOffset, DraggableDnDInterface } from "../Draggable";

/**
 * Class includes all transformation methods related to droppable.
 */
class Droppable {
  protected draggable: DraggableDnDInterface;

  private elmYSpace: number;

  protected draggedYSpace: number;

  private leftDifference: number;

  private effectedElemDirection: 1 | -1;

  protected isListLocked: boolean;

  private isFoundBreakingPoint: boolean;

  private leftAtIndex: number;

  private preserveLastElmOffset: TempOffset;

  constructor(draggable: DraggableDnDInterface) {
    this.draggable = draggable;

    this.elmYSpace = 0;
    this.draggedYSpace = 0;
    this.leftDifference = 0;

    /**
     * Elements effected by dragged direction.
     */
    this.effectedElemDirection = 1;

    this.isListLocked = false;

    this.leftAtIndex = -1;

    this.isFoundBreakingPoint = false;

    this.preserveLastElmOffset = {
      currentLeft: 0,
      currentTop: 0,
    };
  }

  /**
   * Gets the temporary index of dragged before it occupies new position.
   */
  getDraggedTempIndex() {
    return this.draggable.tempIndex;
  }

  private setEffectedElemDirection(isUp: boolean) {
    this.effectedElemDirection = isUp ? -1 : 1;
  }

  private updateOccupiedOffset(
    elmTop: number,
    elmLeft: number,
    isUpdateOccupiedOffset: boolean,
    draggedDirection: 1 | -1
  ) {
    if (isUpdateOccupiedOffset) {
      this.draggable.occupiedTranslate.translateY +=
        draggedDirection * this.draggedYSpace;

      this.draggable.occupiedTranslate.translateX += 0;
    }

    this.draggable.occupiedOffset.currentTop = elmTop;
    this.draggable.occupiedOffset.currentLeft = elmLeft;
  }

  private calculateYDistance(
    element: CoreInstanceInterface,
    isUpdateOccupiedOffset: boolean,
    draggedDirection: 1 | -1
  ) {
    const { currentLeft: elmLeft, currentTop: elmTop } = element;

    const {
      occupiedOffset: { currentLeft: draggedLeft, currentTop: draggedTop },
    } = this.draggable;

    /**
     * Sets the transform value by calculating offset difference from
     * the first braking point between element and dragged. It's done once
     * and for all.
     *
     * This value represents the amount of pixels the element will move
     * up or down.
     *
     * This step here do the trick: By measuring the space toY
     * the next element margin will be included.
     */
    this.draggedYSpace = Math.abs(elmTop - draggedTop);
    this.elmYSpace = this.draggedYSpace;

    this.leftDifference = Math.abs(elmLeft - draggedLeft);

    this.isFoundBreakingPoint = true;

    this.updateOccupiedOffset(
      elmTop,
      elmLeft,
      isUpdateOccupiedOffset,
      draggedDirection
    );
    // if (isUpdateOccupiedOffset)
  }

  /**
   * Updates element instance and calculates the required transform distance. It
   * invokes for each eligible element in the parent container.
   *
   * @param id -
   */

  updateElement(
    id: string,
    isPreservePosition: boolean,
    isUpdateOccupiedOffset: boolean,
    draggedDirection: 1 | -1
  ) {
    const element = store.getElmById(id);

    this.calculateYDistance(element, isUpdateOccupiedOffset, draggedDirection);

    this.draggable.incNumOfElementsTransformed(this.effectedElemDirection);

    if (!this.isListLocked) {
      console.log("update threshold");

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
        element.currentTop,
        element.currentLeft,
        element.offset.height
      );
    }

    // element.onDragOver();

    if (isPreservePosition) {
      const { currentLeft: elmLeft, currentTop: elmTop } = element;

      this.preserveLastElmOffset.currentLeft = elmLeft;
      this.preserveLastElmOffset.currentTop = elmTop;
    }

    /**
     * Start transforming process
     */
    element.setYPosition(
      // @ts-expect-error
      this.draggable.siblingsList,
      this.effectedElemDirection,
      this.elmYSpace,
      this.draggable.operationID,
      1,
      true
    );

    // element.onDragLeave();
  }

  private isElemAboveDragged(elmCurrentOffsetTop: number) {
    return elmCurrentOffsetTop < this.draggable.tempOffset.currentTop;
  }

  private checkIfDraggedIsLastElm() {
    let isLast = false;

    for (let i = this.draggable.siblingsList!.length - 1; i >= 0; i -= 1) {
      const id = this.draggable.siblingsList![i];

      if (this.isIDEligible2Move(id)) {
        const element = store.getElmById(id);

        const { currentTop } = element;

        const isQualified = this.isElemAboveDragged(currentTop);

        if (isQualified) {
          isLast = true;

          /**
           * Update threshold from here since there's no calling to updateElement.
           */
          this.draggable.setThreshold(
            this.preserveLastElmOffset.currentTop,
            this.preserveLastElmOffset.currentLeft,
            element.offset.height
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

    for (let i = 0; i < this.draggable.siblingsList!.length; i += 1) {
      const id = this.draggable.siblingsList![i];

      if (this.isIDEligible2Move(id)) {
        const element = store.getElmById(id);

        const { currentTop } = element;

        const isQualified = this.isElemUnderDragged(currentTop);

        if (isQualified) {
          droppableIndex = i;

          break;
        }
      }
    }

    return droppableIndex;
  }

  /**
   *
   * @param id -
   */
  private isIDEligible2Move(id: string) {
    return id && id !== this.draggable.draggedElm.id;
  }

  private switchElement() {
    const elmIndex = this.draggable.tempIndex + -1 * this.effectedElemDirection;
    const id = this.draggable.siblingsList![elmIndex];

    if (this.isIDEligible2Move(id)) {
      this.draggable.tempIndex = elmIndex;

      this.updateElement(
        id,
        false,
        true,
        this.effectedElemDirection === -1 ? 1 : -1
      );
    }
  }

  /**
   *
   * @param i - index
   */

  private movePositionIfEligibleID(
    i: number,
    isPreservePosition: boolean,
    isUpdateOccupiedOffset: boolean,
    draggedDirection: 1 | -1
  ) {
    const id = this.draggable.siblingsList![i];

    if (this.isIDEligible2Move(id)) {
      this.updateElement(
        id,
        isPreservePosition,
        isUpdateOccupiedOffset,
        draggedDirection
      );
    }
  }

  private liftUp() {
    const from = this.draggable.tempIndex + 1;

    this.leftAtIndex = this.draggable.tempIndex;
    this.draggable.tempIndex = -1;

    for (let i = from; i < this.draggable.siblingsList!.length; i += 1) {
      /**
       * Don't update translate because it's not permanent. Releasing dragged
       * means undoing last position.
       */
      this.movePositionIfEligibleID(
        i,
        i === this.draggable.siblingsList!.length - 1,
        false,
        this.draggable.tempIndex < this.draggable.draggedElm.order.self ? -1 : 1 // ignore
      );
    }

    console.log(
      "lift elements dragged y is",
      this.draggable.occupiedTranslate.translateY
    );
  }

  /**
   *
   * @param to - index
   */
  private moveDown(to: number) {
    console.log(
      "insertion starts right now============",
      this.draggable.siblingsList
    );

    for (let i = this.draggable.siblingsList!.length - 1; i >= to; i -= 1) {
      if (i === to && to !== this.leftAtIndex) {
        console.log(
          "file: Droppable.ts ~ line 277 ~ this.draggable.leftAtIndex",
          this.leftAtIndex
        );

        console.log(
          "file: Droppable.ts ~ line 277 ~ this.draggable.tempIndex",
          this.draggable.tempIndex
        );

        console.log(
          "direction",
          this.leftAtIndex < this.draggable.tempIndex ? 1 : -1
        );
      }

      /**
       * occupied offset is assigned to breaking point.
       */
      this.movePositionIfEligibleID(
        i,
        false,
        i === to && to !== this.leftAtIndex,
        1
      );
    }

    this.leftAtIndex = -1;
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
      console.log("isMovingDown", this.draggable.isMovingDown);

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

        to = this.draggable.siblingsList!.length - 1;

        hasToMoveSiblingsDown = false;
      }

      this.draggable.tempIndex = to;

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

    // @ts-expect-error
    this.draggable.siblingsList[to] = this.draggable.draggedElm.id;

    /**
     * Reset index.
     */
    this.leftAtIndex = -1;
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
    this.draggable.dragAt(x, y);

    if (this.draggable.siblingsList === null) return;

    let isOutSiblingsContainer = false;
    const { sK } = store.getElmById(this.draggable.draggedElm.id).keys;

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
