import Store from "@dflex/store/src";
import CoreInstance from "@dflex/core-instance/src";
import { ElmInstance } from "@dflex/store/src/pkgTypes";
import Tracker from "./Tracker";

import { ElmTree } from "./pkgTypes";

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

// eslint-disable-next-line func-names
export default (function () {
  const store = new DnDStoreImp();

  return store;
})();
