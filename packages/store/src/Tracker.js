class Tracker {
  constructor() {
    this.travelID = 0;
  }

  newTravel() {
    this.travelID += 1;

    return this.travelID;
  }
}

export default Tracker;
