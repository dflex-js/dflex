import { DRAGGED_ELM } from "@dflex/draggable/constants.json";
import store from "../DnDStore";

import { ACTIVE_PARENT } from "../../constants.json";

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
  }

  /**
   * Compares the dragged index with element index and returns
   * true if element is next/previous depending on effectedElemDirection.
   *
   * @param {number} elmCurrentIndex
   * @returns {boolean} - true if isElemSwitchable up/down
   * @memberof Droppable
   */
  isElemSwitchable(elmCurrentIndex) {
    /**
     * If dragged is going up, next element is the element above, which means
     * its index is elmCurrentIndex -1 and vice versa when going down.
     *
     * nextElem = elmCurrentIndex +/- 1;
     */
    const nextElem = elmCurrentIndex + this.draggable.effectedElemDirection;
    console.log(
      "elmCurrentIndex",
      elmCurrentIndex,

      "effectedElemDirection",
      this.draggable.effectedElemDirection,

      "nextElem",
      nextElem,

      "tempIndex",
      this.draggable.tempIndex
    );

    /**
     * Element is Switchable when it's directly is above/under dragged.
     */
    return nextElem === this.draggable.tempIndex;
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

    if (isUpdateTempIndex) {
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

    /**
     * Start transforming process
     */
    element.setYPosition(
      this.draggable.siblingsList,
      this.draggable.effectedElemDirection,
      this.topDifference,
      1,
      true
    );
  }

  isIDEligible2Move(id) {
    return id && id !== this.draggable[DRAGGED_ELM].id;
  }

  switchElement(isLoopBreakable, isBreakable) {
    /**
     * Using for because in some cases the loop is breakable.
     */
    for (let i = 0; i < this.draggable.siblingsList.length; i += 1) {
      const id = this.draggable.siblingsList[i];

      /**
       * Avoid dragged element.
       */
      if (this.isIDEligible2Move(id)) {
        const element = store.getElmById(id);

        const {
          order: { self },
        } = element;

        if (isLoopBreakable) {
          const isQualified = this.isElemSwitchable(self);

          if (isQualified) {
            this.updateElement(element, true);

            if (isBreakable && !this.draggable.isOutHorizontal) {
              break;
            }
          }
        } else {
          this.updateElement(element, false);
        }
      }

      if (i === 15) break;
    }
  }

  switchElement2() {
    /**
     * Using for because in some cases the loop is breakable.
     */
    for (let i = this.draggable.siblingsList.length - 1; i > 0; i -= 1) {
      const id = this.draggable.siblingsList[i];

      /**
       * Avoid dragged element.
       */
      if (this.isIDEligible2Move(id)) {
        const element = store.getElmById(id);

        this.updateElement(element, true);
      }
    }
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
      /**
       * Dragged is out position, but inside parent, swinging up and down.s
       */
      this.draggable.setDraggedMovingDown(y);

      const isLeavingFromTop = this.draggable.isDraggedLeavingFromTop();

      if (isLeavingFromTop) {
        /**
         * If leaving and parent locked, do nothing.
         */
        if (this.isListLocked) {
          return;
        }

        // move element up
        this.draggable.setEffectedElemDirection(true);

        // lock the parent
        this.draggable.isOutActiveParent = true;
        this.isListLocked = true;

        this.switchElement(false, false);

        return;
      }

      if (!this.isListLocked) {
        console.log("here!");
        /**
         * normal movement inside the parent
         */
        if (this.prevIsListLocked) {
          console.log("here too!");

          // move element up
          this.draggable.setEffectedElemDirection(false);

          this.switchElement2();

          this.prevIsListLocked = false;

          return;
        }

        console.log("normal movement!");

        // inside the list, effected should be related to mouse movement
        this.draggable.setEffectedElemDirection(this.draggable.isMovingDown);

        this.switchElement(!isLeavingFromTop, true);

        return;
      }

      return;
    }

    /**
     * When dragged is out parent and returning to it.
     */
    if (this.isListLocked) {
      this.isListLocked = false;
      this.prevIsListLocked = true;
    }
  }
}

export default Droppable;
