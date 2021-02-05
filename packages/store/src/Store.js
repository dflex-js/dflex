import Generator from "@dflex/dom-gen/src";

/** @typedef {import("packages/coreInstance/src/AbstractCoreInstance").ElmInstance} ElmInstance  */

/** @typedef {import("packages/dom-gen/src/Generator").Order} Order */
/** @typedef {import("packages/dom-gen/src/Generator").Keys} Keys */

/**
 * @typedef {Object} CoreElement - Element stored in registry without mutating
 * with external class.
 *
 * @property {string} id
 * @property {number} depth
 * @property {HTMLElement?} element
 * @property {Order} order
 * @property {Keys} keys
 */

/**
 * @typedef {Object} ElmTree
 * @property {CoreElement} element
 * @property {CoreElement?} parent
 * @property {Object} branches
 * @property {string | string[]} branches.siblings
 * @property {string | string[]} branches.parents
 */

/**
 *
 * @class Store
 */
class Store {
  /**
   * Creates an instance of Store.
   *
   * @constructor
   * @memberof Store
   */
  constructor() {
    /** @type {Object.<string, CoreElement>} */
    this.registry = {};

    this.DOMGen = new Generator();
  }

  /**
   * Reattach element reference.
   * This happens when element is unmounted from the screen and mounted again.
   *
   * @param {string} id
   * @param {HTMLElement} elmRef
   * @memberof Store
   */
  reattachElmRef(id, elmRef) {
    this.registry[id].element = elmRef;
  }

  /**
   * Detach element reference.
   * This happens when element is unmounted from the screen.
   *
   * @param {string} id
   * @memberof Store
   */
  detachElmRef(id) {
    this.registry[id].element = null;
  }

  /**
   * Delete element from the registry. Should be called only when element is
   * unmounted and expected to return with different positions only. Otherwise,
   * call `detachElmRef.`
   *
   * @param {string} id
   * @memberof Store
   */
  deleteElm(id) {
    const { [id]: oldRecord, ...rest } = this.registry;

    this.registry = rest;
  }

  /**
   * Mutate elmInstance into CustomInstance then add the new object to registry
   * by id.
   *
   * @param {ElmInstance} elmInstance
   * @param {null|{new (coreElement:any) : any}} CustomInstance - Constructor Function.
   * @memberof Store
   */
  register(elmInstance, CustomInstance) {
    const { id, depth, element } = elmInstance;

    if (!element) return;

    const { order, keys } = this.DOMGen.getElmPointer(id, depth);

    const coreElement = { id, depth, element, order, keys };

    this.registry[id] =
      CustomInstance && typeof CustomInstance.constructor === "function"
        ? new CustomInstance(coreElement)
        : coreElement;
  }

  /**
   * Gets element from registry by Id.
   *
   * @param {string} id
   * @returns {CoreElement} coreElement
   * @memberof Store
   */
  getElmById(id) {
    return this.registry[id];
  }

  /**
   * Gets all element IDs Siblings in given node represented by sibling key.
   *
   * @param {string} ky
   * @returns {string|Array<string>} - elements siblings list.
   * @memberof Store
   */
  getElmBranchByKey(ky) {
    return this.DOMGen.getElmBranch(ky);
  }

  /**
   * Gets element connections instance for a given id.
   *
   * @param {string} id
   * @returns {ElmTree}
   * @memberof Store
   */
  getElmTreeById(id) {
    const element = this.getElmById(id);

    const {
      keys: { sK, pK },
      order: { parent: pi },
    } = element;

    /**
     * getting connected branches
     */
    const siblings = this.getElmBranchByKey(sK);
    const parents = this.getElmBranchByKey(pK);

    /**
     * getting parent instance
     */
    let parent = null;
    if (parents !== undefined) {
      const parentsID = Array.isArray(parents) ? parents[pi] : parents;
      parent = this.getElmById(parentsID);
    }

    return {
      element,
      parent,

      branches: {
        siblings,
        parents,
      },
    };
  }
}

export default Store;
