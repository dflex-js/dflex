/**
 * Copyright (c) Jalal Maskoun.
 *
 * This source code is licensed under the AGPL3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
import Store from "@dflex/store";

import AbstractCoreInstance, {
  AbstractCoreInterface,
} from "@dflex/core-instance";

import type { ElmInstance } from "@dflex/store";

class DraggableStoreImp extends Store<AbstractCoreInterface> {
  /**
   * Register element for Draggable store
   *
   * @param element -
   */
  register(element: ElmInstance) {
    super.register(element, AbstractCoreInstance);
  }
}

export default (function createStoreInstance() {
  const store = new DraggableStoreImp();

  return store;
})();
