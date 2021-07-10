/**
 * Copyright (c) Jalal Maskoun.
 *
 * This source code is licensed under the AGPL3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { MouseCoordinates } from "@dflex/draggable";

import Draggable from "./Draggable";
import Droppable from "./Droppable";
import store from "./DnDStore";

import type { ElmTree } from "./DnDStore";

import type { DndObjectOpts, DndOpts } from "./types";
import { DraggableOpts } from "./Draggable/types";

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

  autoScroll: true,
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
    const elmCoreInstanceWithTree: ElmTree = store.getElmTreeById(id);

    const {
      keys: { sK },
    } = store.registry[id];

    const siblingsBoundaries = store.siblingsBoundaries[sK];

    const options = { ...opts };

    (Object.keys(defaultOpts) as Array<keyof typeof defaultOpts>).forEach(
      (props) => {
        if (options[props] === undefined) {
          // @ts-expect-error
          options[props] = defaultOpts[props];
        } else if (typeof options[props] === "object") {
          // @ts-expect-error
          options[props] = {
            ...(defaultOpts[props] as DndObjectOpts),
            ...(options[props] as DndObjectOpts),
          };
        }
      }
    );

    const draggable = new Draggable(
      elmCoreInstanceWithTree,
      siblingsBoundaries,
      initCoordinates,
      options as DraggableOpts
    );

    super(draggable);
  }
}

export default DnD;
