import { combineKeys, featureFlags } from "@dflex/utils";

type SiblingKey = string;

type BranchKey = string;

type ElmID = string;

type Depth = number;

type BranchValue = { SK: SiblingKey; ids: ElmID[] };

function deleteElmFromArr(siblings: string[], id: string): string[] {
  const updatedSiblings = siblings.filter((existingId) => existingId !== id);

  return updatedSiblings;
}

function addToUniqueArray<T>(arr: T[], element: T): T[] {
  if (!arr.some((existingElement) => existingElement === element)) {
    arr.push(element);
  }

  return arr;
}

const PREFIX_BRANCH_KEY = "dflex_bk_";
const PREFIX_CONNECTOR_KEY = "dflex_ky_";
const PREFIX_SIBLINGS_KEY = "dflex_sk_";

class DOMKeysManager {
  private _idsBySk: Map<SiblingKey, ElmID[]>;

  private _SKByDepth: Map<Depth, SiblingKey[]>;

  private _branchesRegistry: Map<BranchKey, Map<Depth, BranchValue>>;

  private _prevBKs: BranchKey[];

  private _branchIndex: number;

  constructor() {
    this._idsBySk = new Map();
    this._SKByDepth = new Map();
    this._branchesRegistry = new Map();
    this._prevBKs = [];
    this._branchIndex = 0;
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

    addToUniqueArray<string>(skList, SK);
  }

  private _upsertBK(BK: string): void {
    addToUniqueArray<string>(this._prevBKs, BK);
  }

  private _findLastNotMatchingBK(BK: string): string | null {
    for (let i = this._prevBKs.length - 1; i >= 0; i -= 1) {
      if (this._prevBKs[i] !== BK) {
        return this._prevBKs[i];
      }
    }

    return null;
  }

  private _getHighestDepthInBranch(BK: string): [Depth, BranchValue] {
    const depthMap = this._branchesRegistry.get(BK)!;

    const highestDepth = depthMap.size - 1;

    const highestDepthValue = depthMap.get(highestDepth)!;

    return [highestDepth, highestDepthValue];
  }

  getTopLevelSKs(): Set<{ SK: string; id: string }> {
    const topLevelSKs = new Set<{ SK: string; id: string }>();

    this._branchesRegistry.forEach((_, BK) => {
      const [, { SK, ids }] = this._getHighestDepthInBranch(BK)!;

      topLevelSKs.add({ SK, id: ids[0] });
    });

    return topLevelSKs;
  }

  protected constructBK(isNewBranch: boolean): string {
    if (isNewBranch) {
      this._branchIndex += 1;
    }

    const BK = `${PREFIX_BRANCH_KEY}${this._branchIndex}`;

    return BK;
  }

  protected constructPK(parentDepth: number): string {
    const PK = `${PREFIX_CONNECTOR_KEY}${combineKeys(
      parentDepth,
      this._branchIndex,
    )}`;

    return PK;
  }

  // eslint-disable-next-line class-methods-use-this
  protected constructSK(depth: number, siblingsIndex: number): string {
    const SK = `${PREFIX_SIBLINGS_KEY}${combineKeys(depth, siblingsIndex)}`;

    return SK;
  }

