/* eslint-disable no-unused-vars */
import { combineKeys } from "@dflex/utils";

const PREFIX_CONNECTOR_KEY = "dflex_ky_";
const PREFIX_SIBLINGS_KEY = "dflex_sk_";
const PREFIX_BRANCH_KEY = "dflex_bk_";

const uniqueKeysDev: Set<string> = new Set();
const equalKeysDev: Set<string> = new Set();

type Depth = number;

type ElmIndex = number;

type SiblingKey = string;

type ParentKey = string;

type ChildKey = string;

type BranchKey = string;

type ElmID = string;

type SKID = { SK: SiblingKey; id: ElmID };

/**
 * Element generated unique keys in DOM tree.
 */
export interface Keys {
  /** Siblings key - The main key. */
  SK: SiblingKey;
  /** Parent key. */
  PK: ParentKey;
  /** Children key. */
  CHK: ChildKey | null;
}

/**
 * Element order in its siblings & its parent.
 */
export interface Order {
  /** Self index in its siblings. */
  self: ElmIndex;
  /** Parent index in higher siblings. */
  parent: ElmIndex;
}

/**
 * Generated element pointer consists of keys and order.
 */
export interface Pointer {
  keys: Keys;
  order: Order;
}

export type Siblings = SiblingKey[];

