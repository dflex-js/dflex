/* eslint-disable no-unused-vars */
import { combineKeys } from "@dflex/utils";

const PREFIX_SK = "dflex_Sk_";
const PREFIX_PK = "dflex_Pk_";
const PREFIX_BK = "dflex_Bk_";

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
 * Element order in its siblings & its parent.
 */
export interface Order {
  /** Self index in its siblings. */
  self: number;
  /** Parent index in higher siblings. */
  parent: number;
}

/**
 * Generated element pointer consists of keys and order.
 */
export interface Pointer {
  keys: Keys;
  order: Order;
}

export type Siblings = string[];

export type DeletedElmKeys = Keys & { parentIndex: number };

export type BranchDeletedKeys = Map<string, DeletedElmKeys> | null;

/**
 * Generate keys to connect relations between DOM-elements depending on tree
 * depth.
 */
class Generator {
  /**
   * Counter store. Each depth has it's own indicator. Allowing us to go
   * for endless layers (levels).
   */
  private _depthIndicator: {
    [keys: number]: number;
  };

  private _branchIndicator: number;

  /**
   * A collection of registered elements stored in arrays represents siblings in
   * each branch.
   */
  private _siblings: {
    [SK: string]: Siblings;
  };

  /**
   * A collection of siblings keys stored belong to the same depth.
   * Horizontal scale.
   */
  private _SKByDepth: {
    [depth: number]: Siblings;
  };

  /**
   * A collection of siblings keys stored belong to the same branch.
   * Vertical scale.
   */
  private _SKByBranch: {
    [BK: string]: Siblings;
  };

  /**
   * Preserve deleted SK for each branch.
   */
  private _branchDeletedSK: BranchDeletedKeys;

  private _prevDepth: number;

  private _prevSK: string;

  constructor() {
    this._depthIndicator = {};
    this._branchIndicator = 0;
    this._siblings = {};
    this._SKByDepth = {};
    this._SKByBranch = {};
    this._branchDeletedSK = null;
    this._prevDepth = NaN;
    this._prevSK = `${PREFIX_SK}${combineKeys(0, 0)}`;
  }

  /**
   * Initiates self and parent indicators if not.
   *
   * @param dp - element depth
   */
  private _initIndicators(dp: number): void {
    /**
     * initiate self from -1 since self is incremented after the id is added so
     * it's children won't be confused about their parent indicator.
     *
     * if start from /dp = 1/
     * - this.#indicator[1] = -1
     * - element added
     * -  this.#indicator[1] + 1
     * Now, If we get /dp = 0/
     * - this.#indicator[dp+1] = 0 which is what we want.
     *
     * By adding this, we can deal with parents coming first before children.
     */
    if (this._depthIndicator[dp] === undefined) {
      this._depthIndicator[dp] = -1;
    }

    /**
     * initiate parents from zero.
     * this.#indicator[dp+1] = 0
     */
    if (this._depthIndicator[dp + 1] === undefined) {
      this._depthIndicator[dp + 1] = 0;
    }

    if (this._depthIndicator[dp + 2] === undefined) {
      this._depthIndicator[dp + 2] = 0;
    }
  }

  private _addElementIDToDepthCollection(SK: string, depth: number): void {
    if (!Array.isArray(this._SKByDepth[depth])) {
      this._SKByDepth[depth] = [SK];

      return;
    }

    const is = this._SKByDepth[depth].find((k) => k === SK);

    if (!is) {
      this._SKByDepth[depth].push(SK);
    }
  }

  private _addElementIDToSiblingsBranch(id: string, SK: string): number {
    if (!Array.isArray(this._siblings[SK])) {
      this._siblings[SK] = [];
    }

    // @ts-ignore
    const selfIndex = this._siblings[SK].push(id) - 1;

    return selfIndex;
  }

  private _accumulateIndicators(
    depth: number,
    hasSiblingInSameLevel = false
  ): Keys & { parentIndex: number } {
    if (depth !== this._prevDepth) {
      this._initIndicators(depth);
    }

    // If hasSiblingInSameLevel then don't increment.
    // Revers the accumulator.
    if (hasSiblingInSameLevel && this._depthIndicator[depth + 1] > 0) {
      this._depthIndicator[depth + 1] -= 1;
    }

    /**
     * Get parent index.
     */
    const parentIndex = this._depthIndicator[depth + 1];

    /**
     * get siblings unique key (sK) and parents key (pK)
     */
    const SK = `${PREFIX_SK}${combineKeys(depth, parentIndex)}`;

    const PK = `${PREFIX_PK}${combineKeys(
      depth + 1,
      this._depthIndicator[depth + 2]
    )}`;

    const CHK = depth === 0 ? null : this._prevSK;

    this._prevSK = SK;

    this._depthIndicator[depth] += 1;

    /**
     * Start new branch.
     */
    if (depth < this._prevDepth) {
      this._depthIndicator[0] = 0;
      this._branchIndicator += 1;
    }

    const BK = `${PREFIX_BK}${this._branchIndicator}`;

    if (!Array.isArray(this._SKByBranch[BK])) {
      this._SKByBranch[BK] = [];
    }

    const branchHasSK = this._SKByBranch[BK].find((e) => e === SK);

    if (!branchHasSK) {
      this._SKByBranch[BK].push(SK);
    }

    this._prevDepth = depth;

    return {
      CHK,
      SK,
      PK,
      parentIndex,
    };
  }

