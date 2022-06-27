import { PointNum } from "@dflex/utils";
import type { IPointNum } from "@dflex/utils";

import { DFLEX_ATTRIBUTES } from "./constants";
import type { AllowedAttributes } from "./constants";
import type { IDFlexBaseNode } from "./types";

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

  if (DOM!.nodeType !== Node.ELEMENT_NODE) {
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

class DFlexBaseNode implements IDFlexBaseNode {
  DOM!: HTMLElement | null;

  id: string;

  translate!: IPointNum;

  isInitialized!: boolean;

  isPaused!: boolean;

  private _hasAttribute?: AttributeSet;

  constructor(id: string) {
    this.id = id;
    this.isInitialized = false;
    this.DOM = null;
    this.isPaused = true;
  }

  /**
   * Attach element DOM node to the instance.
   */
  attach() {
    this.DOM = getElmDOMOrThrow(this.id);
    this.isInitialized = !!this.DOM;
  }

  /**
   * Detach element DOM node from the instance.
   */
  detach() {
    this.isInitialized = false;
    this.DOM = null;
  }

  transform(x: number, y: number) {
    this.DOM!.style.transform = `translate3d(${x}px,${y}px, 0)`;
  }

  /**
   * Initialize the translate AxesCoordinates as part of abstract instance and
   * necessary for darg only movement.
   */
  initTranslate() {
    if (!this.translate) {
      this.translate = new PointNum(0, 0);
    }
    this._hasAttribute = new Set();
    this.isPaused = false;
  }

  setAttribute(key: AllowedAttributes, value: string | number) {
    if (key === "INDEX") {
      this.DOM!.setAttribute(DFLEX_ATTRIBUTES[key], `${value}`);

      return;
    }

    if (this._hasAttribute!.has(key)) return;
    this.DOM!.setAttribute(DFLEX_ATTRIBUTES[key], `${value}`);
    this._hasAttribute!.add(key);
  }

  removeAttribute(key: AllowedAttributes) {
    if (key === "INDEX" || !this._hasAttribute!.has(key)) return;
    this.DOM!.removeAttribute(DFLEX_ATTRIBUTES[key]);
    this._hasAttribute!.delete(key);
  }

  clearAttributes() {
    this._hasAttribute!.forEach((key) => {
      this.removeAttribute(key);
    });
    this._hasAttribute!.clear();
  }
}

export default DFlexBaseNode;
