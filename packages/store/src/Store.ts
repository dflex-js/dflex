import Generator, { ELmBranch } from "@dflex/dom-gen";

import { Class, ElmInstance, ElmWIthPointer } from "./interfaces";

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
   * @param id -
   */
  deleteElm(id: string) {
    const { [id]: oldRecord, ...rest } = this.registry;

    this.registry = rest;
  }

  /**
   * Mutate elmInstance into CustomInstance then add the new object to registry
   * by id.
   *
   * @param element -
   * @param CustomInstance -
   */
  register(element: ElmInstance, CustomInstance?: Class<T>) {
    const { id, depth, ref } = element;

    if (!ref) return;

    const { order, keys } = this.DOMGen.getElmPointer(id, depth);

    const coreElement: ElmWIthPointer = { id, depth, ref, order, keys };

    // @ts-ignore
    this.registry[id] =
      CustomInstance && typeof CustomInstance.constructor === "function"
        ? new CustomInstance(coreElement)
        : coreElement;
  }

  /**
   * Gets element from registry by Id.
   *
   * @param id -
   */
  getElmById(id: string) {
    return this.registry[id];
  }

  /**
   * Gets all element IDs Siblings in given node represented by sibling key.
   *
   * @param ky -
   */
  getElmBranchByKey(ky: string): ELmBranch {
    return this.DOMGen.getElmBranch(ky);
  }
}

export default Store;
