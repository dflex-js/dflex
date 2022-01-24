import type { TrackerInterface } from "./types";

class Tracker implements TrackerInterface {
  travelID: number;

  /**
   * Creates an instance of Tracker.
   */
  constructor() {
    this.travelID = 0;
  }

  /**
   * Increment travels and return the last one.
   */
  newTravel() {
    this.travelID += 1;

    return `${this.travelID}`;
  }
}

export default Tracker;
