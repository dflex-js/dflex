import type { IPointAxes, IPointNum } from "../Point";
import type { RectDimensions } from "../types";

export interface IAbstract {
  index: number;

  key: string;
}

export interface IMigration {
  /** Only true when transitioning. */
  readonly isTransitioning: boolean;

  /**
   * The space between the dragged element in the list and the second element.
   * Usage: This space equalizer used to create new element when migration is
   * completed.
   */
  readonly elmSyntheticOffset: IPointAxes;

  /**
   * Preserve the last element position in the list .
   * Usage: Getting this position when the dragged is going back from the tail.
   */
  readonly lastElmPosition: IPointNum;

  /**
   * Temporary placeholder for transformation destination.
   * Defined only when transitioning.
   */
  readonly insertionTransform: IPointAxes | null;

  /**
   * Temporary placeholder for the new insertion offset destination.
   * Defined only when transitioning.
   */
  readonly insertionOffset: RectDimensions | null;

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

  /** start transitioning. */
  start(): void;

  /** Get the migration done  */
  complete(lastElmPosition: IPointNum): void;
}
