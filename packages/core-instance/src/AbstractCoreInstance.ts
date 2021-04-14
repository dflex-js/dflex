/**
 * Copyright (c) Jalal Maskoun.
 *
 * This source code is licensed under the AGPL3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { ElmInstance, AbstractCoreInterface } from "./types";

/**
 * This is the link (bridge) between the Store and element actions/classes.
 * Abstract is essential for Draggable & extended Store.
 */
class AbstractCoreInstance implements AbstractCoreInterface {
  ref: HTMLElement;

  id: string;

  depth: number;

  translateY: number;

  translateX: number;

  /**
   * Creates an instance of AbstractCoreInstance.
   */
  constructor({ ref, id, depth }: ElmInstance) {
    this.ref = ref;
    this.id = id;
    this.depth = depth;

    /**
     * Since element render once and being transformed later we keep the data
     * stored to navigate correctly.
     */
    this.translateY = 0;
    this.translateX = 0;
  }
}

export default AbstractCoreInstance;
