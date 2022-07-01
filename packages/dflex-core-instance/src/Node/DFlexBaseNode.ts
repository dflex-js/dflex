import { PointNum } from "@dflex/utils";
import type { IPointNum } from "@dflex/utils";

import { DFLEX_ATTRIBUTES } from "./constants";
import type { AllowedAttributes } from "./constants";

function getElmDOMOrThrow(id: string): HTMLElement | null {
  let DOM = document.getElementById(id);

  if (!DOM) {
    if (__DEV__) {
      throw new Error(
        `Attach: Element with ID: ${id} is not found.` +
          `This could be due wrong ID or missing DOM element.`
      );
    }
  }

  if (!DOM || DOM.nodeType !== Node.ELEMENT_NODE) {
    if (__DEV__) {
      throw new Error(
        `Attach: Invalid HTMLElement ${DOM} is passed to registry.`
      );
    }

    DOM = null;
  }

  return DOM;
}

type AttributeSet = Set<Exclude<AllowedAttributes, "INDEX">>;

class DFlexBaseNode {
  id: string;

  translate!: IPointNum;

  isPaused!: boolean;

  private _hasAttribute?: AttributeSet;

  static getType(): string {
    return "base:node";
  }

  static transform(DOM: HTMLElement, x: number, y: number): void {
    DOM.style.transform = `translate3d(${x}px,${y}px, 0)`;
  }

  constructor(id: string) {
    this.id = id;
    this.isPaused = true;
  }

  /**
   * Attach element DOM node to the instance.
   */
  attach(): HTMLElement | null {
    return getElmDOMOrThrow(this.id);
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
    value: string | number
  ): void {
    if (key === "INDEX") {
      DOM.setAttribute(DFLEX_ATTRIBUTES[key], `${value}`);

      return;
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
