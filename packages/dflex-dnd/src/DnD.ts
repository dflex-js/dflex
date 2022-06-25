import type { IPointAxes } from "@dflex/utils";

import DraggableInteractive from "./Draggable";
import Droppable from "./Droppable";
import { store } from "./DnDStore";

import type { DFlexDnDOpts, FinalDndOpts } from "./types";

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
    opts: DFlexDnDOpts = defaultOpts
  ) {
    if (!store.registry.has(id)) {
      throw new Error(`DFlex: ${id} is not registered in the Store.`);
    }

    const options = extractOpts(opts);

    const { depth } = store.registry.get(id)!;

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

    store.listeners.notify({ layoutState: "ready" });
  }
}

export default DnD;
