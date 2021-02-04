/**
 * @typedef {Object} ElmInstance
 * @property {string} ElmInstance.id
 * @property {number} ElmInstance.depth
 * @property {HTMLElement} ElmInstance.element
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
    /** @type {Object.<string, ElmInstance>} */
    this.registry = {};
  }

  /**
   * Add elements to registry.
   *
   * @param {ElmInstance} elmInstance
   * @param {new (object: elmInstance) => ElmInstance} CustomInstance - constructor function.
   * @memberof AbstractStore
   */
  register(elmInstance, CustomInstance) {
    const { id } = elmInstance;

    this.registry[id] =
      typeof CustomInstance === "function"
        ? new CustomInstance(elmInstance)
        : elmInstance;
  }

  /**
   * Gets element from registry by Id.
   *
   * @param {string} id
   * @returns {ElmInstance} coreInstance
   * @memberof AbstractStore
   */
  getElmById(id) {
    return this.registry[id];
  }
}

export default AbstractStore;
