/* eslint-disable max-classes-per-file */

class AbstractDFlexCycle {
  /** Transitioning element ID. */
  id: string;

  /** Last known index for draggable before transitioning. */
  index: number;

  /** Transition siblings key. */
  SK: string;

  cycleID: string;

  hasScroll: boolean;

  numberOfTransformedELm: number;

  /** Defined during the transition. */
  marginBottom: number | null;

  /** Defined during the transition. */
  marginTop: number | null;

  constructor(
    index: number,
    id: string,
    SK: string,
    cycleID: string,
    hasScroll: boolean,
  ) {
    this.index = index;
    this.SK = SK;
    this.id = id;
    this.cycleID = cycleID;
    this.hasScroll = hasScroll;
    this.numberOfTransformedELm = 0;

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

  SKs: string[];

  /** Only true when transitioning. */
  isTransitioning!: boolean;

  constructor(
    index: number,
    id: string,
    SK: string,
    cycleID: string,
    hasScroll: boolean,
  ) {
    this._migrations = [
      new AbstractDFlexCycle(index, id, SK, cycleID, hasScroll),
    ];
    this.SKs = [SK];
    this.complete();
  }

  /** Get the latest migrations instance */
  latest(): AbstractDFlexCycle {
    return this._migrations[this._migrations.length - 1];
  }

  /** Get the previous migrations instance */
  prev(): AbstractDFlexCycle {
    return this._migrations[this._migrations.length - 2];
  }

  getAll(): AbstractDFlexCycle[] {
    return this._migrations;
  }

  /**
   * Get all cycles filtered by cycleI-IDs or element-IDs.
   *
   * @param cycleIDs
   * @param byCycleID
   * @returns
   */
  filter(cycleIDs: string[], byCycleID: boolean): AbstractDFlexCycle[] {
    return byCycleID
      ? this._migrations.filter((_) => cycleIDs.find((i) => i === _.cycleID))
      : this._migrations.filter((_) => cycleIDs.find((i) => i === _.id));
  }

  /**
   * Delete keys from the SKs array.
   *
   * @param keysToDelete - A set of keys to be deleted.
   */
  private _deleteKeysFromSKs(keysToDelete: Set<string>): void {
    this.SKs = this.SKs.filter((key) => !keysToDelete.has(key));
  }

  flush(cycleIDs: string[]): void {
    const removedKeys = new Set<string>();

    this._migrations = this._migrations.filter((_) => {
      const shouldDelete = cycleIDs.find((id) => {
        if (id === _.SK) {
          removedKeys.add(_.SK);

          return true;
        }

        return false;
      });

      if (shouldDelete === undefined) {
        return true;
      }

      if (removedKeys.has(_.SK)) {
        removedKeys.delete(_.SK);
      }

      return false;
    });

    this._deleteKeysFromSKs(removedKeys);
  }

  /**
   * We only update indexes considering migration definition when it happens
   * outside container but not moving inside it.
   * So we update an index but we add key.
   *
   * @param index
   */
  setIndex(index: number): void {
    this.latest().index = index;
    this.latest().numberOfTransformedELm += 1;
  }

  preserveVerticalMargin(type: "top" | "bottom", m: number | null): void {
    this.latest()[type === "bottom" ? "marginBottom" : "marginTop"] = m;
  }

  clearMargin(): void {
    this.latest().marginBottom = null;
    this.latest().marginTop = null;
  }

  /**
   * Add a new migration.
   *
   * @param index - The index of the migration.
   * @param id - The ID of the element.
   * @param SK - The sibling key.
   * @param isAddOperation - Indicates whether the operation is an "add" operation.
   * @param cycleID - The cycle ID.
   * @param hasScroll - Indicates whether the element has a scroll container.
   */
  add(
    index: number,
    id: string,
    SK: string,
    isAddOperation: boolean,
    cycleID: string,
    hasScroll: boolean,
  ): void {
    this._migrations.push(
      new AbstractDFlexCycle(index, id, SK, cycleID, hasScroll),
    );

    // The following logic ensures that addition operations are prioritized at
    // the beginning of the array, while removal operations are placed towards
    // the end. This arrangement ensures that when iterating through the array,
    // you start from the most recently added containers and proceed to those
    // containing omitted elements.

    if (isAddOperation) {
      // If it's an "add" operation, place the sibling key at the beginning of the SKs array.
      this.SKs.unshift(SK);
    } else {
      // If it's not an "add" operation (i.e., it's a "remove" operation),
      // append the sibling key to the end of the SKs array.
      this.SKs.push(SK);
    }
  }

  /**
   * start transitioning
   */
  start(): void {
    this.isTransitioning = true;
  }

  /**
   * Get the migration done
   */
  complete(): void {
    this.isTransitioning = false;

    this.preserveVerticalMargin("top", null);
    this.preserveVerticalMargin("bottom", null);
  }

  clear(): void {
    this._migrations = [];
    this.SKs = [];
  }
}

export type { AbstractDFlexCycle };
export default DFlexCycle;
