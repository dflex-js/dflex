export interface IAbstract {
  index: number;
  SK: string;
  id: string;
}

export interface IMigration {
  /** Only true when transitioning. */
  readonly isTransitioning: boolean;

  /** Get the latest migrations instance */
  latest(): IAbstract;

  /** Get the previous migrations instance */
  prev(): IAbstract;

  getALlMigrations(): IAbstract[];

  /**
   * We only update indexes considering migration definition when it happens
   * outside container but not moving inside it.
   * So we update an index but we add key.
   */
  setIndex(index: number): void;

  /**
   * Add new migration.
   */
  add(index: number, key: string, id: string): void;

  /** start transitioning. */
  start(): void;

  /** Get the migration done  */
  complete(): void;
}
