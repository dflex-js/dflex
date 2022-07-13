export type Prefix = string | number;

export interface ITracker {
  travelID: number;
  // eslint-disable-next-line no-unused-vars
  newTravel(prefix?: Prefix): string;
}

class Tracker {
  travelID: number;

  private _prefix?: Prefix;

  /**
   * Creates an instance of Tracker.
   */
  constructor(prefix?: Prefix) {
    this.travelID = 0;

    if (prefix) {
      this._prefix = prefix;
    }
  }

  /**
   * Increment travels and return the last one.
   */
  newTravel(prefix?: Prefix) {
    const pre = prefix || this._prefix;

    this.travelID += 1;

    return pre ? `${pre}-${this.travelID}` : `${this.travelID}`;
  }
}

export default Tracker;
