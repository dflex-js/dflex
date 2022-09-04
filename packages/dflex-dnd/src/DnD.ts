import type { AxesPoint } from "@dflex/utils";

import DraggableInteractive from "./Draggable";
import Mechanism from "./Mechanism";
import { scheduler, store } from "./LayoutManager";

import type { DFlexDnDOpts, FinalDndOpts } from "./types";

import { extractOpts } from "./utils/extractOpts";
import { defaultOpts } from "./utils/constants";

class DnD extends Mechanism {
  /**
   *
   * @param id -
   * @param initCoordinates -
   * @param opts -
   */
  constructor(
    id: string,
    initCoordinates: AxesPoint,
    opts: DFlexDnDOpts = defaultOpts
  ) {
    if (__DEV__) {
      if (!store.registry.has(id)) {
        throw new Error(`DFlex: ${id} is not registered in the Store.`);
      }
    }

    const options = extractOpts(opts);

    const draggable = new DraggableInteractive(
      id,
      initCoordinates,
      options as FinalDndOpts
    );

    super(draggable);

    scheduler(store, null, null, { type: "layoutState", status: "ready" });

    store.isTransforming = true;
  }
}

export default DnD;
