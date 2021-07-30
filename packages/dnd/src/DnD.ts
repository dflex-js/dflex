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

const defaultOpts: DndOpts = Object.freeze({
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

  scroll: {
    enable: true,
    speed: 10,
    threshold: 50,
  },
});

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
    const options = { ...opts };

    (Object.keys(defaultOpts) as Array<keyof typeof defaultOpts>).forEach(
      (props) => {
        if (!options[props]) {
          options[props] = defaultOpts[props];
        } else {
          options[props] = {
            ...defaultOpts[props],
            ...options[props],
          };
        }
      }
    );

    const draggable = new Draggable(
      id,
      initCoordinates,
      options as FinalDndOpts
    );

    super(draggable);
  }
}

export default DnD;
