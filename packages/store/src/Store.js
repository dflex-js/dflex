import StoreCounters from "./StoresIndicators";

/**
 * Store class contains all dnd elements and their orders.
 *
 * @class Store
 * @extends {StoreCounters}
 */
class Store extends StoreCounters {
  constructor() {
    super();

    /**
     * Store all dnd elements parent and children alike. Using id as key.
     */
    this.dflexStore = {};
  }

  /**
   * Register elements in dflexStore and store its order.
   *
   * @param {Object}  { id, elem, depth = 0 }
   * @memberof Store
   */
  register({ elem, depth = 0 }) {
    const { id } = elem;

    const { indexes, keys } = this.addToOrderStore(id, depth);

    const coreInstance = new CoreInstance(id, elem, indexes, keys);

    /**
     * Add element to store.
     */
    this.dflexStore[id] = coreInstance;
  }

  /**
   * Gets element from dflexStore by Id.
   *
   * @param {string} id
   * @returns {CoreInstance} - CoreInstance Object.
   * @memberof Store
   */
  getElmById(id) {
    return this.dflexStore[id];
  }

  /**
   * Gets Array lists from elmOrder by key.
   *
   * @param {string} k
   * @returns  {Array} - Array contains ids in order.
   * @memberof Store
   */
  getListByKey(k) {
    return this.elmOrder[k];
  }

  /**
   * Sets new list for given key.
   *
   * @param {string} k - lst key in elmOrder
   * @param {Array} lst - new list
   * @memberof Store
   */
  setListByKey(k, lst) {
    this.elmOrder[k] = lst;
  }

  /**
   * Gets DndObj object form given id.
   *
   * @param {string} elmId
   *
   * @returns {Object}  DndObj
   * @returns {CoreInstance} DndObj.element  - dragged element
   * @returns {CoreInstance} DndObj.parent - Container element
   * @returns {Array} DndObj.siblingsList - Array contains ids, siblings to element-id
   * @returns {Array} DndObj.parentsList - Array contains ids, used to detect where dragged is going.
   *
   * @memberof Store
   */
  getDndObjById = (elmId) => {
    const element = this.getElmById(elmId);

    const {
      keys: { sK, pK },
      indexes: { parent: pi },
    } = element;

    const siblingsList = this.getListByKey(sK);
    const parentsList = this.getListByKey(pK);

    let parent;
    if (parentsList !== undefined) {
      const parentsID = parentsList[pi];
      parent = this.getElmById(parentsID);
    }

    return {
      element,
      parent,

      siblingsList,
      parentsList,
    };
  };
}

export default Store;
