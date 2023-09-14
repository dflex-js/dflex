type SiblingKey = string;

type ElmID = string;

type Depth = number;

class DOMKeysManager {
  private _idsBySk: Map<SiblingKey, ElmID[]>;

  private _SKByDepth: Map<Depth, ElmID[]>;

  constructor() {
    this._idsBySk = new Map();
    this._SKByDepth = new Map();
  }

  protected addDToSiblings(SK: string, id: string): number {
    if (!this._idsBySk.has(SK)) {
      this._idsBySk.set(SK, []);
    }

    const siblings = this._idsBySk.get(SK)!;

    const selfIndex = siblings.push(id) - 1;

    return selfIndex;
  }

  protected _addSKToDepth(depth: number, SK: string): void {
    if (!this._SKByDepth.has(depth)) {
      this._SKByDepth.set(depth, []);
    }

    const skList = this._SKByDepth.get(depth)!;

    const skExists = skList.some((existingSK) => existingSK === SK);

    if (!skExists) {
      skList.push(SK);
    }
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

  protected _removeSKFromDepth(SK: string, depth: number): void {
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
      if (__DEV__) {
        // eslint-disable-next-line no-console
        console.log(`Deleted depth collection: ${depth}`);
      }
    }
  }

  destroy(): void {
    this._idsBySk.clear();
    this._SKByDepth.clear();
  }
}

export default DOMKeysManager;
