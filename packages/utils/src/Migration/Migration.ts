/* eslint-disable max-classes-per-file */

import { IPointAxes, IPointNum, PointNum } from "../Point";

import type { RectDimensions } from "../types";
import type { IAbstract, IMigration } from "./types";

class AbstractMigration implements IAbstract {
  index: number;

  key: string;

  constructor(index: number, key: string) {
    this.index = index;
    this.key = key;
  }
}

class Migration implements IMigration {
  #migrations: Array<IAbstract>;

  readonly elmSyntheticOffset: IPointAxes;

  isCompleted!: boolean;

  lastElmPosition: IPointNum;

  insertionTransform!: IPointAxes | null;

  insertionOffset!: RectDimensions | null;

  constructor(
    index: number,
    key: string,
    elmSyntheticOffset: IPointAxes,
    lastElmPosition: IPointNum
  ) {
    this.#migrations = [new AbstractMigration(index, key)];
    this.elmSyntheticOffset = { ...elmSyntheticOffset };
    this.lastElmPosition = new PointNum(0, 0);
    this.complete(lastElmPosition);
  }

  latest() {
    return this.#migrations[this.#migrations.length - 1];
  }

  prev() {
    return this.#migrations[this.#migrations.length - 2];
  }

  setIndex(index: number) {
    this.latest().index = index;
  }

  add(
    index: number,
    key: string,
    insertionTransform: IPointAxes,
    insertionOffset: RectDimensions
  ) {
    this.#migrations.push(new AbstractMigration(index, key));

    this.insertionTransform = { ...insertionTransform };
    this.insertionOffset = { ...insertionOffset };
  }

  start() {
    this.isCompleted = false;
  }

  complete(lastElmPosition: IPointNum) {
    this.isCompleted = true;

    this.lastElmPosition.clone(lastElmPosition);

    this.insertionTransform = null;
    this.insertionOffset = null;
  }
}

export default Migration;
