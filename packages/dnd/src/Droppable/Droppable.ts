import store from "../DnDStore";
import { DraggableDnD } from "../Draggable/types";
import { DroppableInterface } from "./types";

/**
 * Class includes all transformation methods related to droppable.
 */
class Droppable implements DroppableInterface {
  draggable: DraggableDnD;

  topDifference: number;

  leftDifference: number;

  effectedElemDirection: number;

  isListLocked: boolean;

  prevIsListLocked: boolean;

  isOutStatusHorizontally: boolean;

  droppableIndex: number;

  isFoundBreakingPoint: boolean;

  constructor(draggable: DraggableDnD) {
    this.draggable = draggable;

    this.topDifference = 0;
    this.leftDifference = 0;

    /**
     * Elements effected by dragged direction.
     */
    this.effectedElemDirection = 1;

    this.isListLocked = false;
    this.prevIsListLocked = false;

    this.isOutStatusHorizontally = false;

    this.droppableIndex = -1;
    this.isFoundBreakingPoint = false;
  }

  /**
   * Gets the temporary index of dragged before it occupies new position.
   */
  getDraggedTempIndex() {
    return this.draggable.tempIndex;
  }

  setEffectedElemDirection(isUp: boolean) {
    this.effectedElemDirection = isUp ? -1 : 1;
  }

  /**
   * Updates element instance and calculates the required transform distance. It
   * invokes for each eligible element in the parent container.
   *
   * @param id -
   */
  updateElement(id: string) {
    const element = store.getElmById(id);

    /**
     * breakingPoint detects the first element that comes immediately
     * after dragged. Not in original order, but according to isQualified result.
     *
     * The problem:
     *
     * Supposed we moved elem1 to the last. And we have in order,
     * elm2/elm3/elm4/elm1.
     * Now, we pulled elem2 out of the parent and isQualified is triggered at
     * elm3. That's mean, escaping elm1 from the loop because it's not
     * isQualified. So, all elements will be lifted up except elm1.
     */
    if (!this.isFoundBreakingPoint) {
      const { currentLeft: elmLeft, currentTop: elmTop } = element;

      const {
        draggedElm: { currentLeft: draggedLeft, currentTop: draggedTop },
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
      this.topDifference = Math.abs(elmTop - draggedTop);

      this.leftDifference = Math.abs(elmLeft - draggedLeft);

      this.isFoundBreakingPoint = true;
    }

    this.draggable.incNumOfElementsTransformed();

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
      this.draggable.setThreshold(element);
    }

    // element.onDragOver();

    /**
     * Start transforming process
     */
    element.setYPosition(
      // @ts-expect-error
      this.draggable.siblingsList,
      this.effectedElemDirection,
      this.topDifference,
      this.draggable.dragID,
      1,
      true
    );

    // element.onDragLeave();
  }

  /**
   * Compares the dragged offset with element offset and returns
   * true if element is matched.
   *
   * @param elmCurrentOffsetTop -
   */
  isElemUnderDragged(elmCurrentOffsetTop: number) {
    /**
     * Element is Switchable when it's under dragged.
     */
    return elmCurrentOffsetTop >= this.draggable.tempOffset.currentTop;
  }

  detectDroppableIndex() {
    let droppableIndex = null;

    for (let i = 0; i < this.draggable.siblingsList.length; i += 1) {
      const id = this.draggable.siblingsList[i];

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
  isIDEligible2Move(id: string) {
    return id && id !== this.draggable.draggedElm.id;
  }

  switchElement() {
    const elmIndex = this.draggable.tempIndex + -1 * this.effectedElemDirection;
    const id = this.draggable.siblingsList[elmIndex];

    if (this.isIDEligible2Move(id)) {
      this.draggable.tempIndex = elmIndex;

      this.updateElement(id);
    }
  }

  /**
   *
   * @param i - index
   */
  movePositionIfEligibleID(i: number) {
    const id = this.draggable.siblingsList[i];

    if (this.isIDEligible2Move(id)) {
      this.updateElement(id);
    }
  }

  liftUp() {
    const from = this.draggable.tempIndex + 1;
    this.draggable.tempIndex = -1;

    for (let i = from; i < this.draggable.siblingsList.length; i += 1) {
      this.movePositionIfEligibleID(i);
    }
  }

  /**
   *
   * @param to - index
   */
  moveDown(to: number) {
    for (let i = this.draggable.siblingsList.length - 1; i >= to; i -= 1) {
      this.movePositionIfEligibleID(i);
    }
  }

  /**
   *
   * @param y -
   */
  draggedOutPosition(y: number) {
    this.draggable.setDraggedMovingDown(y);

    if (this.draggable.isDraggedLeavingFromTop()) {
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

    if (this.draggable.isDraggedLeavingFromEnd()) {
      this.isListLocked = true;

      return;
    }

    if (!this.isListLocked) {
      /**
       * normal movement inside the parent
       */
      // if (this.prevIsListLocked) {
      //   this.prevIsListLocked = false;

      //   return;
      // }

      /**
       * Going out from the list: Right/left.
       */
      if (this.draggable.isOutHorizontal) {
        // move element up
        this.setEffectedElemDirection(true);

        // lock the parent
        this.isListLocked = true;

        this.liftUp();

        this.isOutStatusHorizontally = true;

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

  unlockParent() {
    this.isListLocked = false;
    this.prevIsListLocked = true;
  }

  /**
   *
   * @param y -
   */
  draggedIsComingIn(y: number) {
    /**
     * If tempIndex is zero, the dragged is coming from the top. So, move them
     * down all: to=0
     */
    let to: number | null = 0;

    /**
     * Otherwise, detect where it coming from and update tempIndex
     * accordingly.
     */
    if (this.draggable.tempIndex !== 0) {
      to = this.detectDroppableIndex();
      if (typeof to !== "number") return;
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

    /**
     * Toggle elements transformed incremental to decrease number of transformed
     * elements. It's like undoing transformation.
     */
    this.draggable.toggleElementsTransformedInc();

    this.moveDown(to);

    /**
     * End toggling and continue as it was.
     */
    this.draggable.toggleElementsTransformedInc();

    /**
     * Now, resitting direction by figuring out if dragged settled up/dwn.
     */
    const isElmUp =
      this.draggable.tempIndex > this.draggable.draggedElm.order.self;
    this.setEffectedElemDirection(isElmUp);

    // @ts-expect-error
    this.draggable.siblingsList[to] = this.draggable.draggedElm.id;
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

    if (this.draggable.isSingleton) return;

    if (this.draggable.isDraggedOut()) {
      if (!this.isListLocked) {
        this.draggedOutPosition(y);

        return;
      }

      if (this.draggable.isDraggedVerticallyInsideList()) {
        this.draggedIsComingIn(y);

        return;
      }

      // if (!isOutParent) this.draggedIsComingIn();

      return;
    }

    /**
     * When dragged is out parent and returning to it.
     */
    if (this.isListLocked) {
      if (
        this.isOutStatusHorizontally ||
        this.draggable.isDraggedLeavingFromTop()
      ) {
        this.draggedIsComingIn(y);
        this.isOutStatusHorizontally = false;
      } else {
        this.unlockParent();
      }
    }
  }
}

export default Droppable;
