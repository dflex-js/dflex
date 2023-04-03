class AxesPoint<T = number> {
  x!: T;

  y!: T;

  constructor(x: T, y: T) {
    this.x = x;
    this.y = y;

    if (__DEV__) {
      Object.seal(this);
    }
  }
}

export default AxesPoint;
