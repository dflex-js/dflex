import Generator from "@dflex/dom-gen/src";

/** @typedef {import("packages/dom-gen/src/Generator").Order} Order */
/** @typedef {import("packages/dom-gen/src/Generator").Keys} Keys */

/** @typedef {import("packages/coreInstance/src/AbstractCoreInstance").AbstractCoreElm} AbstractCoreElm */
/** @typedef {import("packages/coreInstance/src/CoreInstance").FullCoreElm} FullCoreElm */

/**
 * @typedef {Object} ElmInstance - Incoming element to registry.
 * @property {string} id
 * @property {number} depth
 * @property {HTMLElement} ref
 */

/**
 * @typedef {Object} ElmWIthPointer - Generated Pointer with Element instance.
 * @property {string} id
 * @property {number} depth
 * @property {HTMLElement?} ref
 * @property {Order} order
 * @property {Keys} keys
 */

/** @typedef {Object.<string, ElmWIthPointer|AbstractCoreElm|FullCoreElm>} Registry */

/**
 * @typedef {Object} ElmTree
 * @property {any} element
 * @property {any?} parent
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
    /** @type {Registry} */
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
    this.registry[id].ref = elmRef;
  }

  /**
   * Detach element reference.
   * This happens when element is unmounted from the screen.
   *
   * @param {string} id
   * @memberof Store
   */
  detachElmRef(id) {
    this.registry[id].ref = null;
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
   * @param {ElmInstance} element
   * @param {null|{new (coreElement:any) : any}} CustomInstance - Constructor Function.
   * @memberof Store
   */
  register(element, CustomInstance) {
    const { id, depth, ref } = element;

    if (!ref) return;

    const { order, keys } = this.DOMGen.getElmPointer(id, depth);

    const coreElement = { id, depth, ref, order, keys };

    this.registry[id] =
      CustomInstance && typeof CustomInstance.constructor === "function"
        ? new CustomInstance(coreElement)
        : coreElement;
  }

  /**
   * Gets element from registry by Id.
   *
   * @param {string} id
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
