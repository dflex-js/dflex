/** @typedef {import("packages/dom-gen/src/Generator").Order} Order */
/** @typedef {import("packages/dom-gen/src/Generator").Keys} Keys */

/**
 * @typedef {Object} AbstractCoreElm - Element with essentials to be dragged.
 * @property {string} id
 * @property {number} depth
 * @property {HTMLElement} ref
 * @property {number} translateY
 * @property {number} translateX
 */

/** @typedef {import("packages/store/src/Store").ElmInstance} ElmInstance */

/**
 * This is the link (bridge) between the Store and element actions/classes.
 * Abstract is essential for Draggable & extended Store.
 *
 * @class AbstractCoreInstance
 */
class AbstractCoreInstance {
  /**
   * Creates an instance of AbstractCoreInstance.
   * @param {ElmInstance} element
   */
  constructor({ ref, id, depth }) {
    this.ref = ref;
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
