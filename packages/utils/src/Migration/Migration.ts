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

  constructor(index: number, key: string) {
    this.#migrations = [new AbstractMigration(index, key)];
  }

  latest() {
    return this.#migrations[this.#migrations.length - 1];
  }

  setIndex(index: number) {
    this.latest().index = index;
  }

  add(index: number, key: string) {
    this.#migrations.push(new AbstractMigration(index, key));
  }
}

export default Migration;
