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

  isMigrationCompleted: boolean;

  constructor(index: number, key: string) {
    this.#migrations = [new AbstractMigration(index, key)];
    this.isMigrationCompleted = true;
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
}

export default Migration;
