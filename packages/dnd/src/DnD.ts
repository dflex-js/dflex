import type { MouseCoordinates } from "@dflex/draggable";

import Draggable from "./Draggable";
import Droppable from "./Droppable";

import store from "./DnDStore";
import type { ElmTree } from "./DnDStore";

import type { DndOpts } from "./types";

const defaultOpts = Object.freeze({
  thresholds: {
    vertical: 60,
    horizontal: 60,
  },

  restrictions: {
    allowLeavingFromTop: true,
    allowLeavingFromBottom: true,
    allowLeavingFromLeft: true,
    allowLeavingFromRight: true,
  },
});

class DnD extends Droppable {
  /**
   *
   * @param id -
   * @param initCoordinates -
   */
  constructor(id: string, initCoordinates: MouseCoordinates, opts?: DndOpts) {
    const elmCoreInstanceWithTree: ElmTree = store.getElmTreeById(id);

    const {
      keys: { sK },
    } = store.registry[id];

    const siblingsBoundaries = store.boundaries[sK];

    const options: DndOpts = opts || defaultOpts;

    if (options) {
      if (!options.thresholds) {
        options.thresholds = defaultOpts.thresholds;
      }
    }

    const draggable = new Draggable(
      elmCoreInstanceWithTree,
      sK,
      siblingsBoundaries,
      initCoordinates,
      options
    );

    super(draggable);
  }
}

export default DnD;
