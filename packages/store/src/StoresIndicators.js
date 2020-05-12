/**
 * Generates unique key by combined depth with element current index.
 *
 * Ideally, each element should be connected with parent-id.
 * If we have element-id1, we should know who's the parent by parent-id.
 * But, currently this is not possible children render first. Instead,
 * we use counters combined with depth as parent-identifier. Vice-versa.
 *
 * @param {number} depth
 * @param {number} index
 * @returns {string} - unique key
 */
function genKey(dp, i) {
  return `${dp}-${i}`;
}

/**
 * Deals with elements distribution order.
 *
 * @class StoresIndicators
 */
class StoresIndicators {
  constructor() {
    /**
     * Counter store. Each depth has it's own counter. Allowing us to go
     * for endless layers (levels).
     */
    this.counter = {};

    /**
     * Store elements ids in order.
     * For example, by default, id-0 stored in iDsInOrder[0]=id-0, but after
     * transformed id-0, it is in iDsInOrder[3].
     *
     * This is an easy solution, to know elements order and update it
     * accordingly.
     */
    this.elmOrder = {};

    this.prevDepth = -99;

    this.prevKey = genKey(0, 0);
  }

  /**
   * Initiates self and parent counters if not.
   *
   * @param {number} dp - element depth
   * @memberof StoresIndicators
   */
  initCounters(dp) {
    /**
     * initiate self from -1 since self is incremented after the id is added so
     * it's children won't be confused about their parent counter.
     *
     * if start from /dp = 1/
     * => this.counter[1] = -1
     * => element added
     * =>  this.counter[1] + 1
     * Now, If we get /dp = 0/
     * => this.counter[dp+1] = 0 which is what we want.
     *
     * By adding this, we can deal with parents coming first before children.
     */
    if (this.counter[dp] === undefined) {
      this.counter[dp] = -1;
    }

    /**
     * initiate parents from zero.
     * this.counter[dp+1] = 0
     */
    if (this.counter[dp + 1] === undefined) {
      this.counter[dp + 1] = 0;
    }

    if (this.counter[dp + 2] === undefined) {
      this.counter[dp + 2] = 0;
    }
  }

  /**
   * Adds elements to its siblings.
   *
   * @param {string} id - element id
   * @param {string} sK -siblingsKey
   * @returns element index in array.
   * @memberof StoresIndicators
   */
  addToSiblings(id, sK) {
    let index = 0;

    /**
     * Don't create array for only one child.
     */
    if (this.elmOrder[sK] === undefined) {
      this.elmOrder[sK] = id;
    } else {
      /**
       * So here we have multiple children, we better create an array now.
       */
      if (this.elmOrder[sK].constructor !== Array) {
        const prevId = this.elmOrder[sK];

        this.elmOrder[sK] = [];
        this.elmOrder[sK].push(prevId);
      }

      index = this.elmOrder[sK].push(id) - 1;
    }

    return index;
  }

  /**
   * Add element to elmOrder
   *
   * @param {string} id - element id
   * @param {number} depth - element depth
   * @returns object  { indexes, keys }
   * @memberof StoresIndicators
   */
  addToOrderStore(id, depth) {
    if (depth !== this.prevDepth) {
      this.initCounters(depth);
    }

    /**
     * Get parent index.
     */
    const parentIndex = this.counter[depth + 1];

    /**
     * get siblings unique key (sK) and parents key (pK)
     */
    const siblingsKey = genKey(depth, parentIndex);
    const parentKey = genKey(depth + 1, this.counter[depth + 2]);

    const index = this.addToSiblings(id, siblingsKey);

    if (depth < this.prevDepth) {
      /**
       * Start new branch.
       */
      this.counter[0] = 0;
    }

    this.prevDepth = depth;

    const childrenKey = this.prevKey;
    this.prevKey = siblingsKey;

    this.counter[depth] += 1;

    const keys = {
      sK: siblingsKey,
      pK: parentKey,
      ...(depth !== 0 && { chK: childrenKey }),
    };

    const indexes = {
      self: index,
      parent: parentIndex,
    };

    return { indexes, keys };
  }
}

export default StoresIndicators;
