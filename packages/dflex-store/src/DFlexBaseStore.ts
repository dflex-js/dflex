import Generator from "@dflex/dom-gen";

import { DFlexNode, DFlexNodeInput } from "@dflex/core-instance";

// https://github.com/microsoft/TypeScript/issues/28374#issuecomment-536521051
type DeepNonNullable<T> = {
  [P in keyof T]-?: NonNullable<T[P]>;
};

/**
 * The options for the `register` method in DnD store.
 */
export type RegisterInputOpts = {
  /** Targeted element-id. */
  id: string;

  /** Parent element-id. Pass empty string if there's none. */
  parentID: string;

  /** The depth of targeted element starting from zero (The default value is zero).  */
  depth?: number;

  /**
   * True for elements that won't be transformed during DnD but belongs to the
   * same interactive container.
   * */
  readonly?: boolean;

  /**
   * The priority of initializing the element. If the element is expected to be
   * interacted immediately by the user it's recommended to be `high`.
   */
  priority?: "neutral" | "high";
};

export type RegisterInputBase = DeepNonNullable<
  Omit<RegisterInputOpts, "priority"> & {
    isInitialized: boolean;
  }
>;

type GetElmWithDOMOutput = [DFlexNode, HTMLElement];

class DFlexBaseStore {
  registry: Map<string, DFlexNode>;

  interactiveDOM: Map<string, HTMLElement>;

  protected DOMGen: Generator;

  private _lastKeyIdentifier: string | null;

  constructor() {
    this._lastKeyIdentifier = null;
    this.registry = new Map();
    this.interactiveDOM = new Map();
    this.DOMGen = new Generator();
  }

  private _submitElementToRegistry(element: RegisterInputBase) {
    const { id, depth, readonly, isInitialized } = element;

    const { order, keys } = this.DOMGen.register(id, depth);

    const coreElement: DFlexNodeInput = {
      id,
      order,
      keys,
      depth,
      readonly,
      isInitialized,
    };

    const elm = new DFlexNode(coreElement);

    this.registry.set(id, elm);

    if (isInitialized) {
      this.interactiveDOM.set(id, elm.attach()!);
    }
  }

  /**
   * Registers an element to the store.
   *
   * @param element - element to register
   * @returns
   */
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

  getElmWithDOM(id: string): GetElmWithDOMOutput {
    const elm = this.registry.get(id)!;
    const DOM = this.interactiveDOM.get(id)!;

    return [elm, DOM];
  }

  has(id: string): boolean {
    return this.interactiveDOM.has(id) && this.registry.has(id);
  }

  /**
   * Gets all element IDs Siblings in given node represented by sibling key.
   *
   * @param SK - Siblings Key.
   * @returns
   */
  getElmBranchByKey(SK: string) {
    return this.DOMGen.getElmBranchByKey(SK);
  }

  /**
   * Gets branches key belongs to the same depth.
   *
   * @param dp - depth.
   * @returns
   */
  getBranchesByDepth(dp: number) {
    return this.DOMGen.getBranchByDepth(dp);
  }

  /**
   * Mutates branch in the generated DOM tree.
   *
   * @param SK - Siblings Key.
   * @param newOrder
   */
  updateBranch(SK: string, newOrder: string[]) {
    return this.DOMGen.updateBranch(SK, newOrder);
  }

  /**
   * Removes an element from the store.
   *
   * @param id - element id.
   */
  unregister(id: string) {
    this.registry.delete(id);
  }

  /**
   * Destroys branch and all its related instances in the store. This method is
   * automatically `unregister(id)`.
   *
   * @param SK - Siblings Key.
   */
  destroyBranch(SK: string) {
    this.DOMGen.destroyBranch(SK, (id) => {
      this.unregister(id);
    });
  }

  /**
   * Destroys all branches and all their related instances in the store. This
   * method should be called when the app will no longer use the store.
   */
  destroy() {
    this.DOMGen.forEachBranch((SK) => {
      this.DOMGen.destroyBranch(SK, (id) => {
        this.unregister(id);
      });
    });
  }
}

export default DFlexBaseStore;
