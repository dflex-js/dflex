import { DRAGGED_ELM } from "@dflex/draggable/constants.json";
import { ACTIVE_PARENT } from "../constants.json";

import store from "../Store";
import AxisX from "./AxisX";

/**
 * Class includes all transformation methods related to droppable.
 *
 * @class Droppable
 * @extends {Draggable}
 */
class Droppable extends AxisX {
  constructor(...args) {
    super(...args);

    /**
     * It counts number of element that dragged has passed. This counter is
     * crucial to calculate drag's translate and index
     */
    this.numberOfElementsTransformed = 0;

    /**
     * If list is locked, then we can't do any transformation on it. This flag,
     * will prevent revoking transformation methods when it's unnecessary.
     */
    this.isListLocked = false;
  }

  /**
   * Compares the dragged index with element index and returns
   * true if element is next/previous depending on elemDirection.
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
    const nextElem = elmCurrentIndex + this.elemDirection;

    /**
     * Element is Switchable when it's directly is above/under dragged.
     */
    return nextElem === this.draggedTempIndex;
  }

  /**
   * Sets elemDirection and controls the numberOfElementsTransformed sign
   * accordingly. It invokes for each transformation call related to element's
   * container change.
   *
   * @param {boolean} isDraggedGoingUp
   * @memberof Droppable
   */
  setElemDirection(isDraggedGoingUp) {
    /**
     * Initialize prevIsDraggedGoingUp if it is not.
     */
    if (this.numberOfElementsTransformed === 0) {
      this.prevIsDraggedGoingUp = isDraggedGoingUp;
    } else if (this.prevIsDraggedGoingUp !== isDraggedGoingUp) {
      /**
       * In this case, we have a sudden change in mouse movement. So, reverse
       * numberOfElementsTransformed value, to be compatible with elemDirection.
       */
      this.numberOfElementsTransformed *= -1;
    }

    this.prevIsDraggedGoingUp = isDraggedGoingUp;

    /**
     * If dragged is going top, element will decrease. So:
     * Down: -1, up: 1.
     */
    this.elemDirection = isDraggedGoingUp ? 1 : -1;
  }

  /**
   * Updates element instance and calculates the required transform distance. It
   * invokes for each eligible element in the parent container.
   *
   * @param {CoreInstance} element
   * @memberof Droppable
   */
  updateElement(element) {
    console.log("update element: ", element.id);
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

      const { currentLeft: draggedLeft, currentTop: draggedTop } = this[
        DRAGGED_ELM
      ];

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
    this.setThreshold(element);

    /**
     * With each element that is transformed:
     * 1) Increase elements transformed courter: numberOfElementsTransformed
     * 2) Update drag temp index that is used in all is-functions.
     * 3) Update all instances related to element and css-transform it.
     */

    this.numberOfElementsTransformed += 1;

    /**
     * Since final index is set when element is transformed, we have no idea what
     * the current index in dragged is. To solve this issue, we have a simple
     * equation
     *
     * Current temp index = currentIndex +/- numberOfElementsTransformed
     *
     * Dragged is always going to the opposite side of element direction. So, if
     * elemDirection is up (+1) dragged is down:
     *
     * draggedDirection = -elemDirection
     *
     */

    this.draggedTempIndex =
      this[DRAGGED_ELM].indexes.self -
      this.elemDirection * this.numberOfElementsTransformed;

    /**
     * Start transforming process
     */
    element.setYPosition(
      this.siblingsList,
      this.elemDirection,
      this.topDifference,
      1,
      true
    );
  }

  switchElement(isLoopBreakable) {
    console.log("%c inside switchElement", "background: green");

    /**
     * Using for because in some cases the loop is breakable.
     */
    for (let i = 0; i < this.siblingsList.length; i += 1) {
      const id = this.siblingsList[i];

      /**
       * Avoid dragged element.
       */
      if (id && id !== this[DRAGGED_ELM].id) {
        const element = store.getElmById(id);

        const {
          indexes: { self },
        } = element;

        const isQualified = this.isElemSwitchable(self);

        if (isQualified) {
          this.updateElement(element);

          if (isLoopBreakable) break;
        }
      }
    }

    /**
     * Add parent id to setOfTransformedIds.
     */
    if (!this.isDraggedOrphan) this.addParentAsTransformed();

    console.groupEnd();
  }

  /**
   * Checks direction possibilities depending on dragged index in the list. It
   * can detect actual direction swinging up/down, leaving the list. This is
   * called when dragged is not registered yet as out parent.
   *
   * @param {boolean} isDraggedGoingUp
   * @returns {boolean} -  isLoopBreakable value.
   * @memberof Droppable
   */
  directionFilter(isDraggedGoingUp) {
    if (this.draggedTempIndex === 0 && isDraggedGoingUp) {
      /**
       * To know where dragged is exactly heading, we need to check it's position
       * in the parent list. If first, going up: so dragged is leaving. Then, lift
       * all elements up.
       */
      this.setElemDirection(false);

      /**
       * Since we will do all elements up, aka isLoopBreakable=false, then lock
       * up. We'll unlock it when found new list.
       * This is happening, because lifting happens before detecting
       * isDraggedOutParent.
       */
      this.isListLocked = true;

      return false;
    }

    this.setElemDirection(isDraggedGoingUp);

    return true;
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
  startDragging(x, y) {
    this.dragAt(x, y);

    /**
     * Unlike the rest, these are done in vertical/X level.
     */
    if (this.isDraggedOutActiveParent) {
      /**
       * We don't have parent let's search for one.
       */
      const coreInstance = this.getDraggedNearestParent();

      if (coreInstance) {
        /**
         * Reset lock, because there's a possibility that the new parent is the
         * same as old one, like temporary migration.
         */

        this.assignActiveParent(coreInstance);

        this.insertElement();
        // this.isListLocked = false;
      }

      return;
    }

    /**
     * With active parent, which means that dragged is inside parent so monitor
     * its movement for dragging out.
     */
    let isDraggedOutParent = false;

    if (!this.isDraggedOrphan) {
      const { id } = this[ACTIVE_PARENT];
      isDraggedOutParent = this.isDraggedOut(id);
    }

    const isDraggedOutPosition = this.isDraggedOut();

    /**
     * If dragged is outside its position we face two possibilities:
     *
     * 1) Inside parent but swinging up and down.
     * 2) Inside parent, in way out.
     *
     * In both possibilities, we use same function call, with smart if can
     * detect the direction of dragged swinging, or out? And that's all done is
     * in directionFilter.
     */
    if (isDraggedOutPosition) {
      if (isDraggedOutParent) {
        console.log("%c outside parent ", "background: pink");

        const isTransformed = !(
          this.isSingleton ||
          this.isListLocked ||
          this.isDraggedLastElm()
        );

        if (isTransformed) {
          /**
           * Since we don't call directionFilter which help to setElemDirection,
           * We call it directly as we don't want to guess.
           */
          this.setElemDirection(false);
          this.switchElement();
        }

        this[ACTIVE_PARENT] = null;
        this.siblingsList = null;

        /**
         * This flag is turned off when assigning new ACTIVE_PARENT
         */
        this.isDraggedOutActiveParent = true;
        this.droppableIndex = null;

        this.isListLocked = true;

        return;
      }

      /**
       * Why using  isListLocked?
       * The space between out of position and out of list makes
       * isDraggedOutPosition always triggered even if the list is already transformed.
       *
       * This happens when there's space between dragged and the list
       * boundaries. Otherwise, we don't need it. Anyway, it's enhancement.
       *
       * isSingleton to prevent bugs in running transformation in list that has only one
       * child.
       */
      if (this.isSingleton || this.isListLocked) {
        return;
      }

      console.log("out position", this.isListLocked);

      /**
       * Dragged is out position, but inside parent, swinging up and down.s
       */
      let isMoveElementDown = false;

      if (y < this.prevY) {
        isMoveElementDown = true;
      }

      /**
       * If dragged is the last in the list and element should lifted up, don't
       * do anything.
       */
      if (this.isDraggedLastElm() && !isMoveElementDown) {
        console.log("locking list..");

        this.isListLocked = true;

        return;
      }

      const isLoopBreakable = this.directionFilter(isMoveElementDown);
      this.isListLocked = !isLoopBreakable;
      console.log("TCL: isLoopBreakable", isLoopBreakable);

      this.prevY = y;
      this.switchElement(isLoopBreakable);
    }
  }
}

export default Droppable;
