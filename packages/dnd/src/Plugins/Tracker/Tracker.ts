import type { TrackerInterface } from "./types";

class Tracker implements TrackerInterface {
  travelID: number;

  #prefix?: string;

  /**
   * Creates an instance of Tracker.
   */
  constructor(prefix?: string) {
    this.travelID = 0;

    if (prefix) {
      this.#prefix = prefix;
    }
  }

  /**
   * Increment travels and return the last one.
   */
  newTravel() {
    this.travelID += 1;

    return this.#prefix
      ? `${this.#prefix}-${this.travelID}`
      : `${this.travelID}`;
  }
}

export default Tracker;
