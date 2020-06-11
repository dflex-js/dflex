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
   * @memberof AbstractStore
   */
  getElmById(id) {
    return this.registry[id];
  }
}

export default AbstractStore;
