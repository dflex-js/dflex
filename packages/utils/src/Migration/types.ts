export interface IAbstract {
  index: number;

  key: string;
}

export interface IMigration {
  /** Get the latest migrations instance */
  latest(): IAbstract;

  /**
   * We only update indexes considering migration definition when it happens
   * outside container not moving inside it. So just index not key. If we have
   * new key then we use add.
   */
  setIndex(index: number): void;

  /** When migration from one container to another. */
  add(index: number, key: string): void;
}
