import Generator from "@dflex/dom-gen/src";

export interface ElmInstance {
  id: string;
  depth: number;
  ref: HTMLElement;
}

export interface ElmWIthPointer {
  id: string;
  depth: number;
  order: any;
  keys: any;
}

type Class<T> = new (...args: any[]) => T;

// interface ElmTree {
//   id: string;
//   depth: number;
//   order: any;
//   keys: any;
// }

// /**
//  * @template T
//  * @typedef {Object} ElmTree
//  * @property {T | ElmWIthPointer} element
//  * @property {T | ElmWIthPointer?} parent
//  * @property {Object} branches
//  * @property {string | string[]} branches.siblings
//  * @property {string | string[]} branches.parents
//  */

class Store<T> {
  registry: {
    [id: string]: T;
  };

  DOMGen: Generator;

  constructor() {
    this.registry = {};

    this.DOMGen = new Generator();
  }

  /**
   * Delete element from the registry. Should be called only when element is
   * unmounted and expected to return with different positions only. Otherwise,
   * call `detachElmRef.`
   *
   * @param id
   */
  deleteElm(id: string) {
    const { [id]: oldRecord, ...rest } = this.registry;

    this.registry = rest;
  }

  /**
   * Mutate elmInstance into CustomInstance then add the new object to registry
   * by id.
   *
   * @param element
   * @param CustomInstance
   */
  register(element: ElmInstance, CustomInstance: Class<T>) {
    const { id, depth, ref } = element;

    if (!ref) return;

    const { order, keys } = this.DOMGen.getElmPointer(id, depth);

    const coreElement = { id, depth, ref, order, keys };

    this.registry[id] = new CustomInstance(coreElement);
  }

  /**
   * Gets element from registry by Id.
   *
   * @param id
   */
  getElmById(id: string) {
    return this.registry[id];
  }

  /**
   * Gets all element IDs Siblings in given node represented by sibling key.
   *
   * @param ky
   */
  getElmBranchByKey(ky: string): string | Array<string> {
    return this.DOMGen.getElmBranch(ky);
  }

  // /**
  //  * Gets element connections instance for a given id.
  //  *
  //  * @param {string} id
  //  * @param {Keys} keys
  //  * @param {Order} order
  //  * @returns {ElmTree<T>}
  //  * @memberof Store
  //  */
  // getElmTreeById(id, keys, order) {
  //   const element = this.getElmById(id);

  //   const { sK, pK } = keys;
  //   const { parent: pi } = order;

  //   /**
  //    * getting connected branches
  //    */
  //   const siblings = this.getElmBranchByKey(sK);
  //   const parents = this.getElmBranchByKey(pK);

  //   /**
  //    * getting parent instance
  //    */
  //   let parent = null;
  //   if (parents !== undefined) {
  //     const parentsID = Array.isArray(parents) ? parents[pi] : parents;
  //     parent = this.getElmById(parentsID);
  //   }

  //   return {
  //     element,
  //     parent,

  //     branches: {
  //       siblings,
  //       parents,
  //     },
  //   };
  // }
}

export default Store;
