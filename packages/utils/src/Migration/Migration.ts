/* eslint-disable max-classes-per-file */

import { IPointNum, PointNum } from "../Point";
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

  firstElmPosition: IPointNum;

  constructor(
    index: number,
    key: string,
    firstElmPosition: IPointNum,
    lastElmPosition: IPointNum
  ) {
    this.#migrations = [new AbstractMigration(index, key)];

    this.lastElmPosition = new PointNum(0, 0);
    this.firstElmPosition = new PointNum(0, 0);

    this.complete(firstElmPosition, lastElmPosition);
  }

  latest() {
    return this.#migrations[this.#migrations.length - 1];
  }

  setIndex(index: number) {
    this.latest().index = index;
  }

  add(index: number, key: string) {
    // Check if the key is already the last element in the list.
    if (this.#migrations[this.#migrations.length - 1].key === key) {
      this.setIndex(index);
      return false;
    }

    this.#migrations.push(new AbstractMigration(index, key));

    this.isMigrationCompleted = false;

    return true;
  }

  complete(firstElmPosition: IPointNum, lastElmPosition: IPointNum) {
    this.isMigrationCompleted = true;
    this.firstElmPosition.clone(firstElmPosition);
    this.lastElmPosition.clone(lastElmPosition);
  }
}

export default Migration;
