class AbstractCoreInstance {
  /**
   * This is the link between store and core element
   *
   * @param {string} id
   * @param {node} elm
   * @param {Object} rest
   */
<<<<<<< HEAD
  constructor({ element, ...rest }) {
=======
  constructor({ id, element, ...rest }) {
    this.id = id;
>>>>>>> master
    this.element = element;

    Object.assign(this, rest);
  }
}

export default AbstractCoreInstance;
