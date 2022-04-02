import type { GeneratorInterface, Keys, Order, Pointer } from "./types";
import genKey from "./utils";

/**
 * Generate keys to connect relations between DOM-elements depending on tree
 * depth.
 */
class Generator implements GeneratorInterface {
  /**
   * Counter store. Each depth has it's own indicator. Allowing us to go
   * for endless layers (levels).
   */
  #indicator: {
    [keys: number]: number;
  };

  /**
   * Store elements ids in order.
   * For example, by default, id-0 stored in iDsInOrder[0]=id-0, but after
   * transformed id-0, it is in iDsInOrder[3].
   *
   * This is an easy solution, to know elements order and update it
   * accordingly.
   */
  branches: {
    [keys: string]: string[];
  };

  /** Branches order */
  branchesOrder: string[];

  #prevDepth: number;

  #prevKey: string;

  constructor() {
    this.#indicator = {};

    this.branches = {};
    this.branchesOrder = [];

    this.#prevDepth = -99;

    this.#prevKey = genKey(0, 0);
  }

  /**
   * Initiates self and parent indicators if not.
   *
   * @param dp - element depth
   */
  #initIndicators(dp: number) {
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
    if (this.#indicator[dp] === undefined) {
      this.#indicator[dp] = -1;
    }

    /**
     * initiate parents from zero.
     * this.#indicator[dp+1] = 0
     */
    if (this.#indicator[dp + 1] === undefined) {
      this.#indicator[dp + 1] = 0;
    }

    if (this.#indicator[dp + 2] === undefined) {
      this.#indicator[dp + 2] = 0;
    }
  }

  #updateOrder(k: string) {
    const is = this.branchesOrder.find((key) => key === k);
    if (!is) {
      this.branchesOrder.push(k);
    }
  }

  getBranchParentKey(SK: string) {
    const keyOrder = this.branchesOrder.indexOf(SK);
    if (keyOrder + 1 <= this.branchesOrder.length) {
      return this.branchesOrder[keyOrder + 1];
    }
    return null;
  }

  /**
   * Adds elements to its siblings.
   *
   * @param id - element id
   * @param  SK - Siblings Key- siblings key
   */
  #addElementIDToSiblingsBranch(id: string, SK: string) {
    if (!Array.isArray(this.branches[SK])) {
      this.branches[SK] = [];
    }

    // @ts-ignore
    const selfIndex = this.branches[SK].push(id) - 1;

    return selfIndex;
  }

  /**
   * Gets all element IDs Siblings in given node represented by sk.
   *
   * @param  SK - Siblings Key
   */
  getElmBranch(SK: string): string[] {
    return this.branches[SK];
  }

  accumulateIndicators(depth: number) {
    if (depth !== this.#prevDepth) {
      this.#initIndicators(depth);
    }

    /**
     * Get parent index.
     */
    const parentIndex = this.#indicator[depth + 1];

    /**
     * get siblings unique key (sK) and parents key (pK)
     */
    const SK = genKey(depth, parentIndex);

    /**
     * Add key to the order.
     */
    this.#updateOrder(SK);

    const PK = genKey(depth + 1, this.#indicator[depth + 2]);

    const CHK = depth === 0 ? null : this.#prevKey;
    this.#prevKey = SK;

    this.#indicator[depth] += 1;

    if (depth < this.#prevDepth) {
      /**
       * Start new branch.
       */
      this.#indicator[0] = 0;
    }

    this.#prevDepth = depth;

    return {
      CHK,
      SK,
      PK,
      parentIndex,
    };
  }

  /**
   * register element to branches.
   *
   * @param id - element id
   * @param depth - element depth
   */
  register(id: string, depth: number): Pointer {
    const { CHK, SK, PK, parentIndex } = this.accumulateIndicators(depth);

    const selfIndex = this.#addElementIDToSiblingsBranch(id, SK);

    const keys: Keys = {
      SK,
      PK,
      CHK,
    };

    const order: Order = {
      self: selfIndex,
      parent: parentIndex,
    };

    return { order, keys };
  }

  removeElementIDFromBranch(SK: string, index: number) {
    let deletedElmID: string;

    if (
      Array.isArray(this.branches[SK]) &&
      this.branches[SK]![index] !== undefined
    ) {
      [deletedElmID] = (this.branches[SK] as []).splice(index, 1);

      if (this.branches[SK]!.length === 0) {
        delete this.branches[SK];
      }

      return deletedElmID;
    }

    return null;
  }

  // eslint-disable-next-line no-unused-vars
  destroyBranch(SK: string, cb: (elmID: string) => unknown) {
    if (!this.branches[SK]) return;

    const elmID = (this.branches[SK] as string[]).pop()!;

    cb(elmID);

    if (this.branches[SK]!.length > 0) {
      this.destroyBranch(SK, cb);
    } else {
      delete this.branches[SK];
    }

    this.branchesOrder = this.branchesOrder.filter((key) => key !== SK);
  }

  clearBranchesAndIndicator() {
    this.branches = {};
    this.#indicator = {};
    this.branchesOrder = [];
  }
}

export default Generator;
