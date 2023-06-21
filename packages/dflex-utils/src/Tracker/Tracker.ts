class Tracker {
  private _travelID: Record<string, number>;

  /**
   * Creates an instance of Tracker.
   */
  constructor() {
    this._travelID = {};
  }

  /**
   * Increment travels and return the last one.
   */
  _newTravel(prefix: string): string {
    if (this._travelID[prefix] === undefined) {
      this._travelID[prefix] = 0;
    } else {
      this._travelID[prefix] += 1;
    }

    return `${prefix}${this._travelID[prefix]}`;
  }
}

export default Tracker;
