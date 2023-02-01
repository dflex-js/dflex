class Tracker {
  private _travelID: Record<string, number>;

  public static readonly PREFIX_CYCLE = "dflex_cycle_";

  public static readonly PREFIX_ID = "dflex_id_";

  public static readonly PREFIX_ky = "dflex_ky_";

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
    if (this._travelID[prefix] === undefined) {
      this._travelID[prefix] = 0;
    } else {
      this._travelID[prefix] += 1;
    }

    return `${prefix}${this._travelID[prefix]}`;
  }
}

export default Tracker;
