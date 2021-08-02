/**
 * Copyright (c) Jalal Maskoun.
 *
 * This source code is licensed under the AGPL3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { MouseCoordinates } from "@dflex/draggable";

import Draggable from "./Draggable";
import Droppable from "./Droppable";

import type { DndOpts, FinalDndOpts } from "./types";
import { extractOpts, defaultOpts } from "./utils/extractOpts";

class DnD extends Droppable {
  /**
   *
   * @param id -
   * @param initCoordinates -
   * @param opts -
   */
  constructor(
    id: string,
    initCoordinates: MouseCoordinates,
    opts: DndOpts = defaultOpts
  ) {
    const options = extractOpts(opts);

    const draggable = new Draggable(
      id,
      initCoordinates,
      options as FinalDndOpts
    );

    super(draggable);
  }
}

export default DnD;
