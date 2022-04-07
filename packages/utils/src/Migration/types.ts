import { IPointNum } from "../Point";

export interface IAbstract {
  index: number;

  key: string;
}

export interface IMigration {
  /** False when migration transformation not completed yet. */
  isMigrationCompleted: boolean;

  lastElmPosition: IPointNum;
  firstElmPosition: IPointNum;

  /** Get the latest migrations instance */
  latest(): IAbstract;

  /**
   * We only update indexes considering migration definition when it happens
   * outside container but not moving inside it.
   * So we update an index but we add key.
   */
  setIndex(index: number): void;

  /**
   * True when migration from one container to another.Otherwise false when
   * returning to the same container.
   */
  add(index: number, key: string): boolean;

  complete(firstElmPosition: IPointNum, lastElmPosition: IPointNum): void;
}
