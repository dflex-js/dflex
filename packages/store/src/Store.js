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
   * @param {function} CustomInstance - constructor function.
   * @memberof Store
   */
  register(elmInstance, CustomInstance) {
    const type = Object.prototype.toString.call(elmInstance);

    let coreInstance = {};

    let id;
    let depth = 0;

    if (type === "[object Object]") {
      ({ id, depth } = elmInstance);

      const pointer = this.getElmPointer(id, depth);

      coreInstance = Object.assign(elmInstance, pointer);
    } else {
      id = elmInstance;
    }

    if (typeof CustomInstance === "function") {
      coreInstance = new CustomInstance(coreInstance);
    }

    if (id) this.registry[id] = coreInstance;
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
    const siblings = typeof keys === "object" ? this.getElmBranch(sK) : {};
    const parents = typeof keys === "object" ? this.getElmBranch(pK) : {};

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
