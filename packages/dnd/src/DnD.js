import Draggable from "./Draggable";
import Droppable from "./Droppable";

import store from "./DnDStore";

class DnD extends Droppable {
  /**
   * Creates an instance of DnD.
   * @param {string} id
   * @param {import("packages/draggable/src/AbstractDraggable").MouseCoordinates} initCoordinates
   * @memberof DnD
   */
  constructor(id, initCoordinates) {
    const elmTree = store.getElmTreeById(id);

    const draggable = new Draggable(elmTree, initCoordinates);

    super(draggable);
  }
}

export default DnD;
