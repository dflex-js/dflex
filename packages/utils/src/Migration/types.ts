import { IPointAxes, IPointNum } from "../Point";

export interface IAbstract {
  index: number;

  key: string;
}

export interface IMigration {
  /** False when migration transformation not completed yet. */
  isMigrationCompleted: boolean;

  /**
   * The space between the dragged element in the list and the second element.
   * Usage: This space equalizer used to create new element when migration is
   * completed.
   */
  elmSyntheticOffset: IPointAxes;

  /**
   * Preserve the last element position in the list .
   * Usage: Getting this position when the dragged is going back from the tail.
   */
  lastElmPosition: IPointNum;

  insertionTransform: IPointAxes;

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
  add(index: number, key: string, insertionTransform: IPointAxes): void;

  /** Get the migration done  */
  complete(firstElmPosition: IPointNum, lastElmPosition: IPointNum): void;
}
