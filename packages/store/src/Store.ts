import Generator from "@dflex/dom-gen";

import CoreInstance from "@dflex/core-instance";
import type { CoreInstanceInterface, CoreInput } from "@dflex/core-instance";

import type { RegisterInput } from "./types";

class Store {
  registry: {
    [id: string]: CoreInstanceInterface;
  };

  DOMGen: Generator;

  private lastKeyIdentifier: string | null;

  constructor() {
    this.lastKeyIdentifier = null;

    this.registry = {};

    this.DOMGen = new Generator();
  }

  private submitElementToRegistry(element: RegisterInput) {
    const { id, depth, isPaused, ...rest } = element;

    const { order, keys } = this.DOMGen.getElmPointer(id, depth);

    const coreElement: CoreInput = {
      id,
      order,
      keys,
      depth,
      ...rest,
    };

    this.registry[id] = new CoreInstance(coreElement, {
      isPaused,
    });
  }

  register(element: RegisterInput) {
    /**
     * Using parentID, because it's impossible to know if this element belongs
     * to the same branch or not.
     */
    if (element.parentID) {
      // This is the first element in the branch then.
      if (!this.lastKeyIdentifier) {
        this.lastKeyIdentifier = element.parentID;
        // Change means new branch.
      } else if (element.parentID !== this.lastKeyIdentifier) {
        const { id, depth, ...rest } = element;
        // Create a fake parent node to close the branch.
        this.submitElementToRegistry({
          id: element.parentID,
          depth: depth + 1,
          ...rest,
        });
      }
    }

    this.submitElementToRegistry(element);
  }

  /**
   * Gets all element IDs Siblings in given node represented by sibling key.
   *
   * @param siblingsKy -
   */
  getElmBranchByKey(siblingsKy: string) {
    return this.DOMGen.getElmBranch(siblingsKy);
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
}

export default Store;
