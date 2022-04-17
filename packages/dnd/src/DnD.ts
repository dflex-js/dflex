import type { IPointAxes } from "@dflex/utils";

import DraggableInteractive from "./Draggable";
import Droppable from "./Droppable";
import store from "./DnDStore";

import type { DndOpts, FinalDndOpts } from "./types";

import { extractOpts } from "./utils/extractOpts";
import { defaultOpts } from "./utils/constants";

class DnD extends Droppable {
  /**
   *
   * @param id -
   * @param initCoordinates -
   * @param opts -
   */
  constructor(
    id: string,
    initCoordinates: IPointAxes,
    opts: DndOpts = defaultOpts
  ) {
    const isLayoutAvailable = ["pending", "dragEnd", "dragCancel"].includes(
      store.layoutState
    );

    if (!isLayoutAvailable) {
      if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line no-console
        throw new Error(
          `DFlex: received multiple dragging request while layout is still occupied`
        );
      }
    }

    if (!store.registry[id]) {
      throw new Error(`DFlex: ${id} is not registered in the Store.`);
    }

    console.log(store.registry);
    console.log(store.DOMGen.branches);
    const options = extractOpts(opts);

    const { depth } = store.registry[id];

    /**
     * In case it is not already initiated in the store. We do it here guarantee
     * all the branch is updated.
     */
    store.getBranchesByDepth(depth).forEach((SK) => {
      store.initSiblingContainer(SK, true);
    });

    const draggable = new DraggableInteractive(
      id,
      initCoordinates,
      options as FinalDndOpts
    );

    super(draggable);

    store.events = options.events;

    store.onStateChange("ready");
  }
}

export default DnD;
