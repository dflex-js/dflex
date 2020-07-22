import { DRAGGED_ELM } from "@dflex/draggable/constants.json";
import store from "@dflex/dnd-store";

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

    /**
     * If list is locked, then we can't do any transformation on it. This flag,
     * will prevent revoking transformation methods when it's unnecessary.
     */
    // this.isListLocked = false;
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
    const nextElem = elmCurrentIndex + this.draggable.elemDirection;

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
  updateElement(element) {
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
     * With each element that is transformed:
     * 1) Increase elements transformed courter: this.draggable.numberOfElementsTransformed
     * 2) Update drag temp index that is used in all is-functions.
     * 3) Update all instances related to element and css-transform it.
     */
    this.draggable.numberOfElementsTransformed += 1;

    /**
     * Since final index is set when element is transformed, we have no idea what
     * the current index in dragged is. To solve this issue, we have a simple
     * equation
     *
     * Current temp index = currentIndex +/- this.draggable.numberOfElementsTransformed
     *
     * Dragged is always going to the opposite side of element direction. So, if
     * elemDirection is up (+1) dragged is down:
     *
     * draggedDirection = -elemDirection
     *
     */
    this.draggable.tempIndex =
      this.draggable[DRAGGED_ELM].order.self -
      this.draggable.elemDirection * this.draggable.numberOfElementsTransformed;

    /**
     * Start transforming process
     */
    element.setYPosition(
      this.draggable.siblingsList,
      this.draggable.elemDirection,
      this.topDifference,
      1,
      true
    );
  }

  switchElement(isLoopBreakable) {
    /**
     * Using for because in some cases the loop is breakable.
     */
    for (let i = 0; i < this.draggable.siblingsList.length; i += 1) {
      const id = this.draggable.siblingsList[i];

      /**
       * Avoid dragged element.
       */
      if (id && id !== this.draggable[DRAGGED_ELM].id) {
        const element = store.getElmById(id);

        const {
          order: { self },
        } = element;

        if (isLoopBreakable) {
          const isQualified = this.isElemSwitchable(self);

          if (isQualified) {
            this.updateElement(element);

            break;
          }
        } else {
          this.updateElement(element);
        }
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

    const isDraggedOutPosition = this.draggable.isDraggedOut();

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
      /**
       * Why using isListLocked?
       * The space between out of position and out of list makes
       * isDraggedOutPosition always triggered even if the list is already transformed.
       *
       * This happens when there's space between dragged and the list
       * boundaries. Otherwise, we don't need it. Anyway, it's enhancement.
       *
       * isSingleton to prevent bugs in running transformation in list that has only one
       * child.
       */
      if (this.draggable.isOutActiveParent) {
        return;
      }

      /**
       * Dragged is out position, but inside parent, swinging up and down.s
       */
      this.draggable.updateDraggedDirectionFlags(y);

      // const isLeavingFromTop = this.draggable.isDraggedLeavingFromTops();

      // if (isLeavingFromTop) {
      //   this.draggable.triggerLeavingFromTopFlags();
      //   // this.isListLocked = true;

      //   this.switchElement(false);

      //   return;
      // }

      // const isLeavingFromBottom = this.draggable.isDraggedLeavingFromBottom();

      // if (this.draggable.isSingleton || isLeavingFromBottom) {
      //   this.isListLocked = true;

      //   return;
      // }

      // debugger;

      this.switchElement(true);

      let isDraggedOutParent;

      if (!this.draggable.isOrphan) {
        const { id } = this.draggable[ACTIVE_PARENT];

        isDraggedOutParent = this.draggable.isDraggedOut(id);
      }

      if (isDraggedOutParent) {
        this.draggable.isOutActiveParent = true;
        this.isFoundBreakingPoint = false;
      }
    }
  }
}

export default Droppable;
