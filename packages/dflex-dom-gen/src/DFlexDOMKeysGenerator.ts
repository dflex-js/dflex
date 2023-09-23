/* eslint-disable no-unused-vars */
import { featureFlags } from "@dflex/utils";
import DOMKeysManager from "./DFlexDOMKeysManager";

const uniqueKeysDev: Set<string> = new Set();
const equalKeysDev: Set<string> = new Set();

type Depth = number;

type ElmIndex = number;

type SiblingKey = string;

type ParentKey = string;

type ChildKey = string;

type BranchKey = string;

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

type RestoreKey = {
  BK: string;
  PK: string;
};

class DOMKeysGenerator extends DOMKeysManager {
  /**
   * Counter store. Each depth has it's own indicator. Allowing us to go
   * for endless layers (levels).
   */
  private _siblingsCount!: Record<Depth, number>;

  private _PKByDepth!: Record<Depth, ParentKey>;

  private _prevDepth!: number;

  private _prevPK!: string;

  private _preBK!: string | null;

  constructor() {
    super();
    this._preBK = this.constructPK(0);
    this._init();
  }

  private _init() {
    this._siblingsCount = {};
    this._PKByDepth = {};
    this._prevDepth = -99;
    this._preBK = null;
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
    siblingsIndex: number,
  ): Keys & { siblingsIndex: number } {
    const { BK, PK } = restoredKeys;

    const isNewLayer = BK !== this._preBK;
    this._preBK = BK;

    if (isNewLayer) {
      if (featureFlags.enableRegisterDebugger) {
        // eslint-disable-next-line no-console
        console.log(
          `_insertLayer: resetting siblings count for the new layer starting with id: ${id}`,
        );
      }

      this._siblingsCount[depth] = 0;
    }

    /**
     * get siblings unique key (sK) and parents key (pK)
     */
    const SK = this.constructSK(depth, depth);

    let CHK: string | null = null;

    if (depth > 0) {
      CHK = this._prevPK;
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
    hasSiblingInSameLevel: boolean,
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
      const until = hasSiblingInSameLevel ? depth : depth - 1;

      for (let i = 0; i <= until; i += 1) {
        this._siblingsCount[i] = 0;
      }
    }

    const BK = this.constructBK(isNewBranch);

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

    const SK = this.constructSK(depth, siblingsIndex);

    // Generate new one.
    let PK = this.constructPK(depth + 1);

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

    if (__DEV__) {
      const uniqueSK = SK + siblingsIndex;

      // Assert uniqueness for new branches.
      if (isNewBranch) {
        if (uniqueKeysDev.has(uniqueSK)) {
          // throw new Error(
          //   `SK: ${SK} with ${siblingsIndex} already exist.\n This combination supposed to be unique for each branch.`,
          // );
        }

        if (uniqueKeysDev.has(SK)) {
          // throw new Error(
          //   `SK: ${SK} already exist.\n This combination supposed to be unique for each branch.`,
          // );
        }

        if (uniqueKeysDev.has(PK)) {
          // throw new Error(
          //   `PK: ${PK} already exist.\n This combination supposed to be unique for each branch.`,
          // );
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
            `SK: ${SK} with ${siblingsIndex} doesn't exist.\n This combination supposed to be identical for the same branch.`,
          );
        }

        if (!equalKeysDev.has(SK)) {
          throw new Error(
            `SK: ${SK} doesn't exist.\n This combination supposed to be identical for the same branch.`,
          );
        }

        if (!equalKeysDev.has(PK)) {
          throw new Error(
            `PK: ${PK} doesn't exist.\n This combination supposed to be identical for the same branch.`,
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
    siblingsIndex: number,
    hasSiblingInSameLevel: boolean,
  ): Pointer {
    const { SK, BK } = keys;

    const selfIndex = this.registerKeys(
      id,
      SK,
      BK,
      depth,
      hasSiblingInSameLevel,
    );

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
    restoredKeysSiblingsIndex?: number,
  ): Pointer {
    const { CHK, SK, PK, BK, siblingsIndex } = restoredKeys
      ? this._insertLayer(depth, id, restoredKeys, restoredKeysSiblingsIndex!)
      : this._composeKeys(depth, hasSiblingInSameLevel);

    const keys: Keys = {
      CHK,
      SK,
      PK,
      BK,
    };

    return this._composePointer(
      id,
      depth,
      keys,
      siblingsIndex,
      hasSiblingInSameLevel,
    );
  }

  endRegistration() {
    this._preBK = null;
  }

  clear() {
    this._init();
    super.destroy();

    if (__DEV__) {
      uniqueKeysDev.clear();
      equalKeysDev.clear();
    }
  }
}

export default DOMKeysGenerator;
