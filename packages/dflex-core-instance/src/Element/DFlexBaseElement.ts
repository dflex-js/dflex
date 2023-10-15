/* eslint-disable no-underscore-dangle */
import { PointNum, setStyleProperty } from "@dflex/utils";

const TRANSFORM = "transform";

function transform(DOM: HTMLElement, x: number, y: number): void {
  setStyleProperty(DOM, TRANSFORM, `translate3d(${x}px, ${y}px, 0)`);
}

class DFlexBaseElement {
  id: string;

  translate: PointNum;

  static getType(): string {
    return "base:element";
  }

  static transform = transform;

  constructor(id: string) {
    this.id = id;
    this.translate = new PointNum(0, 0);
  }
}

export default DFlexBaseElement;
