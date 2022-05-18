/* eslint-disable max-classes-per-file */

import type { IAbstract, IMigration } from "./types";

class AbstractMigration implements IAbstract {
  index: number;

  SK: string;

  id: string;

  marginBottom: number | null;

  marginTop: number | null;

  constructor(index: number, SK: string, id: string) {
    this.index = index;
    this.SK = SK;
    this.id = id;
    this.marginBottom = null;
    this.marginTop = null;
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

  preserveVerticalMargin(type: "top" | "bottom", m: number | null) {
    console.log("file: Migration.ts ~ line 52 ~ m", m);
    this.latest()[type === "bottom" ? "marginBottom" : "marginTop"] = m;
  }

  clearMargins() {
    this.latest().marginBottom = null;
    this.latest().marginTop = null;
  }

  add(index: number, key: string, id: string) {
    this.#migrations.push(new AbstractMigration(index, key, id));
  }

  start() {
    this.isTransitioning = true;
  }

  complete() {
    this.isTransitioning = false;
    // this.preserveVerticalMargin("top", null);
    // this.preserveVerticalMargin("bottom", null);
  }

  dispose() {
    this.#migrations = [];
  }
}

export default Migration;
