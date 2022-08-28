/* eslint-disable max-classes-per-file */

class AbstractMigration {
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

  constructor(index: number, SK: string, id: string, hasScroll: boolean) {
    this.index = index;
    this.SK = SK;
    this.cycleID = id;
    this.hasScroll = hasScroll;
    this.numberOfTransformedELm = 0;

    // TODO: Replace this with PointNum.
    this.marginBottom = null;
    this.marginTop = null;

    Object.seal(this);
  }
}

class Migration {
  private migrations: AbstractMigration[];

  /** Only true when transitioning. */
  isTransitioning!: boolean;

  constructor(index: number, SK: string, id: string, hasScroll: boolean) {
    this.migrations = [new AbstractMigration(index, SK, id, hasScroll)];
    this.complete();
  }

  /** Get the latest migrations instance */
  latest(): AbstractMigration {
    return this.migrations[this.migrations.length - 1];
  }

  /** Get the previous migrations instance */
  prev(): AbstractMigration {
    return this.migrations[this.migrations.length - 2];
  }

  getALlMigrations(): AbstractMigration[] {
    return this.migrations;
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

  clearMargins(): void {
    this.latest().marginBottom = null;
    this.latest().marginTop = null;
  }

  /**
   * Add new migration.
   *
   * @param index
   * @param key
   * @param id
   * @param hasScroll
   */
  add(index: number, key: string, id: string, hasScroll: boolean): void {
    this.migrations.push(new AbstractMigration(index, key, id, hasScroll));
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

  dispose(): void {
    this.migrations = [];
  }
}

export default Migration;
