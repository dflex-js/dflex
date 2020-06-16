class AbstractCoreInstance {
  /**
   * This is the link between store and core element
   *
   * @param {string} id
   * @param {node} elm
   * @param {Object} rest
   */
  constructor({ id, element, ...rest }) {
    this.id = id;
    this.elm = element;

    Object.assign(this, rest);
  }
}

export default AbstractCoreInstance;
