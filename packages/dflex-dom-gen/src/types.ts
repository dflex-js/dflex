/**
 * Element generated unique keys in DOM tree.
 */
export interface Keys {
  /** Siblings key - The main key. */
  SK: string;
  /** Parent key. */
  PK: string;
  /** Children key. */
  CHK: string | null;
}

/**
 * Element order in its branch & higher branch
 */
export interface Order {
  /** Self index in its branch. */
  self: number;
  /** Parent index in higher branch. */
  parent: number;
}

/**
 * Generated element pointer consists of keys and order.
 */
export interface Pointer {
  keys: Keys;
  order: Order;
}

export type ELmBranch = string[];

/**
 * DOM Generator class interface.
 */
export interface IGenerator {
  accumulateIndicators(
    depth: number,
    hasSiblingInSameLevel?: false
  ): Keys & {
    parentIndex: number;
  };

  /**
   * Update current branch.
   *
   * @param SK - Siblings Key
   * @param branch - new branch to be added
   */
  updateBranch(SK: string, branch: ELmBranch): void;

  /**
   * Iterates throw all registered branches.
   *
   * @param cb - callback function to be called for each element
   */
  forEachBranch(cb: (SK: string, branch: ELmBranch) => void): void;

  /**
   * Registers element to branches.
   *
   * @param id - element id
   * @param depth - element depth
   */
  register(id: string, depth: number, hasSiblingInSameLevel?: false): Pointer;

  /**
   * Removes element from its branch.
   *
   * @param SK - siblings key.
   * @param index - index of element in siblings array.
   * @returns
   */
  removeElmIDFromBranch(SK: string, index: number): string | null;

  /**
   * Adds element to existed branch.
   *
   * @param SK - siblings key.
   * @param id - element id.
   * @returns
   */
  addElmIDToBranch(SK: string, id: string): void;

  /**
   * Gets all branches key in the same depth.
   *
   * @param dp
   * @returns
   */
  getBranchByDepth(dp: number): ELmBranch;

  /**
   * Gets all element IDs in given node represented by sk.
   *
   * @param  SK - Siblings Key
   */
  getElmBranchByKey(SK: string): ELmBranch;

  /**
   * Removes entire branch from registry.
   *
   * @param SK - siblings key.
   * @param cb - callback function.
   */
  destroyBranch(SK: string, cb: (elmID: string) => void): void;
}
