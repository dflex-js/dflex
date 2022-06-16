import type { ELmBranch, Pointer } from "@dflex/dom-gen";

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
};

export type RegisterInputBase = DeepNonNullable<RegisterInputOpts>;

export type DFlexNodeInput = RegisterInputBase & Pointer;

/**
 * DFlex Base Store class interface.
 */
export interface IDFlexBaseStore {
  /**
   * Registers an element to the store.
   *
   * @param element - element to register
   * @returns
   */
  register(element: RegisterInputBase): void;

  /**
   * Gets all element IDs Siblings in given node represented by sibling key.
   *
   * @param SK - Siblings Key.
   * @returns
   */
  getElmBranchByKey(SK: string): ELmBranch;

  /**
   * Gets branches key belongs to the same depth.
   *
   * @param dp - depth.
   * @returns
   */
  getBranchesByDepth(dp: number): string[];

  /**
   * Removes an element from the store.
   *
   * @param id - element id.
   */
  unregister(id: string): void;

  /**
   * Destroys branch and all its related instances in the store. This method is
   * automatically `unregister(id)`.
   *
   * @param SK - Siblings Key.
   */
  destroyBranch(SK: string): void;

  /**
   * Destroys all branches and all their related instances in the store. This
   * method should be called when the app will no longer use the store.
   */
  destroy(): void;
}
