import { DRAGGED_ELM } from "@dflex/draggable/constants.json";

import DroppableUndo from "./DroppableUndo";

/**
 * Layout class responsible of dragged and droppable.
 *
 * @class EndDroppable
 */
class EndDroppable extends DroppableUndo {
  /**
   * Reset all elements positions and dragged style.
   *
   * @memberof EndDroppable
   */
  endAll() {
    /**
     * End process related toY dragged elements.
     */
    this.endDragging();

    /**
     * If not activeParent, it means dragged is floating outside known list and
     * list's elements is lifted up.
     *
     * So, undo dragged and elements effected.
     */
    if (this.isDraggedOutActiveParent) {
      console.log("%c inside undoParents", "background: lightgreen");
      this.undoTransformedParents();

      this.resettleDragged();

      return;
    }

    if (!this.isFoundBreakingPoint) {
      console.log("here!");
      /**
       * If not isFoundBreakingPoint, it means dragged is out its position, inside
       * list but didn't reach another element to replace.
       *
       * List's elements is in their position, just undo dragged.
       */
      this.resettleDragged();

      return;
    }

    console.log("TCL: this.topDifference,", this.topDifference);
    /**
     * Move to new droppable position.
     *
     * We already have translate value in for dragged in goX/goY but it is
     * related to mouse dragging. Instead, we want to translate to droppable
     * element that is replaced by dragged.
     */
    this[DRAGGED_ELM].setYPosition(
      this.siblingsList,
      -this.elemDirection /** dragged goes to opposite side */,
      this.numberOfElementsTransformed * this.topDifference,
      this.numberOfElementsTransformed,
      false
    );

    console.log("siblingsList is after dragged", this.siblingsList);
  }
}

export default EndDroppable;
