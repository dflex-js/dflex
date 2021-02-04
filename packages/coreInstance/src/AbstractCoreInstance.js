/**
 * @typedef {Object} CoreInstance
 * @property {string} CoreInstance.id
 * @property {number} CoreInstance.depth
 * @property {HTMLElement} CoreInstance.element
 */

/**
 * This is the link (bridge) between the Store and element actions/classes.
 *
 *
 * @class AbstractCoreInstance
 * @deprecated
 */
class AbstractCoreInstance {
  /**
   * Creates an instance of AbstractCoreInstance.
   * @param {CoreInstance}
   * @memberof AbstractCoreInstance
   */
  constructor({ element, id, depth }) {
    this.element = element;
    this.id = id;
    this.depth = depth;
  }
}

export default AbstractCoreInstance;
