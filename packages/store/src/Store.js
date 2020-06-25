import Generator from "@dflex/dom-gen/src";
import AbstractStore from "./AbstractStore";

/**
 * Store class contains all dnd elements and their orders.
 *
 * @extends {Generator}
 *
 */
class Store {
  constructor() {
    this.abstractStore = new AbstractStore();
    this.DOMGen = new Generator();
  }

  /**
   * Add elements to registry.
   *
   * @param {Object} elmInstance
   * @param {function} CustomInstance - constructor function.
   * @memberof Store
   */
  register(elmInstance, CustomInstance) {
    const { id, depth } = elmInstance;

    const pointer = this.DOMGen.getElmPointer(id, depth);

    const coreInstance = Object.assign(elmInstance, pointer);

    this.abstractStore.register(coreInstance, CustomInstance);
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
    const siblings = this.DOMGen.getElmBranch(sK);
    const parents = this.DOMGen.getElmBranch(pK);

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