  private _updateBranchValue(
    SK: string,
    BK: string,
    depth: number,
  ): BranchValue {
    let ids = this._idsBySk.get(SK)!;

    // If depth equals to zero then it's all siblings.
    // If not (meaning there are parent elements), then it's just the immediate parent.
    if (depth > 0) {
      // For non-zero depth, only include the immediate parent ID.
      ids = [ids[ids.length - 1]];
    }

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

  private _shareParentFromPrevBranch(BK: BranchKey, depth: number): void {
    const prevBK = this._findLastNotMatchingBK(BK);

    if (__DEV__) {
      if (prevBK === null) {
        throw new Error(
          `_shareParentFromPrevBranch: Unable to find the previous branch key. ` +
            `The previous branch key (_prevBK) is expected to have a valid value, ` +
            `but it is currently null.`,
        );
      }
    }

    const [prevDepth, prevValue] = this._getHighestDepthInBranch(prevBK!)!;

    // Sharing the same parent in DOM but it's not in the registry.
    if (depth + 1 !== prevDepth) {
      if (__DEV__) {
        if (depth !== prevDepth) {
          throw new Error(
            "_shareParentFromPrevBranch: Unable to add new higher depth and share the container. " +
              "Both siblings must have the same highest depth " +
              "for this operation to be possible.",
          );
        }
      }
      return;
    }

    // Update the current branch with previous values as they are shared.
    // Essentially, we're informing the current branch that it shares a parent
    // with the previous branch, so it should inherit the parent's values.
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

  private _deleteSKFromDepth(SK: string, depth: number): void {
    if (__DEV__) {
      if (!this._SKByDepth.has(depth)) {
        throw new Error(`Depth ${depth} is not registered in _SKByDepth.`);
      }
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
    if (__DEV__) {
      if (!this._idsBySk.has(SK)) {
        throw new Error(`SK ${SK} is not registered in _idsBySk.`);
      }
    }

    const siblings = this._idsBySk.get(SK)!;

    const updatedSiblings = deleteElmFromArr(siblings, id);

    if (updatedSiblings.length === 0) {
      this._idsBySk.delete(SK);
    } else {
      this._idsBySk.set(SK, updatedSiblings);
    }
  }

  deleteIDFromBranch(BK: string, SK: string, depth: number, id: string): void {
    this._deleteIDFromSks(SK, id);

    if (__DEV__) {
      if (!this._branchesRegistry.has(BK)) {
        throw new Error(`Branch ${BK} is not registered in _branchesRegistry.`);
      }
    }

    const depthMap = this._branchesRegistry.get(BK)!;

    const deptVal = depthMap.get(depth)!;

    const updatedSiblings = deleteElmFromArr(deptVal.ids, id);

    if (updatedSiblings.length === 0) {
      depthMap.delete(depth);
    } else {
      depthMap.set(depth, { ids: updatedSiblings, SK: deptVal.SK });
    }
  }

  deleteSiblings(BK: string, depth: number): void {
    const depthMap = this._branchesRegistry.get(BK)!;

    if (featureFlags.enableMutationDebugger) {
      // eslint-disable-next-line no-console
      console.log(`Branch ${BK} has`, new Map([...depthMap]));
    }

    for (let i = depth; i >= 0; i -= 1) {
      const { SK } = depthMap.get(i)!;

      this._deleteSKFromDepth(SK, i);
      this._idsBySk.delete(SK);

      const deletedBranchValue = depthMap.delete(i);

      if (__DEV__) {
        if (!deletedBranchValue) {
          throw new Error(
            `Failed to delete branch value for depth ${i} in branch key ${BK}`,
          );
        }
      }
    }

    if (this._branchesRegistry.get(BK)!.size === 0) {
      this._branchesRegistry.delete(BK);
      this._prevBKs = deleteElmFromArr(this._prevBKs, BK);

      if (__DEV__) {
        // eslint-disable-next-line no-console
        console.log(`Deleted Branch Registry: ${BK}`);
      }
    }
  }

  destroy(): void {
    this._idsBySk.clear();
    this._SKByDepth.clear();
    this._branchesRegistry.clear();
    this._prevBKs = [];
  }

  /**
   * Retrieves private keys for debugging purposes.
   *
   * @note This method will be removed in production builds.
   */
  _DEV_getPrivateKeys() {
    if (!__DEV__) {
      return undefined;
    }

    const idsBySk: { [key: string]: ElmID[] } = {};

    this._idsBySk.forEach((value, key) => {
      idsBySk[key] = value;
    });

    const branchesObject: {
      [key: string]: { [depth: number]: BranchValue };
    } = {};

    this._branchesRegistry.forEach((depthMap, branchKey) => {
      const depthObject: { [depth: number]: BranchValue } = {};

      depthMap.forEach((branchValue, depth) => {
        depthObject[depth] = branchValue;
      });

      branchesObject[branchKey] = depthObject;
    });

    const depthBySk: { [key: string]: SiblingKey[] } = {};

    this._SKByDepth.forEach((value, key) => {
      depthBySk[key] = value;
    });

    return {
      idsBySk,
      branchesRegistry: branchesObject,
      SKByDepth: depthBySk,
    };
  }
}

export default DOMKeysManager;
