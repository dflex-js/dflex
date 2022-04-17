import type { IPointAxes, IPointNum } from "../Point";

export interface IAbstract {
  index: number;

  key: string;
}

export interface IMigration {
  /** Only true when transitioning. */
  readonly isTransitioning: boolean;

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
  add(index: number, key: string, draggedTransition: IPointAxes): void;

  /** start transitioning. */
  start(): void;

  /** Get the migration done  */
  complete(lastElmPosition: IPointNum): void;
}
