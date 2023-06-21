/* eslint-disable max-classes-per-file */

class AbstractDFlexCycle {
  /** Transitioning element ID. */
  _id: string;

  /** Last known index for draggable before transitioning. */
  _index: number;

  /** Transition siblings key. */
  _SK: string;

  _cycleID: string;

  _hasScroll: boolean;

  _numberOfTransformedELm: number;

  /** Defined during the transition. */
  marginBottom: number | null;

  /** Defined during the transition. */
  marginTop: number | null;

  constructor(
    index: number,
    id: string,
    SK: string,
    cycleID: string,
    hasScroll: boolean
  ) {
    this._index = index;
    this._SK = SK;
    this._id = id;
    this._cycleID = cycleID;
    this._hasScroll = hasScroll;
    this._numberOfTransformedELm = 0;

    // TODO: Replace this with PointNum.
    this.marginBottom = null;
    this.marginTop = null;

    if (__DEV__) {
      Object.seal(this);
    }
  }
}

class DFlexCycle {
  private _migrations: AbstractDFlexCycle[];

  _containerKeys: Set<string>;

  /** Only true when transitioning. */
  _isTransitioning!: boolean;

  constructor(
    index: number,
    id: string,
    SK: string,
    cycleID: string,
    hasScroll: boolean
  ) {
    this._migrations = [
      new AbstractDFlexCycle(index, id, SK, cycleID, hasScroll),
    ];
    this._containerKeys = new Set([SK]);
    this._complete();
  }

  /** Get the latest migrations instance */
  _latest(): AbstractDFlexCycle {
    return this._migrations[this._migrations.length - 1];
  }

  /** Get the previous migrations instance */
  _prev(): AbstractDFlexCycle {
    return this._migrations[this._migrations.length - 2];
  }

  _getAll(): AbstractDFlexCycle[] {
    return this._migrations;
  }

  /**
   * Get all cycles filtered by cycleI-IDs or element-IDs.
   *
   * @param cycleIDs
   * @param byCycleID
   * @returns
   */
  _filter(cycleIDs: string[], byCycleID: boolean): AbstractDFlexCycle[] {
    return byCycleID
      ? this._migrations.filter((_) => cycleIDs.find((i) => i === _._cycleID))
      : this._migrations.filter((_) => cycleIDs.find((i) => i === _._id));
  }

  _flush(cycleIDs: string[]): void {
    const removedKeys = new Set<string>();

    this._migrations = this._migrations.filter((_) => {
      const shouldDelete = cycleIDs.find((id) => {
        if (id === _._SK) {
          removedKeys.add(_._SK);

          return true;
        }

        return false;
      });

      if (shouldDelete === undefined) {
        return true;
      }

      if (removedKeys.has(_._SK)) {
        removedKeys.delete(_._SK);
      }

      return false;
    });

    removedKeys.forEach((ky) => {
      this._containerKeys.delete(ky);
    });
  }

  /**
   * We only update indexes considering migration definition when it happens
   * outside container but not moving inside it.
   * So we update an index but we add key.
   *
   * @param index
   */
  _setIndex(index: number): void {
    this._latest()._index = index;
    this._latest()._numberOfTransformedELm += 1;
  }

  _preserveVerticalMargin(type: "top" | "bottom", m: number | null): void {
    this._latest()[type === "bottom" ? "marginBottom" : "marginTop"] = m;
  }

  _clearMargin(): void {
    this._latest().marginBottom = null;
    this._latest().marginTop = null;
  }

  /**
   * Add new migration.
   *
   * @param index
   * @param SK
   * @param cycleID
   * @param hasScroll
   */
  _add(
    index: number,
    id: string,
    SK: string,
    cycleID: string,
    hasScroll: boolean
  ): void {
    this._migrations.push(
      new AbstractDFlexCycle(index, id, SK, cycleID, hasScroll)
    );
    this._containerKeys.add(SK);
  }

  /**
   * start transitioning
   */
  _start(): void {
    this._isTransitioning = true;
  }

  /**
   * Get the migration done
   */
  _complete(): void {
    this._isTransitioning = false;

    this._preserveVerticalMargin("top", null);
    this._preserveVerticalMargin("bottom", null);
  }

  _clear(): void {
    this._migrations = [];
    this._containerKeys.clear();
  }
}

export type { AbstractDFlexCycle };
export default DFlexCycle;
