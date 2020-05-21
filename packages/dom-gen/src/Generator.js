import genKey from "./utils";

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
     */
    this.indicator = {};

    /**
     * Store elements ids in order.
     * For example, by default, id-0 stored in iDsInOrder[0]=id-0, but after
     * transformed id-0, it is in iDsInOrder[3].
     *
     * This is an easy solution, to know elements order and update it
     * accordingly.
     */
    this.pointers = {};

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
    if (this.pointers[sK] === undefined) {
      this.pointers[sK] = id;
    } else {
      /**
       * So here we have multiple children, we better create an array now.
       */
      if (this.pointers[sK].constructor !== Array) {
        const prevId = this.pointers[sK];

        this.pointers[sK] = [];
        this.pointers[sK].push(prevId);
      }

      selfIndex = this.pointers[sK].push(id) - 1;
    }

    return selfIndex;
  }

  /**
   * Gets all element Siblings
   *
   * @param {string} sk - sibling key
   * @returns {string|Array}
   * @memberof Generator
   */
  getElmSiblings(sk) {
    return sk ? this.pointers[sk] : this.pointers;
  }

  /**
   * Main method.
   *
   * Add element to pointers.
   *
   * @param {string} id - element id
   * @param {number} depth - element depth
   * @returns object  { order, keys }
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

    const keys = {
      sK: siblingsKey,
      pK: parentKey,
      chK: depth === 0 ? null : childrenKey,
    };

    const order = {
      self: selfIndex,
      parent: parentIndex,
    };

    return { order, keys };
  }
}

export default Generator;
