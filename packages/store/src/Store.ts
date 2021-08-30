/**
 * Copyright (c) Jalal Maskoun.
 *
 * This source code is licensed under the AGPL3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
import Generator from "@dflex/dom-gen";
import type { ELmBranch } from "@dflex/dom-gen";
import type {
  Class,
  ElmInstanceWithProps,
  ElmWithPointerWithProps,
  StoreInterface,
} from "./types";

class Store<T extends ElmWithPointerWithProps> implements StoreInterface<T> {
  registry: {
    [id: string]: T;
  };

  DOMGen: Generator;

  constructor() {
    this.registry = {};

    this.DOMGen = new Generator();
  }

  /**
   * Mutate elmInstance into CustomInstance then add the new object to registry
   * by id.
   *
   * @param element -
   * @param CustomInstance -
   */
  register(
    element: ElmInstanceWithProps,
    CustomInstance?: Class<T>,
    opts?: {}
  ) {
    const { id, depth, ...rest } = element;

    const { order, keys } = this.DOMGen.getElmPointer(id, depth);

    const coreElement: ElmWithPointerWithProps = { id, order, keys, ...rest };

    // TODO: fix TS error here.
    // @ts-ignore
    this.registry[id] =
      CustomInstance && typeof CustomInstance.constructor === "function"
        ? new CustomInstance(coreElement, opts)
        : coreElement;
  }

  unregister(id: string) {
    const {
      keys: { SK },
      order: { self },
    } = this.registry[id];

    this.DOMGen.removeElementIDFromBranch(SK, self);

    delete this.registry[id];
  }

  destroyBranch(branchKey: string) {
    this.DOMGen.destroyBranch(branchKey, (id) => {
      this.unregister(id);
    });
  }

  destroy() {
    Object.keys(this.DOMGen.branches).forEach((branchKey) => {
      this.DOMGen.destroyBranch(branchKey, (id) => {
        delete this.registry[id];
      });
    });

    this.DOMGen.clearBranchesAndIndicator();
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
