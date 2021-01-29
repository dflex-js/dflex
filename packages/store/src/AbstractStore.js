class AbstractStore {
  constructor() {
    this.registry = {};
  }

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
   * @returns {Object} coreInstance
   * @memberof AbstractStore
   */
  getElmById(id) {
    return this.registry[id];
  }

  /**
   * Resets element reference and any associated properties.
   * Preserve element pointer. (id, depth, keys, order )
   *
   * @param {string} id
   * @memberof AbstractStore
   */
  resetElmById(id) {
    const { keys, order, depth } = this.registry[id];

    this.registry[id] = { id, depth, keys, order };
  }
}

export default AbstractStore;
