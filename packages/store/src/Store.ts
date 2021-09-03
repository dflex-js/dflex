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

class Store<T = ElmWithPointerWithProps> implements StoreInterface<T> {
  registry: {
    [id: string]: T;
  };

  DOMGen: Generator;

  private lastKeyIdentifier: string | null;

  constructor() {
    this.lastKeyIdentifier = null;

    this.registry = {};

    this.DOMGen = new Generator();
  }

  /**
   * Create element and add it to registry.
   *
   * @param element - Element to be added to registry.
   * @param CustomInstance - Custom class to be used for element.
   * @param opts - Options to be passed to CustomInstance.
   */
  private submitElementToRegistry(
    element: ElmInstanceWithProps,
    CustomInstance?: Class<T>,
    opts?: {}
  ) {
    const { id, depth, ...rest } = element;

    const { order, keys } = this.DOMGen.getElmPointer(id, depth);

    const coreElement: ElmWithPointerWithProps = {
      id,
      order,
      keys,
      ...rest,
    };

    // TODO: fix TS error here.
    // @ts-ignore
    this.registry[id] =
      CustomInstance && typeof CustomInstance.constructor === "function"
        ? new CustomInstance(coreElement, opts)
        : coreElement;
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
    // Why using parentID?
    // Because it's impossible to know if this element belongs to the same
    // branch or not. Unless the input is strict and ask to register the parent
    // node which can't be done. To solve this, we use parentID to identify
    // elements belong to the same branch.
    // Another thing could be: but why not call the parent node from the DOM?
    // Well, it solves the issue temporarily. But it breaks the rule of DFlex:
    // Extensibility.
    if (element.parentId) {
      // This is the first element in the branch then.
      if (!this.lastKeyIdentifier) {
        this.lastKeyIdentifier = element.parentId;
        // Change means new branch.
      } else if (element.parentId !== this.lastKeyIdentifier) {
        // Create parent node to close the branch.
        this.submitElementToRegistry(
          {
            id: element.parentId,
            depth: element.depth + 1,
          },
          CustomInstance
        );
      }
    }

    this.submitElementToRegistry(element, CustomInstance, opts);
  }

  unregister(id: string) {
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
