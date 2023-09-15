type SiblingKey = string;

type BranchKey = string;

type ElmID = string;

type Depth = number;

type BranchValue = { SK: SiblingKey; ids: ElmID[] };

class DOMKeysManager {
  private _idsBySk: Map<SiblingKey, ElmID[]>;

  private _SKByDepth: Map<Depth, ElmID[]>;

  private _branchesRegistry: Map<BranchKey, Map<Depth, BranchValue>>;

  private _prevBKs: BranchKey[];

  constructor() {
    this._idsBySk = new Map();
    this._SKByDepth = new Map();
    this._branchesRegistry = new Map();
    this._prevBKs = [];
  }

  private _addDToSiblings(SK: string, id: string): number {
    if (!this._idsBySk.has(SK)) {
      this._idsBySk.set(SK, []);
    }

    return this._idsBySk.get(SK)!.push(id) - 1;
  }

  private _upsertSKToDepth(depth: number, SK: string): void {
    if (!this._SKByDepth.has(depth)) {
      this._SKByDepth.set(depth, []);
    }

    const skList = this._SKByDepth.get(depth)!;

    const skExists = skList.some((existingSK) => existingSK === SK);

    if (!skExists) {
      skList.push(SK);
    }
  }

  private _upsertBK(BK: string): void {
    if (!this._prevBKs.some((prevBK) => prevBK === BK)) {
      this._prevBKs.push(BK);
    }
  }

  private _findLastNotMatchingBK(BK: string): string | null {
    for (let i = this._prevBKs.length - 1; i >= 0; i -= 1) {
      if (this._prevBKs[i] !== BK) {
        return this._prevBKs[i];
      }
    }

    return null;
  }

  private _getHighestDepthInBranch(BK: string): [Depth, BranchValue] | null {
    const depthMap = this._branchesRegistry.get(BK);

    if (!depthMap) {
      return null;
    }

    const highestDepth = Math.max(...depthMap.keys());

    const highestDepthValue = depthMap.get(highestDepth);

    if (!highestDepthValue) {
      return null;
    }

    return [highestDepth, highestDepthValue];
  }

  private _updateBranchValue(
    SK: string,
    BK: string,
    depth: number,
  ): BranchValue {
    const ids = this._idsBySk.get(SK)!;
    let branch = this._branchesRegistry.get(BK);

    if (!branch) {
      branch = new Map();
      this._branchesRegistry.set(BK, branch);
    }

    let branchValue = branch.get(depth);

    if (branchValue) {
      branchValue.ids = ids;
      branchValue.SK = SK;
    } else {
      branchValue = {
        ids,
        SK,
      };

      branch.set(depth, branchValue);
    }

    return branchValue;
  }

  private _shareParentFromPrevBranch(BK: BranchKey, latestDepth: number): void {
    const prevBK = this._findLastNotMatchingBK(BK);

    if (prevBK === null) {
      if (__DEV__) {
        throw new Error(
          `_shareParentFromPrevBranch: Unable to find the previous branch key. ` +
            `The previous branch key (_prevBK) is expected to have a valid value, ` +
            `but it is currently null.`,
        );
      }

      return;
    }

    const [prevDepth, prevValue] = this._getHighestDepthInBranch(prevBK)!;

    if (latestDepth + 1 !== prevDepth) {
      if (__DEV__) {
        if (latestDepth !== prevDepth) {
          throw new Error(
            "_shareParentFromPrevBranch: Unable to add new higher depth and share the container. " +
              "Both siblings must have the same highest depth " +
              "for this operation to be possible.",
          );
        }
      }
      return;
    }

    this._updateBranchValue(prevValue.SK, BK, prevDepth);
  }

  private _updateBranch(
    BK: string,
    SK: string,
    depth: number,
    hasSiblingInSameLevel: boolean,
  ): void {
    this._upsertBK(BK);

    this._updateBranchValue(SK, BK, depth);

    if (hasSiblingInSameLevel) {
      this._shareParentFromPrevBranch(BK, depth);
    }
  }

  protected registerKeys(
    id: string,
    SK: string,
    BK: string,
    depth: number,
    hasSiblingInSameLevel: boolean,
  ): number {
    this._upsertSKToDepth(depth, SK);

    const selfIndex = this._addDToSiblings(SK, id);

    this._updateBranch(BK, SK, depth, hasSiblingInSameLevel);

    return selfIndex;
  }

  protected deleteSiblings(SK: string): void {
    this._idsBySk.delete(SK);
  }

  protected hasSK(SK: string) {
    return this._idsBySk.has(SK);
  }

  mutateSiblings(SK: string, siblings: ElmID[]): void {
    if (this._idsBySk.has(SK)) {
      this._idsBySk.set(SK, siblings);
    } else if (__DEV__) {
      throw new Error(`Siblings with key ${SK} is not registered.`);
    }
  }

  getSiblingsByKey(SK: string): ElmID[] {
    return this._idsBySk.get(SK) || [];
  }

  getSKByDepth(dp: number): SiblingKey[] {
    return this._SKByDepth.get(dp) || [];
  }

  protected removeSKFromDepth(SK: string, depth: number): void {
    if (!this._SKByDepth.has(depth)) {
      if (__DEV__) {
        throw new Error(`Depth ${depth} is not registered in _SKByDepth.`);
      }

      return;
    }

    const skList = this._SKByDepth.get(depth)!;

    this._SKByDepth.set(
      depth,
      skList.filter((existingSK) => existingSK !== SK),
    );

    if (__DEV__) {
      if (this._SKByDepth.get(depth)!.length === 0) {
        // eslint-disable-next-line no-console
        console.log(`Deleted depth collection: ${depth}`);
      }
    }
  }

  destroy(): void {
    this._idsBySk.clear();
    this._SKByDepth.clear();
    this._branchesRegistry.clear();
    this._prevBKs = [];
  }
}

export default DOMKeysManager;