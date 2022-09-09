class Tracker {
  private _travelID: Record<string, number>;

  static PREFIX_CYCLE = "dflex_cycle_";

  static PREFIX_ID = "dflex_id_";

  /**
   * Creates an instance of Tracker.
   */
  constructor() {
    this._travelID = {};
  }

  /**
   * Increment travels and return the last one.
   */
  newTravel(prefix: string): string {
    const pre = prefix;

    let travel = this._travelID[pre];

    if (travel !== undefined) {
      travel += 1;
    } else {
      travel = 0;
    }

    this._travelID[pre] = travel;

    return `${prefix}${travel}`;
  }
}

export default Tracker;
