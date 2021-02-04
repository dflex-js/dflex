/**
 * @typedef {Object} CoreInstance
 * @property {string} ElmInstance.id
 * @property {number} ElmInstance.depth
 * @property {HTMLElement} ElmInstance.element
 */

/**
 * This is the link (bridge) between the Store and element actions/classes.
 *
 *
 * @class AbstractCoreInstance
 */
class AbstractCoreInstance {
  /**
   * Creates an instance of AbstractCoreInstance.
   * @param {CoreInstance} coreInstance
   * @memberof AbstractCoreInstance
   */
  constructor({ element, id, pointer, ...rest }) {
    this.element = element;
    this.id = id;
    this.depth = depth;
  }
}

export default AbstractCoreInstance;
