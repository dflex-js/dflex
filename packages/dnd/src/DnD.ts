import type { Coordinates } from "@dflex/draggable";

import Draggable from "./Draggable";
import Droppable from "./Droppable";
import store from "./DnDStore";

import type { DndOpts, FinalDndOpts } from "./types";
import { extractOpts, defaultOpts } from "./utils/extractOpts";

class DnD extends Droppable {
  /**
   *
   * @param id -
   * @param initCoordinates -
   * @param opts -
   */
  // eslint-disable-next-line constructor-super
  constructor(
    id: string,
    initCoordinates: Coordinates,
    opts: DndOpts = defaultOpts
  ) {
    const isLayoutAvailable = ["pending", "dragEnd", "dragCancel"].includes(
      store.layoutState
    );

    if (!isLayoutAvailable) {
      if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line no-console
        console.error(
          `DFlex: received multiple dragging request while layout is still occupied`
        );
      }
    }

    if (!store.registry[id]) {
      throw new Error(`DFlex: ${id} is not registered in the Store.`);
    }

    const options = extractOpts(opts);

    const { SK } = store.registry[id].keys;

    if (!SK) {
      throw new Error(`DFlex: unable to find element list key in the Store.`);
    }

    /**
     * In case it is not already initiated in the store. We do it here guarantee
     * all the branch is updated.
     */
    store.initSiblingsScrollAndVisibilityIfNecessary(SK);

    const draggable = new Draggable(
      id,
      initCoordinates,
      options as FinalDndOpts
    );

    super(draggable);

    // @ts-expect-error
    store.events = options.events;

    store.onStateChange("ready");
  }
}

export default DnD;
