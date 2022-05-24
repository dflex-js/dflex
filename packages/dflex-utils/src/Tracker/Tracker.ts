import type { ITracker, Prefix } from "./types";

class Tracker implements ITracker {
  travelID: number;

  #prefix?: Prefix;

  /**
   * Creates an instance of Tracker.
   */
  constructor(prefix?: Prefix) {
    this.travelID = 0;

    if (prefix) {
      this.#prefix = prefix;
    }
  }

  /**
   * Increment travels and return the last one.
   */
  newTravel(prefix?: Prefix) {
    const pre = prefix || this.#prefix;

    this.travelID += 1;

    return pre ? `${pre}-${this.travelID}` : `${this.travelID}`;
  }
}

export default Tracker;
