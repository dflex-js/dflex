import type { MouseCoordinates } from "@dflex/draggable";

import Draggable from "./Draggable";
import Droppable from "./Droppable";

import store from "./DnDStore";
import type { ElmTree } from "./DnDStore";

import type { DndOpts } from "./types";

const defaultThresholds = {
  vertical: 60,
  horizontal: 60,
};

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

    // @ts-expect-error
    let options: DndOpts = opts || {};

    if (options) {
      if (!options.thresholds) {
        options.thresholds = defaultThresholds;
      }
    } else {
      options = {
        thresholds: defaultThresholds,
      };
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
