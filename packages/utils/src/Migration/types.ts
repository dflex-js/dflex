import type { IPointAxes, IPointNum } from "../Point";
import type { RectDimensions } from "../types";

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

  insertionTransform: IPointAxes | null;

  insertionOffset: RectDimensions | null;

  /** Get the latest migrations instance */
  latest(): IAbstract;

  /** Get the previous migrations instance */
  prev(): IAbstract;

  /**
   * We only update indexes considering migration definition when it happens
   * outside container but not moving inside it.
   * So we update an index but we add key.
   */
  setIndex(index: number): void;

  /**
   * Add new migration.
   */
  add(
    index: number,
    key: string,
    insertionTransform: IPointAxes,
    insertionOffset: RectDimensions
  ): void;

  /** Get the migration done  */
  complete(lastElmPosition: IPointNum): void;
}
