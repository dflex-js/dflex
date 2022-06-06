import Generator from "@dflex/dom-gen";

import { DFlexNode } from "@dflex/core-instance";
import type { IDFlexNode, DFlexBaseNodeInput } from "@dflex/core-instance";

import type { RegisterInputBase } from "./types";

class DFlexBaseStore {
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

  private _submitElementToRegistry(element: RegisterInputBase) {
    const { id, depth, isPaused, isInitialized, ...rest } = element;

    const { order, keys } = this.DOMGen.register(id, depth);

    const coreElement: DFlexBaseNodeInput = {
      id,
      order,
      keys,
      depth,
      ...rest,
    };

    this.registry[id] = new DFlexNode(coreElement, {
      isInitialized,
      isPaused,
    });
  }

  register(element: RegisterInputBase) {
    // If it's a new element or same branch.
    if (
      !this._lastKeyIdentifier ||
      element.parentID === this._lastKeyIdentifier
    ) {
      this._lastKeyIdentifier = element.parentID;

      this._submitElementToRegistry(element);

      return;
    }

    // A new branch.
    // Create a fake parent node to close the branch.
    const { id, depth, ...rest } = element;
    this._submitElementToRegistry({
      id: element.parentID,
      depth: depth + 1,
      ...rest,
    });

    this._submitElementToRegistry(element);
  }

  /**
   * Gets all element IDs Siblings in given node represented by sibling key.
   */
  getElmBranchByKey(SK: string) {
    return this.DOMGen.getElmBranch(SK);
  }

  unregister(id: string) {
    delete this.registry[id];
  }

  destroyBranch(SK: string) {
    this.DOMGen.destroyBranch(SK, (id) => {
      this.unregister(id);
    });
  }

  destroy() {
    Object.keys(this.DOMGen.branches).forEach((SK) => {
      this.DOMGen.destroyBranch(SK, (id) => {
        delete this.registry[id];
      });
    });

    this.DOMGen.destroy();
  }
}

export default DFlexBaseStore;
