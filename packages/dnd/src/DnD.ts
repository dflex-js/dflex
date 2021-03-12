import type { MouseCoordinates } from "@dflex/draggable";
import Draggable from "./Draggable";
import Droppable from "./Droppable";

import store from "./DnDStore";
import type { ElmTree } from "./DnDStore";

class DnD extends Droppable {
  /**
   *
   * @param id -
   * @param initCoordinates -
   */
  constructor(id: string, initCoordinates: MouseCoordinates) {
    const elmCoreInstanceWithTree: ElmTree = store.getElmTreeById(id);

    const draggable = new Draggable(elmCoreInstanceWithTree, initCoordinates);

    super(draggable);
  }
}

export default DnD;
