/* eslint-disable max-classes-per-file */

import { IPointAxes, IPointNum, PointNum } from "../Point";
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

  isMigrationCompleted!: boolean;

  lastElmPosition: IPointNum;

  elmSyntheticOffset: IPointAxes;

  insertionTransform!: IPointAxes;

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

  setIndex(index: number) {
    this.latest().index = index;
  }

  add(index: number, key: string, insertionTransform: IPointAxes) {
    this.#migrations.push(new AbstractMigration(index, key));

    this.isMigrationCompleted = false;

    this.insertionTransform = { ...insertionTransform };
  }

  complete(lastElmPosition: IPointNum) {
    this.isMigrationCompleted = true;

    this.lastElmPosition.clone(lastElmPosition);
  }
}

export default Migration;
