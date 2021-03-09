import Store from "@dflex/store";
import type { ElmInstance } from "@dflex/store";

import CoreInstance from "@dflex/core-instance";

import Tracker from "./Tracker";

import type { ElmTree } from "./types";

console.log("file: DnDStoreImp.ts ~ line 5 ~ CoreInstance", CoreInstance);

// function noop() {}

// const handlers = ["onDragOver", "onDragLeave"];

class DnDStoreImp extends Store<CoreInstance> {
  tracker: Tracker;

  constructor() {
    super();
    this.tracker = new Tracker();
  }

  /**
   *  Register DnD element.
   *
   * @param element -
   */
  register(element: ElmInstance) {
    // const finalOpts = opts || {};

    // /**
    //  * Initiates available event handlers
    //  */
    // handlers.forEach((handler) => {
    //   if (typeof finalOpts[handler] !== "function") finalOpts[handler] = noop;
    // });

    console.log("file: DnDStoreImp.ts ~ line 4 ~ CoreInstance", CoreInstance);

    super.register(element, CoreInstance);
  }

  /**
   * Reattach element reference.
   * This happens when element is unmounted from the screen and mounted again.
   *
   * @param id -
   * @param elmRef -
   */
  reattachElmRef(id: string, elmRef: HTMLElement) {
    super.registry[id].ref = elmRef;
  }

  /**
   * Gets element connections instance for a given id.
   *
   * @param id -
   */
  getElmTreeById(id: string): ElmTree {
    const element = this.getElmById(id);

    const {
      keys: { sK, pK },
      order: { parent: pi },
    } = element;

    /**
     * getting connected branches
     */
    const siblings = this.getElmBranchByKey(sK);
    const parents = this.getElmBranchByKey(pK);

    /**
     * getting parent instance
     */
    let parent = null;
    if (parents !== undefined) {
      const parentsID = Array.isArray(parents) ? parents[pi] : parents;
      parent = this.getElmById(parentsID);
    }

    return {
      element,
      parent,

      branches: {
        siblings,
        parents,
      },
    };
  }
}

export default (function createStoreInstance() {
  const store = new DnDStoreImp();

  return store;
})();
