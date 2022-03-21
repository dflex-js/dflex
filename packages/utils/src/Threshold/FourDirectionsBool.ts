class FourDirectionsBool {
  isLeftFromTop!: boolean;

  isLeftFromBottom!: boolean;

  isLeftFromLeft!: boolean;

  isLeftFromRight!: boolean;

  constructor() {
    this.reset();
  }

  reset() {
    this.isLeftFromTop = false;
    this.isLeftFromBottom = false;

    this.isLeftFromLeft = false;
    this.isLeftFromRight = false;
  }

  isOutY() {
    return this.isLeftFromTop || this.isLeftFromBottom;
  }

  setOutY(up: boolean, down: boolean) {
    this.isLeftFromTop = up;
    this.isLeftFromBottom = down;
  }

  setOutYFalsy() {
    this.isLeftFromTop = false;
    this.isLeftFromBottom = false;
  }

  isOutX() {
    return this.isLeftFromLeft || this.isLeftFromRight;
  }

  setOutX(left: boolean, right: boolean) {
    this.isLeftFromLeft = left;
    this.isLeftFromRight = right;
  }

  setOutXFalsy() {
    this.isLeftFromLeft = false;
    this.isLeftFromRight = false;
  }
}

export default FourDirectionsBool;
