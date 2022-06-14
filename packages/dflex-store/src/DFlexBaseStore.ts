import Generator from "@dflex/dom-gen";
import type { IGenerator } from "@dflex/dom-gen";

import { DFlexNode } from "@dflex/core-instance";
import type { IDFlexNode, DFlexBaseNodeInput } from "@dflex/core-instance";

import type { RegisterInputBase, IDFlexBaseStore } from "./types";

class DFlexBaseStore implements IDFlexBaseStore {
  registry: {
    [id: string]: IDFlexNode;
  };

  protected DOMGen: IGenerator;

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
    const { parentID, depth } = element;
    this.DOMGen.register(parentID, depth + 1);

    this._submitElementToRegistry(element);
  }

  getElmBranchByKey(SK: string) {
    return this.DOMGen.getElmBranchByKey(SK);
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
    this.DOMGen.forEachBranch((SK) => {
      this.DOMGen.destroyBranch(SK, (id) => {
        delete this.registry[id];
      });
    });
  }
}

export default DFlexBaseStore;
