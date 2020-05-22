/**
 * Store class contains all dnd elements and their orders.
 *
 * @class Store
 */
class Store {
  constructor() {
    /**
     * Store registered DOM nodes. Use id as key.
     */
    this.dflexStore = {};
  }

  /**
   * Set elements in dflexStore.
   *
   * @param {Object} elmInstance
   * @memberof Store
   */
  setELm(id, elmInstance) {
    this.dflexStore[id] = elmInstance;
  }

  /**
   * Gets element from dflexStore by Id.
   *
   * @param {string} id
   * @returns {elmInstance} - elmInstance Object.
   * @memberof Store
   */
  getElmById(id) {
    return this.dflexStore[id];
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
    const siblings = this.getListByKey(sK);
    const parents = this.getListByKey(pK);

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
