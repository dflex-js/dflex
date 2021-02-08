import Store from "@dflex/store/src/Storeeeeeeee";
import CoreInstance from "@dflex/core-instance/src";
import Tracker from "./Tracker";

// function noop() {}

// const handlers = ["onDragOver", "onDragLeave"];

/**
 * @typedef {Object} FullCoreElm - Element with essentials to be dragged.
 * @property {string} id
 * @property {number} depth
 * @property {HTMLElement} ref
 * @property {number} translateY
 * @property {number} translateX
 * @property {Function} transformElm
 */

class DnDStoreImp extends Store<CoreInstance> {
  /**
   * Register DnD element.
   *
   * @param {import("packages/store/src/Store").ElmInstance} element
   * @memberof DnDStoreImp
   * @override
   */
  register(element) {
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
   * @param {string} id
   * @param {HTMLElement} elmRef
   * @memberof Store
   */
  reattachElmRef(id, elmRef) {
    super.registry[id].ref = elmRef;
    super.registry[id].dd = "";
  }

  /**
   * Detach element reference.
   * This happens when element is unmounted from the screen.
   *
   * @param {string} id
   * @memberof Store
   */
  detachElmRef(id) {
    this.registry[id].ref = null;
  }

  /**
   * Gets element connections instance for a given id.
   *
   * @param {string} id
   * @returns {ElmTree}
   * @memberof Store
   */
  getElmTreeById(id) {
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
