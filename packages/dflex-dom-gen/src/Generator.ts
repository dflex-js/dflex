/* eslint-disable no-unused-vars */
import { combineKeys } from "@dflex/utils";
import type {
  IGenerator,
  Keys,
  Order,
  Pointer,
  ELmBranch,
  DeletedElmKeys,
} from "./types";

const PREFIX_SK = "dflex_Sk_";
const PREFIX_PK = "dflex_Pk_";
const PREFIX_BK = "dflex_Bk_";

/**
 * Generate keys to connect relations between DOM-elements depending on tree
 * depth.
 */
class Generator implements IGenerator {
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
    [SK: string]: ELmBranch;
  };

  /**
   * A collection of siblings keys stored belong to the same depth.
   * Horizontal scale.
   */
  private _SKByDepth: {
    [depth: number]: ELmBranch;
  };

  /**
   * A collection of siblings keys stored belong to the same branch.
   * Vertical scale.
   */
  private _SKByBranch: {
    [BK: string]: ELmBranch;
  };

  branchDeletedKeys: Map<string, Keys & { parentIndex: number }> | null;

  private _prevDepth: number;

  private _prevSK: string;

  constructor() {
    this._depthIndicator = {};
    this._branchIndicator = 0;
    this._siblings = {};
    this._SKByDepth = {};
    this._SKByBranch = {};
    this.branchDeletedKeys = null;
    this._prevDepth = NaN;
    this._prevSK = `${PREFIX_SK}${combineKeys(0, 0)}`;
  }

  /**
   * Initiates self and parent indicators if not.
   *
   * @param dp - element depth
   */
  private _initIndicators(dp: number) {
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

  private _addElementIDToDepthCollection(SK: string, depth: number) {
    if (!Array.isArray(this._SKByDepth[depth])) {
      this._SKByDepth[depth] = [SK];

      return;
    }

    const is = this._SKByDepth[depth].find((k) => k === SK);

    if (!is) {
      this._SKByDepth[depth].push(SK);
    }
  }

  /**
   * Adds elements to its siblings.
   *
   * @param id - element id.
   * @param  SK - Siblings Key.
   */
  private _addElementIDToSiblingsBranch(id: string, SK: string) {
    if (!Array.isArray(this._siblings[SK])) {
      this._siblings[SK] = [];
    }

    // @ts-ignore
    const selfIndex = this._siblings[SK].push(id) - 1;

    return selfIndex;
  }

  private _accumulateIndicators(depth: number, hasSiblingInSameLevel = false) {
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

  updateBranch(SK: string, branch: ELmBranch) {
    if (SK in this._siblings) {
      Object.assign(this._siblings, { [SK]: branch });
    } else if (__DEV__) {
      throw new Error(
        `updateELmBranch: Branch with key:${SK} is not registered.`
      );
    }
  }

  forEachBranch(cb: (SK: string, branch: ELmBranch) => void) {
    Object.keys(this._siblings).forEach((SK) => {
      cb(SK, this._siblings[SK]);
    });
  }

  private _composePointer(
    id: string,
    depth: number,
    keys: Keys,
    parentIndex: number
  ) {
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
      if (this.branchDeletedKeys === null) {
        throw new Error(
          "insertElmBtwLayers: branchDeletedKeys is not initiated yet."
        );
      }

      if (!this.branchDeletedKeys.has(PK)) {
        throw new Error(
          `insertElmBtwLayers: branchDeletedKeys doesn't have key: ${PK}. Check if this method has been invoked multiple times.`
        );
      }
    }

    const { parentIndex, ...keys } = this.branchDeletedKeys!.get(PK)!;

    return this._composePointer(id, depth, keys, parentIndex);
  }

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

  addElmIDToBranch(SK: string, id: string) {
    if (!Array.isArray(this._siblings[SK])) {
      if (__DEV__) {
        throw new Error(
          `addElmIDToBranch: You are trying to add an element to the branch with key:${SK} that is not registered at all.` +
            `You can call this method with existing branch. If you want to create a new branch, use register method.`
        );
      }

      return;
    }

    this._siblings[SK].push(id);
  }

  removeElmIDFromBranch(SK: string, id: string) {
    if (!Array.isArray(this._siblings[SK])) {
      if (__DEV__) {
        throw new Error(
          `removeElmIDFromBranch: Element with id: ${id} doesn't belong to any existing branch`
        );
      }

      return null;
    }

    const index = this._siblings[SK].findIndex((elmID) => elmID === id);

    if (index === -1) {
      if (__DEV__) {
        throw new Error(
          `removeElmIDFromBranch: Element with id: ${id} doesn't belong to branch: ${this._siblings[SK]}.`
        );
      }

      return null;
    }

    const [deletedElmID] = this._siblings[SK]!.splice(index, 1);

    if (this._siblings[SK]!.length === 0) {
      delete this._siblings[SK];
    }

    return deletedElmID;
  }

  getBranchByDepth(dp: number): ELmBranch {
    return this._SKByDepth[dp] || [];
  }

  getElmBranchByKey(SK: string): ELmBranch {
    return this._siblings[SK] || [];
  }

  destroyBranch(
    SK: string,
    cb?: ((elmID: string) => void) | null,
    deletedElmKeys?: DeletedElmKeys
  ) {
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

    if (!deletedElmKeys) {
      return;
    }

    if (!this.branchDeletedKeys) {
      this.branchDeletedKeys = new Map();
    }

    this.branchDeletedKeys.set(deletedElmKeys.PK, deletedElmKeys);
  }
}

export default Generator;
