/* eslint-disable no-unused-vars */
import { combineKeys } from "@dflex/utils";
import type { IGenerator, Keys, Order, Pointer, ELmBranch } from "./types";

/**
 * Generate keys to connect relations between DOM-elements depending on tree
 * depth.
 */
class Generator implements IGenerator {
  /**
   * Counter store. Each depth has it's own indicator. Allowing us to go
   * for endless layers (levels).
   */
  private _indicator: {
    [keys: number]: number;
  };

  /**
   * A collection of registered elements stored in arrays represents each
   * branch.
   */
  private _branches: {
    [keys: string]: ELmBranch;
  };

  private _branchesByDepth: {
    [depth: number]: ELmBranch;
  };

  private _prevDepth: number;

  private _prevKey: string;

  constructor() {
    this._indicator = {};
    this._branches = {};
    this._branchesByDepth = {};
    this._prevDepth = -99;
    this._prevKey = combineKeys(0, 0);
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
    if (this._indicator[dp] === undefined) {
      this._indicator[dp] = -1;
    }

    /**
     * initiate parents from zero.
     * this.#indicator[dp+1] = 0
     */
    if (this._indicator[dp + 1] === undefined) {
      this._indicator[dp + 1] = 0;
    }

    if (this._indicator[dp + 2] === undefined) {
      this._indicator[dp + 2] = 0;
    }
  }

  private _addElementIDToDepthCollection(SK: string, depth: number) {
    if (!Array.isArray(this._branchesByDepth[depth])) {
      this._branchesByDepth[depth] = [SK];

      return;
    }

    const is = this._branchesByDepth[depth].find((k) => k === SK);

    if (!is) {
      this._branchesByDepth[depth].push(SK);
    }
  }

  /**
   * Adds elements to its siblings.
   *
   * @param id - element id.
   * @param  SK - Siblings Key.
   */
  private _addElementIDToSiblingsBranch(id: string, SK: string) {
    if (!Array.isArray(this._branches[SK])) {
      this._branches[SK] = [];
    }

    // @ts-ignore
    const selfIndex = this._branches[SK].push(id) - 1;

    return selfIndex;
  }

  accumulateIndicators(depth: number, hasSiblingInSameLevel: boolean) {
    if (depth !== this._prevDepth) {
      this._initIndicators(depth);
    }

    // If hasSiblingInSameLevel then don't increment.
    // Revers the accumulator.
    if (hasSiblingInSameLevel && this._indicator[depth + 1] > 0) {
      this._indicator[depth + 1] -= 1;
    }

    /**
     * Get parent index.
     */
    const parentIndex = this._indicator[depth + 1];

    /**
     * get siblings unique key (sK) and parents key (pK)
     */
    const SK = combineKeys(depth, parentIndex);

    const PK = combineKeys(depth + 1, this._indicator[depth + 2]);

    const CHK = depth === 0 ? null : this._prevKey;

    this._prevKey = SK;

    this._indicator[depth] += 1;

    /**
     * Start new branch.
     */
    if (depth < this._prevDepth) {
      this._indicator[0] = 0;
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
    if (SK in this._branches) {
      Object.assign(this._branches, { [SK]: branch });
    } else if (__DEV__) {
      throw new Error(
        `updateELmBranch: Branch with key:${SK} is not registered.`
      );
    }
  }

  forEachBranch(cb: (SK: string, branch: ELmBranch) => void) {
    Object.keys(this._branches).forEach((SK) => {
      cb(SK, this._branches[SK]);
    });
  }

  register(id: string, depth: number, hasSiblingInSameLevel: boolean): Pointer {
    const { CHK, SK, PK, parentIndex } = this.accumulateIndicators(
      depth,
      hasSiblingInSameLevel
    );

    this._addElementIDToDepthCollection(SK, depth);

    const selfIndex = this._addElementIDToSiblingsBranch(id, SK);

    const keys: Keys = {
      SK,
      PK,
      CHK,
    };

    console.log("id", id, "dp", depth, "keys", keys);

    const order: Order = {
      self: selfIndex,
      parent: parentIndex,
    };

    return { order, keys };
  }

  addElmIDToBranch(SK: string, id: string) {
    if (!Array.isArray(this._branches[SK])) {
      if (__DEV__) {
        throw new Error(
          `addElmIDToBranch: You are trying to add an element to the branch with key:${SK} that is not registered at all.` +
            `You can call this method with existing branch. If you want to create a new branch, use register method.`
        );
      }

      return;
    }

    this._branches[SK].push(id);
  }

  getBranchByDepth(dp: number): ELmBranch {
    if (__DEV__) {
      if (!Array.isArray(this._branchesByDepth[dp])) {
        console.warn(
          `getBranchesByDepth: Depth ${dp} does not exist in the registry. Check your elements depth that was passed to the registry.`
        );
      }
    }
    return this._branchesByDepth[dp] || [];
  }

  getElmBranchByKey(SK: string): ELmBranch {
    return this._branches[SK] || [];
  }

  destroyBranch(SK: string, cb?: (elmID: string) => void) {
    if (!this._branches[SK]) {
      if (__DEV__) {
        throw new Error(
          `destroyBranch: You are trying to destroy nonexistence branch ${SK}`
        );
      }

      return;
    }

    if (cb) {
      while (this._branches[SK].length) {
        cb(this._branches[SK].pop()!);
      }
    }

    delete this._branches[SK];

    Object.keys(this._branchesByDepth).forEach((dp) => {
      const dpNum = Number(dp);
      this._branchesByDepth[dpNum] = this._branchesByDepth[dpNum].filter(
        (key) => key !== SK
      );

      if (this._branchesByDepth[dpNum].length === 0) {
        delete this._branchesByDepth[dpNum];
      }
    });
  }
}

export default Generator;
