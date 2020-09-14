import { DRAGGED_ELM } from "@dflex/draggable/constants.json";
import store from "../DnDStore";

/**
 * Class includes all transformation methods related to droppable.
 *
 * @class Droppable
 * @extends {Draggable}
 */
class Droppable {
  constructor(draggable) {
    this.draggable = draggable;

    this.topDifference = 0;
    this.isDraggedOutPosition = false;

    this.isListLocked = false;
    this.prevIsListLocked = false;

    this.isOutStatusHorizontally = false;

    this.droppableIndex = -1;
  }

  /**
   * Updates element instance and calculates the required transform distance. It
   * invokes for each eligible element in the parent container.
   *
   * @param {CoreInstance} element
   * @memberof Droppable
   */
  updateElement(element, isUpdateTempIndex) {
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
        [DRAGGED_ELM]: { currentLeft: draggedLeft, currentTop: draggedTop },
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

    /**
     * With each element that is transformed:
     * 1) Increase elements transformed courter: this.draggable.numberOfElementsTransformed
     * 2) Update drag temp index that is used in all is-functions.
     * 3) Update all instances related to element and css-transform it.
     */
    this.draggable.numberOfElementsTransformed += 1;

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

      if (isUpdateTempIndex) {
        /**
         * Since final index is set when element is transformed, we have no idea what
         * the current index in dragged is. To solve this issue, we have a simple
         * equation
         *
         * Current temp index = currentIndex +/- this.draggable.numberOfElementsTransformed
         *
         * Dragged is always going to the opposite side of element direction. So, if
         * effectedElemDirection is up (+1) dragged is down:
         *
         * draggedDirection = -effectedElemDirection
         *
         */
        this.draggable.tempIndex =
          this.draggable[DRAGGED_ELM].order.self -
          this.draggable.effectedElemDirection *
            this.draggable.numberOfElementsTransformed;
      }
    }

    /**
     * Start transforming process
     */
    element.setYPosition(
      this.draggable.siblingsList,
      this.draggable.effectedElemDirection,
      this.topDifference,
      1,
      true,
      this.draggable.dragID
    );
  }

  /**
   * Compares the dragged offset with element offset and returns
   * true if element is matched.
   *
   * @param {number} elmCurrentOffsetTop - element vertical offset (offsetTop)
   * @returns {boolean} - true if isElemUnderDragged
   * @memberof Droppable
   */
  isElemUnderDragged(elmCurrentOffsetTop) {
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

  isIDEligible2Move(id) {
    return id && id !== this.draggable[DRAGGED_ELM].id;
  }

  switchElement() {
    const elmIndex =
      this.draggable.tempIndex + -1 * this.draggable.effectedElemDirection;

    const id = this.draggable.siblingsList[elmIndex];

    if (this.isIDEligible2Move(id)) {
      const element = store.getElmById(id);

      this.updateElement(element, true);
    }
  }

  movePositionIfEligibleID(i) {
    const id = this.draggable.siblingsList[i];

    if (this.isIDEligible2Move(id)) {
      const element = store.getElmById(id);

      this.updateElement(element);
    }
  }

  liftUp(func) {
    const from = this.draggable.tempIndex + 1;
    for (let i = from; i < this.draggable.siblingsList.length; i += 1) {
      this[func](i);
    }
  }

  moveDown(to, func) {
    for (let i = this.draggable.siblingsList.length - 1; i >= to; i -= 1) {
      this[func](i);
    }
  }

  draggedOutPosition(y) {
    /**
     * Dragged is out position, but inside parent, swinging up and down.s
     */
    this.draggable.setDraggedMovingDown(y);

    if (this.draggable.isDraggedLeavingFromTop()) {
      /**
       * If leaving and parent locked, do nothing.
       */

      // move element up
      this.draggable.setEffectedElemDirection(true);

      // lock the parent
      this.isListLocked = true;

      this.liftUp("movePositionIfEligibleID");

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
      if (this.prevIsListLocked) {
        this.prevIsListLocked = false;

        return;
      }

      /**
       * Going out from the list: Right/left.
       */
      if (this.draggable.isOutHorizontal) {
        // move element up
        this.draggable.setEffectedElemDirection(true);

        // lock the parent
        this.isListLocked = true;

        this.liftUp("movePositionIfEligibleID");

        this.isOutStatusHorizontally = true;

        return;
      }

      // console.log("normal, switch");

      // inside the list, effected should be related to mouse movement
      this.draggable.setEffectedElemDirection(this.draggable.isMovingDown);

      this.switchElement();
    }
  }

  unlockParent() {
    this.isListLocked = false;
    this.prevIsListLocked = true;
  }

  draggedIsComingIn() {
    // move element up
    this.draggable.setEffectedElemDirection(false);

    /**
     * If tempIndex is zero, the dragged is coming from the top. So, move them
     * down all: to=0
     */
    let to = 0;

    /**
     * Otherwise, detect where it coming from and update tempIndex
     * accordingly.
     */
    if (this.draggable.tempIndex !== 0) {
      to = this.detectDroppableIndex();
      if (typeof to !== "number") return;
      this.draggable.tempIndex = to;
    }

    this.unlockParent();

    this.moveDown(to, "movePositionIfEligibleID");

    this.draggable.siblingsList[to] = this.draggable[DRAGGED_ELM].id;

    // TODO: Is this right?
    this.draggable.numberOfElementsTransformed =
      this.draggable[DRAGGED_ELM].order.self - this.draggable.tempIndex;
  }

  /**
   * Invokes draggable method responsible of transform.
   * Monitors dragged translate and called related methods. Which controls the
   * active and droppable method.
   *
   * @param {number} x - mouse X coordinate
   * @param {number} y - mouse Y coordinate
   * @memberof Droppable
   */
  dragAt(x, y) {
    this.draggable.dragAt(x, y);

    this.isDraggedOutPosition = this.draggable.isDraggedOut();

    if (this.isDraggedOutPosition) {
      if (!this.isListLocked) {
        this.draggedOutPosition(y);

        return;
      }

      if (this.draggable.isDraggedVerticallyInsideList()) {
        this.draggedIsComingIn();

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
        this.draggedIsComingIn();
        this.isOutStatusHorizontally = false;
      } else {
        this.unlockParent();
      }
    }
  }
}

export default Droppable;
