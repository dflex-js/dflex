class AxesCoordinates<T = number> {
  x: T;

  y: T;

  constructor(x: T, y: T) {
    this.x = x;
    this.y = y;
  }

  setAxes(x: T, y: T) {
    this.x = x;
    this.y = y;
  }
}

export default AxesCoordinates;
