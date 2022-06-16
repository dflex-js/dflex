import { PointNum } from "@dflex/utils";
import type { IPointNum } from "@dflex/utils";

import type {
  IDFlexBaseNode,
  AllowedAttributes,
  AllowedDataset,
  AttributesIndicators,
} from "./types";

class DFlexBaseNode implements IDFlexBaseNode {
  ref!: HTMLElement | null;

  id: string;

  translate!: IPointNum;

  isInitialized!: boolean;

  isPaused!: boolean;

  private _hasAttribute!: {
    // eslint-disable-next-line no-unused-vars
    [key in AttributesIndicators]: boolean;
  };

  constructor(id: string) {
    this.id = id;
    this.isInitialized = false;
    this.ref = null;
    this.isPaused = true;
  }

  /**
   * Attach element DOM node to the instance.
   */
  attach() {
    this.ref = document.getElementById(this.id);

    if (__DEV__) {
      if (!this.ref) {
        throw new Error(`Attach: Element with ID: ${this.id} is not found.`);
      }

      if (this.ref.nodeType !== Node.ELEMENT_NODE) {
        throw new Error(
          `Attach: Invalid HTMLElement ${this.ref} is passed to registry.`
        );
      }
    }

    this.isInitialized = true;
  }

  /**
   * Detach element DOM node from the instance.
   */
  detach() {
    this.isInitialized = false;
    this.ref = null;
  }

  transform(x: number, y: number) {
    this.ref!.style.transform = `translate3d(${x}px,${y}px, 0)`;
  }

  /**
   * Initialize the translate AxesCoordinates as part of abstract instance and
   * necessary for darg only movement.
   */
  initTranslate() {
    if (!this.translate) {
      this.translate = new PointNum(0, 0);

      // @ts-expect-error - Just for initialization.
      this._hasAttribute = {};
    }

    this.isPaused = false;
  }

  setDataset(key: AllowedDataset, value: number | boolean) {
    if (key === "index" || key === "gridX" || key === "gridY") {
      this.ref!.dataset[key] = `${value}`;

      return;
    }

    if (this._hasAttribute[key]) return;

    this.ref!.dataset[key] = `${value}`;

    this._hasAttribute[key] = true;
  }

  rmDateset(key: Exclude<AllowedDataset, "index">) {
    delete this.ref!.dataset[key];

    if (this._hasAttribute[key]) {
      this._hasAttribute[key] = false;
    }
  }

  setAttribute(key: AllowedAttributes, value: string) {
    if (this._hasAttribute[key]) return;

    this.ref!.setAttribute(key, value);
    this._hasAttribute[key] = true;
  }

  removeAttribute(key: AllowedAttributes) {
    if (!this._hasAttribute[key]) return;

    this.ref!.removeAttribute(key);
    this._hasAttribute[key] = false;
  }

  clearAttributes() {
    (Object.keys(this._hasAttribute) as AttributesIndicators[]).forEach(
      (key) => {
        if (key === "dragged") this.removeAttribute(key);
        else this.rmDateset(key);
      }
    );

    // @ts-expect-error.
    this._hasAttribute = {};
  }
}

export default DFlexBaseNode;
