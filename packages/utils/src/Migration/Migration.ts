/* eslint-disable max-classes-per-file */

import type { IAbstract, IMigration } from "./types";

class AbstractMigration implements IAbstract {
  index: number;

  SK: string;

  id: string;

  constructor(index: number, SK: string, id: string) {
    this.index = index;
    this.SK = SK;
    this.id = id;
  }
}

class Migration implements IMigration {
  #migrations: Array<IAbstract>;

  isTransitioning!: boolean;

  constructor(index: number, SK: string, id: string) {
    this.#migrations = [new AbstractMigration(index, SK, id)];
    this.complete();
  }

  latest() {
    return this.#migrations[this.#migrations.length - 1];
  }

  prev() {
    return this.#migrations[this.#migrations.length - 2];
  }

  getALlMigrations() {
    return this.#migrations;
  }

  setIndex(index: number) {
    this.latest().index = index;
  }

  add(index: number, key: string, id: string) {
    this.#migrations.push(new AbstractMigration(index, key, id));
  }

  start() {
    this.isTransitioning = true;
  }

  complete() {
    this.isTransitioning = false;
  }
}

export default Migration;