  /**
   * Update current branch.
   *
   * @param SK - Siblings Key
   * @param branch - new branch to be added
   */
  updateBranch(SK: string, branch: Siblings): void {
    if (SK in this._siblings) {
      Object.assign(this._siblings, { [SK]: branch });
    } else if (__DEV__) {
      throw new Error(
        `updateELmBranch: Branch with key:${SK} is not registered.`
      );
    }
  }

  /**
   * Iterates throw all registered branches.
   *
   * @param cb - callback function to be called for each element
   */
  forEachBranch(cb: (SK: string, branch: Siblings) => void) {
    Object.keys(this._siblings).forEach((SK) => {
      cb(SK, this._siblings[SK]);
    });
  }

  private _composePointer(
    id: string,
    depth: number,
    keys: Keys,
    parentIndex: number
  ): Pointer {
    this._addElementIDToDepthCollection(keys.SK, depth);

    const selfIndex = this._addElementIDToSiblingsBranch(id, keys.SK);

    const order: Order = {
      self: selfIndex,
      parent: parentIndex,
    };

    return { order, keys };
  }

  insertElmBtwLayers(id: string, depth: number, PK: string): Pointer {
    if (__DEV__) {
      if (this._branchDeletedSK === null) {
        throw new Error(
          "insertElmBtwLayers: branchDeletedKeys is not initiated yet."
        );
      }

      if (!this._branchDeletedSK.has(PK)) {
        throw new Error(
          `insertElmBtwLayers: branchDeletedKeys doesn't have key: ${PK}. Check if this method has been invoked multiple times.`
        );
      }
    }

    const { parentIndex, ...keys } = this._branchDeletedSK!.get(PK)!;

    return this._composePointer(id, depth, keys, parentIndex);
  }

  /**
   * Registers element to branches.
   *
   * @param id
   * @param depth
   * @param hasSiblingInSameLevel
   * @returns
   */
  register(id: string, depth: number, hasSiblingInSameLevel = false): Pointer {
    const { CHK, SK, PK, parentIndex } = this._accumulateIndicators(
      depth,
      hasSiblingInSameLevel
    );

    const keys: Keys = {
      SK,
      PK,
      CHK,
    };

    return this._composePointer(id, depth, keys, parentIndex);
  }

  /**
   * Gets all branches key in the same depth.
   *
   * @param dp
   * @returns
   */
  getBranchByDepth(dp: number): Siblings {
    return this._SKByDepth[dp] || [];
  }

  /**
   * Gets all element IDs in given node represented by sk.
   *
   * @param  SK - Siblings Key
   */
  getElmBranchByKey(SK: string): Siblings {
    return this._siblings[SK] || [];
  }

  getBranchDeletedKeys(PK: string): DeletedElmKeys | null {
    const dlKys = this._branchDeletedSK;

    if (dlKys && dlKys.has(PK)) {
      return dlKys!.get(PK) || null;
    }

    return null;
  }

  /**
   * Removes entire branch from registry.
   *
   * @param SK - Sibling keys.
   * @param cb - Callback function.
   * @param deletedSK - Deleted keys related to the branch. Stored for time
   * travel later.
   * @returns
   */
  destroyBranch(
    SK: string,
    cb?: ((elmID: string) => void) | null,
    deletedSK?: DeletedElmKeys
  ): void {
    if (!this._siblings[SK]) {
      if (__DEV__) {
        throw new Error(
          `destroyBranch: You are trying to destroy nonexistence branch ${SK}`
        );
      }

      return;
    }

    if (typeof cb === "function") {
      while (this._siblings[SK].length) {
        cb(this._siblings[SK].pop()!);
      }
    }

    delete this._siblings[SK];

    Object.keys(this._SKByDepth).forEach((dp) => {
      const dpNum = Number(dp);
      this._SKByDepth[dpNum] = this._SKByDepth[dpNum].filter(
        (key) => key !== SK
      );

      if (this._SKByDepth[dpNum].length === 0) {
        delete this._SKByDepth[dpNum];
      }
    });

    if (!deletedSK) {
      return;
    }

    if (!this._branchDeletedSK) {
      this._branchDeletedSK = new Map();
    }

    this._branchDeletedSK.set(deletedSK.PK, deletedSK);
  }
}

export default Generator;
