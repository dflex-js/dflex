class AbstractCoreInstance {
  /**
   * This is the link between store and core element
   *
   * @param {string} id
   * @param {node} elm
   * @param {Object} rest
   */
  constructor({ element, ...rest }) {
    this.element = element;

    Object.assign(this, rest);
  }
}

export default AbstractCoreInstance;
