/* eslint-disable max-classes-per-file */

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

  constructor(index: number, key: string) {
    this.#migrations = [new AbstractMigration(index, key)];
    this.complete();
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

  complete() {
    this.isTransitioning = false;
  }
}

export default Migration;
