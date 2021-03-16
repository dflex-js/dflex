import type { MouseCoordinates } from "@dflex/draggable";
import type { Offset } from "@dflex/core-instance";

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

    const {
      keys: { sK },
    } = store.registry[id];

    const siblingsBoundaries = store.boundaries[sK];

    const draggable = new Draggable(
      elmCoreInstanceWithTree,
      sK,
      siblingsBoundaries,
      initCoordinates
    );

    super(draggable);
  }
}

export default DnD;
