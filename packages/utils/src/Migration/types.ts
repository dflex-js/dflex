export interface IAbstract {
  index: number;

  key: string;
}

export interface IMigration {
  migrations: Array<IAbstract>;
  latest(): IAbstract;
  setIndex(index: number): void;
  setKey(k: string): void;
}
