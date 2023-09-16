type SiblingKey = string;

type BranchKey = string;

type ElmID = string;

type Depth = number;

type BranchValue = { SK: SiblingKey; ids: ElmID[] };

function deleteIDfromSiblings(siblings: string[], id: string): string[] {
  const updatedSiblings = siblings.filter((existingId) => existingId !== id);

  return updatedSiblings;
}

class DOMKeysManager {
  private _idsBySk: Map<SiblingKey, ElmID[]>;

  private _SKByDepth: Map<Depth, SiblingKey[]>;

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

  getAllHighestSKs(): Set<{ SK: string; id: string }> {
    const allHighestSKs = new Set<{ SK: string; id: string }>();

    this._branchesRegistry.forEach((_, BK) => {
      const [, { SK, ids }] = this._getHighestDepthInBranch(BK)!;

      allHighestSKs.add({ SK, id: ids[0] });
    });

    return allHighestSKs;
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

  private _deleteBKfromPrevBKs(BK: BranchKey): void {
    const index = this._prevBKs.findIndex((prevBK) => prevBK === BK);

    if (index !== -1) {
      this._prevBKs.splice(index, 1);
    }
  }

  private _deleteSKFromDepth(SK: string, depth: number): void {
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

    if (this._SKByDepth.get(depth)!.length === 0) {
      this._SKByDepth.delete(depth);
      if (__DEV__) {
        // eslint-disable-next-line no-console
        console.log(`Deleted depth collection: ${depth}`);
      }
    }
  }

  private _deleteIDFromSks(SK: string, id: string): void {
    if (!this._idsBySk.has(SK)) {
      return;
    }

    const siblings = this._idsBySk.get(SK)!;

    const updatedSiblings = deleteIDfromSiblings(siblings, id);

    if (updatedSiblings.length === 0) {
      this._idsBySk.delete(SK);
    } else {
      this._idsBySk.set(SK, updatedSiblings);
    }
  }

  deleteIDFromBranch(BK: string, SK: string, depth: number, id: string): void {
    this._deleteIDFromSks(SK, id);

    if (!this._branchesRegistry.has(BK)) {
      if (__DEV__) {
        throw new Error(`Branch ${BK} is not registered in _branchesRegistry.`);
      }
    }

    const depthMap = this._branchesRegistry.get(BK)!;

    const deptVal = depthMap.get(depth)!;

    const updatedSiblings = deleteIDfromSiblings(deptVal.ids, id);

    if (updatedSiblings.length === 0) {
      depthMap.delete(depth);
    } else {
      depthMap.set(depth, { ids: updatedSiblings, SK: deptVal.SK });
    }
  }

  deleteSiblings(BK: string, SK: string, depth: number): void {
    if (!this._idsBySk.has(SK)) {
      return;
    }

    this._idsBySk.delete(SK);

    if (!this._branchesRegistry.has(BK)) {
      if (__DEV__) {
        throw new Error(`Branch ${BK} is not registered in _branchesRegistry.`);
      }

      return;
    }

    const depthMap = this._branchesRegistry.get(BK)!;

    for (let i = depth; i >= 0; i -= 1) {
      const deletedBranchValue = depthMap.delete(depth);

      this._deleteSKFromDepth(SK, depth);

      if (__DEV__) {
        if (!deletedBranchValue) {
          throw new Error(
            `Failed to delete branch value for depth ${depth} in branch key ${BK}`,
          );
        }
      }
    }

    if (this._branchesRegistry.get(BK)!.size === 0) {
      this._branchesRegistry.delete(BK);
      this._deleteBKfromPrevBKs(BK);

      if (__DEV__) {
        // eslint-disable-next-line no-console
        console.log(`Deleted Branch Registry: ${BK}`);
      }
    }

    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.log(`Deleted siblings: ${SK}`);
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
