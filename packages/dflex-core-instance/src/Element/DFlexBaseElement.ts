/* eslint-disable no-underscore-dangle */
import { PointNum, setStyleProperty } from "@dflex/utils";

import { DFLEX_ATTRIBUTES } from "./constants";
import type { AllowedAttributes } from "./constants";

type AttributeSet = Set<Exclude<AllowedAttributes, "INDEX">>;

const TRANSFORM = "transform";

function transform(DOM: HTMLElement, x: number, y: number): void {
  setStyleProperty(DOM, TRANSFORM, `translate3d(${x}px, ${y}px, 0)`);
}

class DFlexBaseElement {
  id: string;

  translate: PointNum;

  private _hasAttribute?: AttributeSet;

  static getType(): string {
    return "base:element";
  }

  static transform = transform;

  constructor(id: string) {
    this.id = id;
    this.translate = new PointNum(0, 0);
    this._hasAttribute = new Set();
  }

  setAttribute(
    DOM: HTMLElement,
    key: AllowedAttributes,
    value: string | number,
  ): void {
    if (key === "INDEX") {
      DOM.setAttribute(DFLEX_ATTRIBUTES[key], `${value}`);

      return;
    }

    if (this._hasAttribute!.has(key)) {
      return;
    }

    DOM.setAttribute(DFLEX_ATTRIBUTES[key], `${value}`);
    this._hasAttribute!.add(key);
  }

  removeAttribute(DOM: HTMLElement, key: AllowedAttributes): void {
    if (key === "INDEX" || !this._hasAttribute!.has(key)) {
      return;
    }

    DOM.removeAttribute(DFLEX_ATTRIBUTES[key]);
    this._hasAttribute!.delete(key);
  }

  clearAttributes(DOM: HTMLElement): void {
    this._hasAttribute!.forEach((key) => {
      this.removeAttribute(DOM, key);
    });

    this._hasAttribute!.clear();
  }
}

export default DFlexBaseElement;
