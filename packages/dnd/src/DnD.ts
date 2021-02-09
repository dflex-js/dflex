import Draggable from "./Draggable";
import Droppable from "./Droppable";

import store from "./DnDStore";
import { MouseCoordinates } from "@dflex/draggable/src/AbstractDraggable";

class DnD extends Droppable {
  /**
   *
   * @param id
   * @param initCoordinates
   */
  constructor(id: string, initCoordinates: MouseCoordinates) {
    const elmTree = store.getElmTreeById(id);

    const draggable = new Draggable(elmTree, initCoordinates);

    super(draggable);
  }
}

export default DnD;
