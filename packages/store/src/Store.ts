/**
 * Copyright (c) Jalal Maskoun.
 *
 * This source code is licensed under the AGPL3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
import Generator from "@dflex/dom-gen";
import type { ELmBranch } from "@dflex/dom-gen";
import type { Class, ElmInstance, ElmWIthPointer } from "./types";

class Store<T = ElmWIthPointer> {
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
   * unmounted and expected to return with different positions only.
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
  register(element: ElmInstance, CustomInstance?: Class<T>, opts?: {}) {
    const { id: idElm, depth = 0, ref } = element;

    if (!ref || ref.nodeType !== Node.ELEMENT_NODE) {
      throw new Error(
        `DFlex: Invalid HTMLElement: ${ref} is passed to registry`
      );
    }

    if (!idElm && !ref.id) {
      throw new Error(`DFlex: A valid and unique id is required.`);
    }

    const id = idElm || ref.id;

    const { order, keys } = this.DOMGen.getElmPointer(id, depth);

    const coreElement: ElmWIthPointer = { id, depth, ref, order, keys };

    // TODO: fix TS error here.
    // @ts-ignore
    this.registry[id] =
      CustomInstance && typeof CustomInstance.constructor === "function"
        ? new CustomInstance(coreElement, opts)
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
   * @param siblingsKy -
   */
  getElmBranchByKey(siblingsKy: string): ELmBranch {
    return this.DOMGen.getElmBranch(siblingsKy);
  }
}

export default Store;
