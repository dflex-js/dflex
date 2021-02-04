import Generator from "@dflex/dom-gen/src";
import AbstractStore from "./AbstractStore";
import Tracker from "./Tracker";

/**
 * @typedef {Object} ElmInstance
 * @property {string} ElmInstance.id
 * @property {number} ElmInstance.depth
 * @property {HTMLElement} ElmInstance.element
 */

/**
 * @typedef {new (object: any) => object} ConstructorFunc
 */

/**
 * Store class contains all dnd elements and their orders.
 *
 */
class Store {
  constructor() {
    this.abstractStore = new AbstractStore();
    this.DOMGen = new Generator();

    this.tracker = new Tracker();
  }

  /**
   * Reattach element reference.
   * This happens when element is unmounted from the screen and mounted again.
   * In this case, we need to reattach its reference and transform it to the
   * last know position.
   *
   * @param {string} id
   * @param {HTMLElement} elmRef
   * @memberof Store
   */
  reattachElmRef(id, elmRef) {
    this.abstractStore.registry[id].element = elmRef;
    // Preserves last changes.
    this.abstractStore.registry[id].transformElm();
  }

  /**
   * Detach element reference.
   * This happens when element is unmounted from the screen.
   *
   * @param {string} id
   * @memberof Store
   */
  detachElmRef(id) {
    this.abstractStore.registry[id].element = null;
  }

  /**
   * Clear element from the registry. Should be called only when element is
   * unmounted and expected to return with different positions only. Otherwise,
   * call `detachElmRef.`
   *
   * @param {string} id
   * @memberof Store
   */
  resetElm(id) {
    this.abstractStore.registry[id] = {
      id,
      depth: 0,
      element: null,
    };
  }

  /**
   * Add elements to registry.
   *
   * @param {ElmInstance} elmInstance
   * @param {ConstructorFunc} CustomInstance - Constructor Function.
   * @param {Object} opts - extra options to be stored in the registry.
   * @memberof Store
   */
  register(elmInstance, CustomInstance, opts) {
    const { id, depth } = elmInstance;

    /*
     * If element already exist in the store, then the reattach the reference.
     */
    if (this.abstractStore.registry[id]) {
      if (elmInstance.element) {
        this.reattachElmRef(id, elmInstance.element);
      }

      return;
    }

    const pointer = this.DOMGen.getElmPointer(id, depth);

    const coreInstance = Object.assign(elmInstance, pointer, opts);

    this.abstractStore.register(id, coreInstance, CustomInstance);
  }

  /**
   * Gets element from registry by Id.
   *
   * @param {string} id
   * @returns {elmInstance} - elmInstance Object.
   * @memberof Store
   */
  getElmById(id) {
    return this.abstractStore.getElmById(id);
  }

  /**
   * Gets all element IDs Siblings in given node represented by sibling key.
   *
   * @param {string} ky
   * @returns {string|Array<string>} - elements siblings list.
   * @memberof Store
   */
  getElmBranchByKey(ky) {
    return this.DOMGen.getElmBranch(ky);
  }

  /**
   * Gets element connections instance for a given id.
   *
   * @param {string} elmId
   *
   * @returns {Object}  connectObj
   * @returns {elmInstance} connectObj.element  - Targeted element.
   * @returns {elmInstance} connectObj.parent - Container element.
   * @returns {Object} connectObj.branches - Container element.
   * @returns {Array} branches.siblings - Array contains ids, siblings to element-id.
   * @returns {Array} branches.parents - Array contains ids, parents to element-id.
   *
   * @memberof Store
   */
  getElmTreeById(elmId) {
    const element = this.getElmById(elmId);

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

export default Store;