export type SKCollection = SiblingKey[];

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
  private _siblingsCount!: Record<Depth, number>;

  private _branchIndicator!: number;

  /**
   * A collection of registered elements stored in arrays represents siblings in
   * each branch.
   */
  private _siblings!: Record<SiblingKey, Siblings>;

  /**
   * A collection of siblings keys stored belong to the same depth.
   * Horizontal scale.
   */
  private _SKByDepth!: Record<Depth, Siblings>;

  private _PKByDepth!: Record<Depth, ParentKey>;

  /**
   * A collection of siblings keys stored belong to the same branch.
   * Vertical scale.
   */
  private _SKByBranch!: Record<BranchKey, SKID[]>;

  /**
   * Preserve deleted SK for each branch.
   */
  private _branchDeletedSK!: BranchDeletedKeys;

  private _prevDepth!: number;

  private _prevPK!: string;

  constructor() {
    this._init();
  }

  private _init() {
    this._siblingsCount = {};
    this._branchIndicator = 0;
    this._siblings = {};
    this._SKByDepth = {};
    this._SKByBranch = {};
    this._PKByDepth = {};
    this._branchDeletedSK = null;
    this._prevDepth = -99;
    this._prevPK = `${PREFIX_CONNECTOR_KEY}${combineKeys(0, 0)}`;
  }

  private _addElmSKToDepthCollection(SK: string, depth: number): void {
    if (!Array.isArray(this._SKByDepth[depth])) {
      this._SKByDepth[depth] = [SK];

      return;
    }

    const is = this._SKByDepth[depth].find((k) => k === SK);

    if (!is) {
      this._SKByDepth[depth].push(SK);
    }
  }

  private _addElmIDToSiblings(id: string, SK: string): number {
    if (!Array.isArray(this._siblings[SK])) {
      this._siblings[SK] = [];
    }

    // @ts-ignore
    const selfIndex = this._siblings[SK].push(id) - 1;

    return selfIndex;
  }

  private _initIndicators(depth: number) {
    for (let i = depth; i <= depth + 2; i += 1) {
      if (this._siblingsCount[i] === undefined) {
        this._siblingsCount[i] = 0;
      }
    }
  }

  private _composeKeys(
    depth: number,
    id: string,
    hasSiblingInSameLevel = false
  ): Keys & { siblingsIndex: number } {
    const parentDepth = depth + 1;

    if (this._siblingsCount[parentDepth] === undefined) {
      this._initIndicators(depth);
    }

    const isNewBranch = depth < this._prevDepth;

    /**
     * Start new branch.
     */
    if (isNewBranch) {
      this._branchIndicator += 1;

      const until = hasSiblingInSameLevel ? depth : depth - 1;

      for (let i = 0; i <= until; i += 1) {
        this._siblingsCount[i] = 0;
      }
    }

    const BK = `${PREFIX_BRANCH_KEY}${this._branchIndicator}`;

    if (!Array.isArray(this._SKByBranch[BK])) {
      this._SKByBranch[BK] = [];
    }

    // If hasSiblingInSameLevel then don't increment.
    // Revers the accumulator.
    if (hasSiblingInSameLevel && this._siblingsCount[parentDepth] > 0) {
      this._siblingsCount[parentDepth] -= 1;
    }

    /**
     * Get sibling index.
     */
    const siblingsIndex = this._siblingsCount[parentDepth];

    /**
     * get siblings unique key (sK) and parents key (pK)
     */
    const SK = `${PREFIX_SIBLINGS_KEY}${combineKeys(depth, siblingsIndex)}`;

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

    const branchHasSK = this._SKByBranch[BK].find(({ SK: _ }) => _ === SK);

    if (!branchHasSK) {
      this._SKByBranch[BK].push({ SK, id });
    }

    if (hasSiblingInSameLevel) {
      const preBranchKey = `${PREFIX_BRANCH_KEY}${this._branchIndicator - 1}`;
      const preBranch = this._SKByBranch[preBranchKey];
      if (__DEV__) {
        if (!Array.isArray(preBranch)) {
          throw new Error(
            `_composeKeys: Unable to find the previous branch using key: ${preBranchKey}`
          );
        }
      }
      const preBranchLength = preBranch.length;
      const lastElm = preBranch[preBranchLength - 1];

      // If same level then the parent from previous branch is the same parent
      // for this element.
      this._SKByBranch[BK].push(lastElm);
    }

    if (__DEV__) {
      const uniqueSK = SK + siblingsIndex;

      // Assert uniqueness for new branches.
      if (isNewBranch) {
        if (uniqueKeysDev.has(uniqueSK)) {
          throw new Error(
            `SK: ${SK} with ${siblingsIndex} already exist.\n This combination supposed to be unique for each branch.`
          );
        }

        if (uniqueKeysDev.has(SK)) {
          throw new Error(
            `SK: ${SK} already exist.\n This combination supposed to be unique for each branch.`
          );
        }

        if (uniqueKeysDev.has(PK)) {
          throw new Error(
            `PK: ${PK} already exist.\n This combination supposed to be unique for each branch.`
          );
        }

        uniqueKeysDev.add(SK);
        uniqueKeysDev.add(uniqueSK);
        uniqueKeysDev.add(PK);
      } else if (depth === this._prevDepth) {
        // Assert equalities for the same depth.
        if (equalKeysDev.size === 0) {
          equalKeysDev.add(SK);
          equalKeysDev.add(uniqueSK);
          equalKeysDev.add(PK);
        }

        if (!equalKeysDev.has(uniqueSK)) {
          throw new Error(
            `SK: ${SK} with ${siblingsIndex} doesn't exist.\n This combination supposed to be identical for the same branch.`
          );
        }

        if (!equalKeysDev.has(SK)) {
          throw new Error(
            `SK: ${SK} doesn't exist.\n This combination supposed to be identical for the same branch.`
          );
        }

        if (!equalKeysDev.has(PK)) {
          throw new Error(
            `PK: ${PK} doesn't exist.\n This combination supposed to be identical for the same branch.`
          );
        }
      } else {
        equalKeysDev.clear();
      }
    }

    this._prevDepth = depth;

    this._siblingsCount[depth] += 1;

    return {
      siblingsIndex,
      CHK,
      SK,
      PK,
    };
  }

  private _composePointer(
    id: string,
    depth: number,
    keys: Keys,
    siblingsIndex: number
  ): Pointer {
    this._addElmSKToDepthCollection(keys.SK, depth);

    const selfIndex = this._addElmIDToSiblings(id, keys.SK);

    const order: Order = {
      self: selfIndex,
      parent: siblingsIndex,
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
    const { CHK, SK, PK, siblingsIndex } = this._composeKeys(
      depth,
      id,
      hasSiblingInSameLevel
    );

    const keys: Keys = {
      SK,
      PK,
      CHK,
    };

    return this._composePointer(id, depth, keys, siblingsIndex);
  }

  /**
   * Mutate a new siblings to the siblings root.
   *
   * @param SK - Siblings Key
   * @param siblings - new siblings to be added
   */
  mutateSiblings(SK: string, siblings: Siblings): void {
    if (SK in this._siblings) {
      Object.assign(this._siblings, { [SK]: siblings });
    } else if (__DEV__) {
      throw new Error(
        `updateELmBranch: Branch with key:${SK} is not registered.`
      );
    }
  }

  /**
   * Iterates throw all registered siblings.
   *
   * @param cb - callback function to be called for each element
   */
  forEachSibling(cb: (SK: string, branch: Siblings) => void) {
    Object.keys(this._siblings).forEach((SK) => {
      cb(SK, this._siblings[SK]);
    });
  }

  /**
   * Gets all SK(s) in the same depth.
   *
   * @param dp
   * @returns
   */
  getSiblingKeysByDepth(dp: number): SKCollection {
    return this._SKByDepth[dp] || [];
  }

  /**
   * Gets all element IDs in given node represented by sk.
   *
   * @param  SK - Siblings Key
   */
  getElmSiblingsByKey(SK: string): Siblings {
    return this._siblings[SK] || [];
  }

  getHighestSKInAllBranches(): Set<SKID> {
    const highestSKInAllBranches = new Set<SKID>();

    Object.keys(this._SKByBranch).forEach((BK) => {
      const l = this._SKByBranch[BK].length;
      const lastElm = this._SKByBranch[BK][l - 1];
      highestSKInAllBranches.add(lastElm);
    });

    return highestSKInAllBranches;
  }

  private _isSKDeleted(SK: SiblingKey): boolean {
    const dlKys = this._branchDeletedSK;

    return dlKys!! && dlKys.has(SK);
  }

  getBranchDeletedKeys(PK: string, parentIndex: number): Keys | null {
    const k = PK + parentIndex;

    const dlKys = this._branchDeletedSK;

    if (this._isSKDeleted(PK)) {
      return dlKys!.get(k) || null;
    }

    return null;
  }

  private _cleanupSKFromDepthCollection(SK: string): void {
    Object.keys(this._SKByDepth).forEach((dp) => {
      const dpNum = Number(dp);

      this._SKByDepth[dpNum] = this._SKByDepth[dpNum].filter((k) => k !== SK);

      if (this._SKByDepth[dpNum].length === 0) {
        delete this._SKByDepth[dpNum];
      }
    });
  }

  private _cleanupSKFromBranchCollection(SK: string): void {
    Object.keys(this._SKByBranch).forEach((BK) => {
      this._SKByBranch[BK] = this._SKByBranch[BK].filter((k) => k.SK !== SK);

      if (this._SKByBranch[BK].length === 0) {
        delete this._SKByBranch[BK];
      }
    });
  }

  /**
   * Removes entire siblings from root.
   *
   * @param SK - Sibling keys.
   * @param cb - Callback function.
   * @param deletedKeys - Deleted keys related to the siblings. Stored for time
   * travel later.
   * @returns
   */
  destroySiblings(
    SK: string,
    cb?: ((elmID: string) => void) | null,
    deletedKeys?: Keys,
    parentIndex?: number
  ): void {
    if (!this._siblings[SK]) {
      if (__DEV__) {
        throw new Error(
          `destroySiblings: You are trying to destroy nonexistence branch ${SK}`
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

    this._cleanupSKFromDepthCollection(SK);
    this._cleanupSKFromBranchCollection(SK);

    if (!deletedKeys) {
      return;
    }

    if (!this._branchDeletedSK) {
      this._branchDeletedSK = new Map();
    }

    this._branchDeletedSK.set(deletedKeys.PK + parentIndex, deletedKeys);
  }

  clear() {
    this._init();

    if (__DEV__) {
      uniqueKeysDev.clear();
      equalKeysDev.clear();
    }
  }
}

export default Generator;
