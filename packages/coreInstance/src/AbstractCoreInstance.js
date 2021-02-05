/**
 * @typedef {Object} ElmInstance
 * @property {string} id
 * @property {number} depth
 * @property {HTMLElement} element
 */

/**
 * This is the link (bridge) between the Store and element actions/classes.
 * Abstract is essential for Draggable & extended Store.
 *
 * @class AbstractCoreInstance
 */
class AbstractCoreInstance {
  /**
   * Creates an instance of AbstractCoreInstance.
   * @param {ElmInstance} elemInstance
   */
  constructor({ element, id, depth }) {
    this.element = element;
    this.id = id;
    this.depth = depth;

    /**
     * Since element render once and being transformed later we keep the data
     * stored to navigate correctly.
     */
    this.translateY = 0;
    this.translateX = 0;
  }
}

export default AbstractCoreInstance;
