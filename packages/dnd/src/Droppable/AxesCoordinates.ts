class AxesCoordinates {
  x: number;

  y: number;

  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  setAxes(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

export default AxesCoordinates;
