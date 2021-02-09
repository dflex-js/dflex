import Store from "@dflex/store/src";
import CoreInstance from "@dflex/core-instance/src";
import Tracker from "./Tracker";
import { ElmInstance } from "packages/store/src/Store";

// function noop() {}

// const handlers = ["onDragOver", "onDragLeave"];

class DnDStoreImp extends Store<CoreInstance> {
  tracker: typeof Tracker;

  /**
   *  Register DnD element.
   *
   * @param element
   */
  register(element: ElmInstance) {
    // const finalOpts = opts || {};

    // /**
    //  * Initiates available event handlers
    //  */
    // handlers.forEach((handler) => {
    //   if (typeof finalOpts[handler] !== "function") finalOpts[handler] = noop;
    // });

    this.tracker = new Tracker();
    super.register(element, CoreInstance);
  }

  /**
   * Reattach element reference.
   * This happens when element is unmounted from the screen and mounted again.
   *
   * @param id
   * @param elmRef
   */
  reattachElmRef(id: string, elmRef: HTMLElement) {
    super.registry[id].ref = elmRef;
  }

  /**
   * Detach element reference.
   * This happens when element is unmounted from the screen.
   *
   * @param id
   */
  detachElmRef(id: string) {
    this.registry[id].ref = null;
  }

  /**
   * Gets element connections instance for a given id.
   *
   * @param id
   */
  getElmTreeById(id: string) {
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
