export interface IAbstract {
  /** Last known index for draggable before transitioning. */
  index: number;
  /** Transition siblings key. */
  SK: string;
  /** Transition unique id. */
  id: string;

  marginTop: number | null;
  marginBottom: number | null;
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

  preserveVerticalMargin(type: "top" | "bottom", mb: number | null): void;

  clearMargins(): void;

  /**
   * Add new migration.
   */
  add(index: number, key: string, id: string): void;

  /** start transitioning. */
  start(): void;

  /** Get the migration done  */
  complete(): void;

  dispose(): void;
}
