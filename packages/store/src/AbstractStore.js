/**
 * @typedef {new (object: any) => object} ConstructorFunc
 */

/**
 *
 * @class AbstractStore
 */
class AbstractStore {
  /**
   * Creates an instance of AbstractStore.
   * @constructor
   * @memberof AbstractStore
   */
  constructor() {
    /** @type {Object.<string, Object>} */
    this.registry = {};
  }

  /**
   * Mutate elmInstance into CustomInstance then add the new object to registry
   * by id.
   *
   * @param {string} id
   * @param {ConstructorFunc} CustomInstance - Constructor Function.
   * @param {Object} elmInstance
   * @memberof AbstractStore
   */
  register(id, CustomInstance, elmInstance) {
    this.registry[id] =
      typeof CustomInstance.constructor === "function"
        ? new CustomInstance(elmInstance)
        : elmInstance;
  }

  /**
   * Gets element from registry by Id.
   *
   * @param {string} id
   * @returns {Object} coreInstance
   * @memberof AbstractStore
   */
  getElmById(id) {
    return this.registry[id];
  }
}

export default AbstractStore;
