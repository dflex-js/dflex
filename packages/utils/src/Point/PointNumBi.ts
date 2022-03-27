import PointNum from "./PointNum";

class PointNumBi extends PointNum {
  z: number;

  constructor(x: number, y: number, z: number) {
    super(x, y);

    this.z = z;
  }
}

export default PointNumBi;
