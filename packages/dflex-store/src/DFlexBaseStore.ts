import Generator from "@dflex/dom-gen";
import type { IGenerator } from "@dflex/dom-gen";

import { DFlexNode } from "@dflex/core-instance";
import type { IDFlexNode } from "@dflex/core-instance";

import type {
  RegisterInputBase,
  IDFlexBaseStore,
  DFlexNodeInput,
} from "./types";

class DFlexBaseStore implements IDFlexBaseStore {
  registry: Map<string, IDFlexNode>;

  interactiveDOM: Map<string, HTMLElement>;

  protected DOMGen: IGenerator;

  private _lastKeyIdentifier: string | null;

  constructor() {
    this._lastKeyIdentifier = null;
    this.registry = new Map();
    this.interactiveDOM = new Map();
    this.DOMGen = new Generator();
  }

  private _submitElementToRegistry(element: RegisterInputBase) {
    const { id, depth, ...rest } = element;

    const { order, keys } = this.DOMGen.register(id, depth);

    const coreElement: DFlexNodeInput = {
      id,
      order,
      keys,
      depth,
      ...rest,
    };

    this.registry.set(id, new DFlexNode(coreElement));
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

  getBranchesByDepth(dp: number) {
    return this.DOMGen.getBranchByDepth(dp);
  }

  updateBranch(SK: string, newOrder: string[]) {
    return this.DOMGen.updateBranch(SK, newOrder);
  }

  unregister(id: string) {
    this.registry.delete(id);
  }

  destroyBranch(SK: string) {
    this.DOMGen.destroyBranch(SK, (id) => {
      this.unregister(id);
    });
  }

  destroy() {
    this.DOMGen.forEachBranch((SK) => {
      this.DOMGen.destroyBranch(SK, (id) => {
        this.unregister(id);
      });
    });
  }
}

export default DFlexBaseStore;
