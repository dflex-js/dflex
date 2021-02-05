import genKey from "./utils";

/**
 * @typedef {Object} Keys
 * @property {string} sK - Siblings Key
 * @property {string} pK - Parent Key
 * @property {string|null} chK - Children Key
 */

/**
 * @typedef {Object} Order
 * @property {number} self
 * @property {number} parent
 */

/**
 * @typedef {Object} Pointer
 * @property {Keys} keys
 * @property {Order} order
 */

/**
 * Generate keys to connect relations between DOM-elements depending on tree
 * depth.
 *
 * @class Generator
 */
class Generator {
  constructor() {
    /**
     * Counter store. Each depth has it's own indicator. Allowing us to go
     * for endless layers (levels).
     *
     * @type {Object.<number, number>}
     */
    this.indicator = {};

    /**
     * Store elements ids in order.
     * For example, by default, id-0 stored in iDsInOrder[0]=id-0, but after
     * transformed id-0, it is in iDsInOrder[3].
     *
     * This is an easy solution, to know elements order and update it
     * accordingly.
     *
     * @type {Object.<string, Array<string>|string>}
     */
    this.branches = {};

    this.prevDepth = -99;

    this.prevKey = genKey(0, 0);
  }

  /**
   * Initiates self and parent indicators if not.
   *
   * @param {number} dp - element depth
   * @memberof Generator
   */
  initIndicators(dp) {
    /**
     * initiate self from -1 since self is incremented after the id is added so
     * it's children won't be confused about their parent indicator.
     *
     * if start from /dp = 1/
     * => this.indicator[1] = -1
     * => element added
     * =>  this.indicator[1] + 1
     * Now, If we get /dp = 0/
     * => this.indicator[dp+1] = 0 which is what we want.
     *
     * By adding this, we can deal with parents coming first before children.
     */
    if (this.indicator[dp] === undefined) {
      this.indicator[dp] = -1;
    }

    /**
     * initiate parents from zero.
     * this.indicator[dp+1] = 0
     */
    if (this.indicator[dp + 1] === undefined) {
      this.indicator[dp + 1] = 0;
    }

    if (this.indicator[dp + 2] === undefined) {
      this.indicator[dp + 2] = 0;
    }
  }

  /**
   * Checks if element has no siblings in the branch
   *
   * @param {string} sK -siblingsKey
   * @returns {Boolean}
   * @memberof Generator
   */
  isElmSingleton(sK) {
    return this.branches[sK].constructor !== Array;
  }

  /**
   * Adds elements to its siblings.
   *
   * @param {string} id - element id
   * @param {string} sK -siblingsKey
   * @returns element index in array.
   * @memberof Generator
   */
  addToSiblings(id, sK) {
    let selfIndex = 0;

    /**
     * Don't create array for only one child.
     */
    if (this.branches[sK] === undefined) {
      this.branches[sK] = id;
    } else {
      /**
       * So here we have multiple children, we better create an array now.
       */
      if (this.isElmSingleton(sK)) {
        const prevId = this.branches[sK];

        this.branches[sK] = [];
        // @ts-ignore
        this.branches[sK].push(prevId);
      }

      // @ts-ignore
      selfIndex = this.branches[sK].push(id) - 1;
    }

    return selfIndex;
  }

  /**
   * Gets all element IDs Siblings in given node represented by sk.
   *
   * @param {string} sk - sibling key
   * @returns {string|Array<string>}
   * @memberof Generator
   */
  getElmBranch(sk) {
    return this.branches[sk];
  }

  /**
   * Sets new branch for given key.
   *
   * @param {string} sK - sibling key
   * @param {string|Array<string>} branch - new branch
   * @memberof Generator
   */
  setElmBranch(sK, branch) {
    this.branches[sK] = branch;
  }

  /**
   * Main method.
   *
   * Add element to branches.
   *
   * @param {string} id - element id
   * @param {number} depth - element depth
   * @returns {Pointer} { order, keys }
   * @memberof Generator
   */
  getElmPointer(id, depth) {
    if (depth !== this.prevDepth) {
      this.initIndicators(depth);
    }

    /**
     * Get parent index.
     */
    const parentIndex = this.indicator[depth + 1];

    /**
     * get siblings unique key (sK) and parents key (pK)
     */
    const siblingsKey = genKey(depth, parentIndex);
    const parentKey = genKey(depth + 1, this.indicator[depth + 2]);

    const selfIndex = this.addToSiblings(id, siblingsKey);

    if (depth < this.prevDepth) {
      /**
       * Start new branch.
       */
      this.indicator[0] = 0;
    }

    this.prevDepth = depth;

    const childrenKey = this.prevKey;
    this.prevKey = siblingsKey;

    this.indicator[depth] += 1;

    /** @type {Keys} */
    const keys = {
      sK: siblingsKey,
      pK: parentKey,
      chK: depth === 0 ? null : childrenKey,
    };

    /** @type {Order} */
    const order = {
      self: selfIndex,
      parent: parentIndex,
    };

    return { order, keys };
  }
}

export default Generator;
