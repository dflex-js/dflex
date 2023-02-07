/* eslint-disable no-unused-vars */
import { combineKeys } from "@dflex/utils";

const PREFIX_CONNECTOR_KEY = "dflex_ky_";
const PREFIX_SIBLINGS_KEY = "dflex_sk_";
const PREFIX_BRANCH_KEY = "dflex_bk_";

const uniqueKeysDev: Set<string> = new Set();

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

export type SKCollection = string[];

export type BranchDeletedKeys = Map<string, Keys> | null;

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

  private _PKByDepth: {
    [depth: number]: string;
  };

  /**
   * A collection of siblings keys stored belong to the same branch.
   * Vertical scale.
   */
  private _SKByBranch: {
    [BK: string]: Siblings;
  };

  private _PKByDepth: {
    [depth: number]: string;
  };

  /**
   * Preserve deleted SK for each branch.
   */
  private _branchDeletedSK: BranchDeletedKeys;

  private _prevDepth: number;

  private _prevPK: string;

  constructor() {
    this._depthIndicator = {};
    this._branchIndicator = 0;
    this._siblings = {};
    this._SKByDepth = {};
    this._SKByBranch = {};
    this._PKByDepth = {};
    this._branchDeletedSK = null;
    this._prevDepth = -99;
    this._prevPK = `${PREFIX_CONNECTOR_KEY}${combineKeys(0, 0)}`;
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

  private _composeKeys(depth: number, hasSiblingInSameLevel = false): Keys {
    const isNewBranch = depth < this._prevDepth;

    /**
     * Start new branch.
     */
    if (isNewBranch) {
      this._depthIndicator[0] = 0;
      this._branchIndicator += 1;
    }

    const BK = `${PREFIX_BRANCH_KEY}${this._branchIndicator}`;

    if (!Array.isArray(this._SKByBranch[BK])) {
      this._SKByBranch[BK] = [];
    }

    /**
     * get siblings unique key (sK) and parents key (pK)
     */
    const SK = `${PREFIX_SIBLINGS_KEY}${combineKeys(
      depth,
      this._branchIndicator
    )}`;

    // Generate new one.
    let PK = `${PREFIX_CONNECTOR_KEY}${combineKeys(
      depth + 1,
      this._branchIndicator
    )}`;

    if (hasSiblingInSameLevel) {
      // Restore the parent key. So all siblings with shared parent have the
      // same key.
      PK = this._PKByDepth[depth];
    } else {
      // Store the new generated one
      this._PKByDepth[depth] = PK;
    }

    let CHK: string | null = null;

    if (depth > 0) {
      CHK = this._prevPK;
    }

    this._prevPK = PK;

    const branchHasSK = this._SKByBranch[BK].find((e) => e === SK);

    if (!branchHasSK) {
      this._SKByBranch[BK].push(SK);
    }

    if (hasSiblingInSameLevel) {
      const preBranchKey = `${PREFIX_BRANCH_KEY}${this._branchIndicator - 1}`;
      const preBranchLength = this._SKByBranch[preBranchKey].length;
      const lastElm = this._SKByBranch[preBranchKey][preBranchLength - 1];

      // If same level then the parent from previous branch is the same parent
      // for this element.
      this._SKByBranch[BK].push(lastElm);
    }

    this._prevDepth = depth;

    if (__DEV__) {
      if (isNewBranch) {
        if (uniqueKeysDev.has(SK)) {
          throw new Error(`SK: ${SK} already exist.`);
        }

        if (uniqueKeysDev.has(PK)) {
          throw new Error(`PK: ${PK} already exist.`);
        }

        uniqueKeysDev.add(SK);
        uniqueKeysDev.add(PK);
      }
    }

    return {
      CHK,
      SK,
      PK,
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

  insertElmBtwLayers(
    id: string,
    depth: number,
    PK: string,
    parentIndex: number
  ): Pointer {
    const k = PK + parentIndex;

    if (__DEV__) {
      if (this._branchDeletedSK === null) {
        throw new Error(
          "insertElmBtwLayers: branchDeletedKeys is not initiated yet."
        );
      }

      if (!this._branchDeletedSK.has(k)) {
        throw new Error(
          `insertElmBtwLayers: branchDeletedKeys doesn't have key: ${k}. Check if this method has been invoked multiple times.`
        );
      }
    }

    return this._composePointer(
      id,
      depth,
      this._branchDeletedSK!.get(k)!,
      parentIndex
    );
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
    const { CHK, SK, PK } = this._composeKeys(depth, hasSiblingInSameLevel);

    const keys: Keys = {
      SK,
      PK,
      CHK,
    };

    return this._composePointer(id, depth, keys, -99);
  }

  /**
   * Gets all branches key in the same depth.
   *
   * @param dp
   * @returns
   */
  getSKByDepth(dp: number): SKCollection {
    return this._SKByDepth[dp] || [];
  }

  /**
   *
   * @param BK
   * @returns
   */
  getSKByBranch(BK: string): SKCollection {
    return this._SKByBranch[BK] || [];
  }

  /**
   * Gets all element IDs in given node represented by sk.
   *
   * @param  SK - Siblings Key
   */
  getElmSiblingsByKey(SK: string): Siblings {
    return this._siblings[SK] || [];
  }

  getBranchDeletedKeys(PK: string, parentIndex: number): Keys | null {
    const k = PK + parentIndex;

    const dlKys = this._branchDeletedSK;

    if (dlKys && dlKys.has(k)) {
      return dlKys!.get(k) || null;
    }

    return null;
  }

  /**
   * Removes entire branch from registry.
   *
   * @param SK - Sibling keys.
   * @param cb - Callback function.
   * @param deletedKeys - Deleted keys related to the branch. Stored for time
   * travel later.
   * @returns
   */
  destroyBranch(
    SK: string,
    cb?: ((elmID: string) => void) | null,
    deletedKeys?: Keys,
    parentIndex?: number
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

    if (!deletedKeys) {
      return;
    }

    if (!this._branchDeletedSK) {
      this._branchDeletedSK = new Map();
    }

    this._branchDeletedSK.set(deletedKeys.PK + parentIndex, deletedKeys);
  }
}

export default Generator;
