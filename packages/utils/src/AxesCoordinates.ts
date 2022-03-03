class AxesCoordinates<T = number> {
  x!: T;

  y!: T;

  constructor(x: T, y: T) {
    this.setAxes(x, y);
  }

  setAxes(x: T, y: T) {
    this.x = x;
    this.y = y;
  }

  clone(target: AxesCoordinates<T>) {
    this.setAxes(target.x, target.y);
  }
}

export default AxesCoordinates;
