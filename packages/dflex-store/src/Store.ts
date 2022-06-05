import Generator from "@dflex/dom-gen";

import { DFlexNode } from "@dflex/core-instance";
import type { IDFlexNode, INodeInput } from "@dflex/core-instance";

import type { RegisterInputSuper } from "./types";

class Store {
  registry: {
    [id: string]: IDFlexNode;
  };

  DOMGen: Generator;

  private _lastKeyIdentifier: string | null;

  constructor() {
    this._lastKeyIdentifier = null;

    this.registry = {};

    this.DOMGen = new Generator();
  }

  private _submitElementToRegistry(element: RegisterInputSuper) {
    const { id, depth, isPaused, isInitialized, readonly, ...rest } = element;

    const { order, keys } = this.DOMGen.register(id, depth);

    const coreElement: INodeInput = {
      id,
      order,
      keys,
      depth,
      readonly: !!readonly,
      ...rest,
    };

    this.registry[id] = new DFlexNode(coreElement, {
      isInitialized,
      isPaused,
    });
  }

  register(element: RegisterInputSuper) {
    /**
     * Using parentID, because it's impossible to know if this element belongs
     * to the same branch or not.
     */
    if (element.parentID) {
      // This is the first element in the branch then.
      if (!this._lastKeyIdentifier) {
        this._lastKeyIdentifier = element.parentID;
        // Change means new branch.
      } else if (element.parentID !== this._lastKeyIdentifier) {
        const { id, depth, ...rest } = element;
        // Create a fake parent node to close the branch.
        this._submitElementToRegistry({
          id: element.parentID,
          depth: depth + 1,
          ...rest,
        });
      }
    }

    this._submitElementToRegistry(element);
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

    this.DOMGen.destroy();
  }
}

export default Store;
