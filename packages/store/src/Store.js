import Generator from "@dflex/dom-gen";

/**
 * Store class contains all dnd elements and their orders.
 *
 * @class Store
 * @extends {Generator}
 *
 */
class Store extends Generator {
  constructor() {
    super();

    /**
     * Store registered DOM nodes. Use id as key.
     */
    this.registry = {};
  }

  /**
   * Add elements to registry.
   *
   * @param {Object} elmInstance
   * @memberof Store
   */
  register(elmInstance) {
    const { id, depth } = elmInstance;

    const pointer = this.getElmPointer(id, depth);

    this.registry[id] = Object.assign(elmInstance, pointer);
  }

  /**
   * Gets element from registry by Id.
   *
   * @param {string} id
   * @returns {elmInstance} - elmInstance Object.
   * @memberof Store
   */
  getElmById(id) {
    return this.registry[id];
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
    const siblings = this.getElmBranch(sK);
    const parents = this.getElmBranch(pK);

    /**
     * getting parent instance
     */
    let parent = null;
    if (parents !== undefined) {
      const parentsID = parents[pi];
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
