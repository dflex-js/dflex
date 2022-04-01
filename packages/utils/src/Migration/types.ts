export interface IAbstract {
  index: number;

  key: string;
}

export interface IMigration {
  /** Get the latest migrations instance */
  latest(): IAbstract;

  /**
   * We only update indexes considering migration definition when it happens
   * outside container but not moving inside it.
   * So we update an index but we add key.
   */
  setIndex(index: number): void;

  /** When migration from one container to another. */
  add(index: number, key: string): void;
}
