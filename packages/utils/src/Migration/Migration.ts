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

  isTransitioning!: boolean;

  lastElmPosition: IPointNum;

  constructor(index: number, key: string, lastElmPosition: IPointNum) {
    this.#migrations = [new AbstractMigration(index, key)];
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

  add(index: number, key: string) {
    this.#migrations.push(new AbstractMigration(index, key));
  }

  start() {
    this.isTransitioning = true;
  }

  complete(lastElmPosition: IPointNum) {
    this.lastElmPosition.clone(lastElmPosition);
    this.isTransitioning = false;
  }
}

export default Migration;
