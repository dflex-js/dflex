class AbstractCoreInstance {
  /**
   * @param {string} id
   * @param {node} elm
   */
  constructor({ id, element, ...rest }) {
    this.id = id;
    this.elm = element;

    Object.assign(this, rest);
  }
}

export default AbstractCoreInstance;
