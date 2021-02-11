import Draggable from "./Draggable";
import Droppable from "./Droppable";

import store from "./DnDStore";
import { MouseCoordinates } from "packages/draggable/src/types";

class DnD extends Droppable {
  /**
   *
   * @param id
   * @param initCoordinates
   */
  constructor(id: string, initCoordinates: MouseCoordinates) {
    const elmCoreInstanceWithTree = store.getElmTreeById(id);

    const draggable = new Draggable(elmCoreInstanceWithTree, initCoordinates);

    super(draggable);
  }
}

export default DnD;
