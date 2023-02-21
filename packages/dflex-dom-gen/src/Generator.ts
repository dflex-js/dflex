/* eslint-disable no-unused-vars */
import { combineKeys, featureFlags } from "@dflex/utils";

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
  BK: BranchKey;
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

type RestoreKey = {
  BK: string;
  PK: string;
};

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

  private _prevDepth!: number;

  private _prevPK!: string;

  private _preBK!: string | null;

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
    this._prevDepth = -99;
    this._preBK = null;
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

  private _insertLayer(
    depth: number,
    id: string,
    restoredKeys: RestoreKey,
    siblingsIndex: number
  ): Keys & { siblingsIndex: number } {
    const { BK, PK } = restoredKeys;

    const isNewLayer = BK !== this._preBK;
    this._preBK = BK;

    if (isNewLayer) {
      if (featureFlags.enableRegisterDebugger) {
        // eslint-disable-next-line no-console
        console.log(
          `_insertLayer: resetting siblings count for the new layer starting with id: ${id}`
        );
      }

      this._siblingsCount[depth] = 0;
    }

    /**
     * get siblings unique key (sK) and parents key (pK)
     */
    const SK = `${PREFIX_SIBLINGS_KEY}${combineKeys(depth, siblingsIndex)}`;

    let CHK: string | null = null;

    if (depth > 0) {
      CHK = this._prevPK;
    }

    if (isNewLayer) {
      if (__DEV__) {
        if (!Array.isArray(this._SKByBranch[BK])) {
          throw new Error(`_insertLayer: unable to find branch with BK ${BK}`);
        }

        if (!this._SKByBranch[BK][depth]) {
          throw new Error(
            `_insertLayer: unable to find element index ${depth} inside branch BK ${BK}`
          );
        }
      }

      this._SKByBranch[BK][depth] = { SK, id };
    }

    this._siblingsCount[depth] += 1;

    return {
      siblingsIndex,
      CHK,
      SK,
      PK,
      BK,
    };
  }

  private _composeKeys(
    depth: number,
    id: string,
    hasSiblingInSameLevel: boolean
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

      // If adding a new element will make the new branch ahead then ignore `hasSiblingInSameLevel`.
      // It's when two has the same parent but only `depth=0` is registered.
      // In this case, `depth=1` is shared but the registry doesn't' reach `depth=2`
      // where the shared parent is.
      if (preBranchLength === this._SKByBranch[BK].length + 1) {
        const lastElm = preBranch[preBranchLength - 1];

        // If same level then the parent from previous branch is the same parent
        // for this element.
        this._SKByBranch[BK].push(lastElm);
      } else if (__DEV__) {
        if (featureFlags.enableRegisterDebugger) {
          // eslint-disable-next-line no-console
          console.log(
            "_composeKeys: Ignore siblings with the same parent since the shared parent is not registered."
          );
        }
      }
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
      BK,
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

  /**
   * Registers element to branches.
   *
   * @param id
   * @param depth
   * @param hasSiblingInSameLevel
   * @returns
   */
  register(
    id: string,
    depth: number,
    hasSiblingInSameLevel: boolean,
    restoredKeys?: RestoreKey,
    restoredKeysSiblingsIndex?: number
  ): Pointer {
    const { CHK, SK, PK, BK, siblingsIndex } = restoredKeys
      ? this._insertLayer(depth, id, restoredKeys, restoredKeysSiblingsIndex!)
      : this._composeKeys(depth, id, hasSiblingInSameLevel);

    const keys: Keys = {
      CHK,
      SK,
      PK,
      BK,
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

  private _hasSK(SK: string) {
    if (__DEV__) {
      if (!Array.isArray(this._siblings[SK])) {
        throw new Error(`_hasSK: Siblings with SK ${SK} doesn't exist.`);
      }
    }

    return Array.isArray(this._siblings[SK]);
  }

  removeIDFromBranch(id: string, BK: string): void {
    if (__DEV__) {
      if (!Array.isArray(this._SKByBranch[BK])) {
        throw new Error(
          `removeIDFromBranch: Branch with SK ${BK} doesn't exist.`
        );
      }
    }

    this._SKByBranch[BK] = this._SKByBranch[BK].filter((k) => k.id !== id);
  }

  private _removeSKFromBranch(SK: string, BK: string): void {
    this._SKByBranch[BK] = this._SKByBranch[BK].filter((k) => k.SK !== SK);

    if (this._SKByBranch[BK].length === 0) {
      if (__DEV__) {
        // eslint-disable-next-line no-console
        console.log(`Deleted branch: ${BK}`);
      }
    }
  }

  private _removeSKFromDepth(SK: string, depth: number): void {
    this._SKByDepth[depth] = this._SKByDepth[depth].filter((k) => k !== SK);

    if (this._SKByDepth[depth].length === 0) {
      if (__DEV__) {
        // eslint-disable-next-line no-console
        console.log(`Deleted depth collection: ${depth}`);
      }
    }
  }

  /**
   * Removes entire siblings from root.
   *
   * @param SK - Sibling keys.
   * @param cb - Callback function.
   * @returns
   */
  destroySiblings(
    SK: string,
    BK: string,
    depth: number,
    cb?: ((elmID: string) => void) | null
  ): void {
    if (!this._hasSK(SK)) {
      return;
    }

    if (typeof cb === "function") {
      while (this._siblings[SK].length) {
        cb(this._siblings[SK].pop()!);
      }
    }

    delete this._siblings[SK];

    this._removeSKFromDepth(SK, depth);
    this._removeSKFromBranch(SK, BK);

    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.log(`Deleted siblings: ${SK}`);
    }
  }

  endRegistration() {
    this._preBK = null;
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
