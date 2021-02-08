/**
 *
 *
 * @class Tracker
 */
class Tracker {
  /**
   * Creates an instance of Tracker.
   *
   * @memberof Tracker
   */
  constructor() {
    this.travelID = 0;
  }

  /**
   * Increment travels and return the last one.
   *
   * @return {number}
   * @memberof Tracker
   */
  newTravel() {
    this.travelID += 1;

    return this.travelID;
  }
}

export default Tracker;
