import { PointNum, DFlexElmType } from "@dflex/utils";

import { DFLEX_ATTRIBUTES } from "./constants";
import type { AllowedAttributes } from "./constants";

type AttributeSet = Set<Exclude<AllowedAttributes, "INDEX">>;

class DFlexBaseNode {
  id: string;

  translate!: PointNum;

  isPaused!: boolean;

  private _hasAttribute?: AttributeSet;

  private _type: DFlexElmType;

  static transform(DOM: HTMLElement, x: number, y: number): void {
    DOM.style.transform = `translate3d(${x}px,${y}px, 0)`;
  }

  constructor(id: string, type: DFlexElmType) {
    this.id = id;
    this._type = type;
    this.isPaused = true;
  }

  getType(): DFlexElmType {
    return this._type;
  }

  /**
   * This only happens during the registration.
   *
   * @param type
   */
  setType(type: DFlexElmType): void {
    this._type = type;
  }

  /**
   * Initialize the translate AxesCoordinates as part of abstract instance and
   * necessary for darg only movement.
   */
  initTranslate(): void {
    if (!this.translate) {
      this.translate = new PointNum(0, 0);
    }
    this._hasAttribute = new Set();
    this.isPaused = false;
  }

  setAttribute(
    DOM: HTMLElement,
    key: AllowedAttributes,
    value: "true" | "false" | DFlexElmType | number
  ): void {
    if (key === "INDEX") {
      DOM.setAttribute(DFLEX_ATTRIBUTES[key], `${value}`);

      return;
    }

    if (__DEV__) {
      if (this._hasAttribute === undefined) {
        throw new Error(`setAttribute: Attribute set is not initialized`);
      }

      if (!DFLEX_ATTRIBUTES[key]) {
        throw new Error(`setAttribute: Invalid attribute key: ${key}`);
      }
    }

    if (this._hasAttribute!.has(key)) return;
    DOM.setAttribute(DFLEX_ATTRIBUTES[key], `${value}`);
    this._hasAttribute!.add(key);
  }

  removeAttribute(DOM: HTMLElement, key: AllowedAttributes): void {
    if (key === "INDEX" || !this._hasAttribute!.has(key)) return;
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

export default DFlexBaseNode;
