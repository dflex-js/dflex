import { PointNum } from "@dflex/utils";
import type { IPointNum } from "@dflex/utils";

import type {
  AbstractInterface,
  AbstractInput,
  AbstractOpts,
  AllowedAttributes,
  AllowedDataset,
  AttributesIndicators,
} from "./types";

class AbstractInstance implements AbstractInterface {
  ref!: HTMLElement | null;

  id: string;

  translate!: IPointNum;

  isInitialized!: boolean;

  isPaused!: boolean;

  private hasAttribute!: {
    // eslint-disable-next-line no-unused-vars
    [key in AttributesIndicators]: boolean;
  };

  constructor({ ref, id }: AbstractInput, opts: AbstractOpts) {
    this.id = id;

    if (opts.isInitialized) {
      this.attach(ref || null);

      this.isPaused = opts.isPaused;

      if (!this.isPaused) {
        this.initTranslate();
      }

      return;
    }

    this.isInitialized = false;
    this.ref = null;
    this.isPaused = true;
  }

  /**
   * Attach element DOM node to the instance.
   *
   * @param incomingRef
   */
  attach(incomingRef: HTMLElement | null) {
    // Cleanup.
    this.ref = null;

    if (!incomingRef) {
      const ref = document.getElementById(this.id);

      if (!ref) {
        throw new Error(`DFlex: Element with ID: ${this.id} is not found.`);
      }
    } else if (incomingRef.nodeType !== Node.ELEMENT_NODE) {
      throw new Error(
        `DFlex: Invalid HTMLElement: ${incomingRef} is passed to registry.`
      );
    }

    this.ref = incomingRef;
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
      this.hasAttribute = {};
    }

    this.isPaused = false;
  }

  setDataset(key: AllowedDataset, value: number | boolean) {
    if (key === "index") {
      this.ref!.dataset[key] = `${value}`;

      return;
    }

    if (this.hasAttribute[key]) return;

    this.ref!.dataset[key] = `${value}`;

    this.hasAttribute[key] = true;
  }

  rmDateset(key: Exclude<AllowedDataset, "index">) {
    delete this.ref!.dataset[key];

    if (this.hasAttribute[key]) {
      this.hasAttribute[key] = false;
    }
  }

  setAttribute(key: AllowedAttributes, value: string) {
    if (this.hasAttribute[key]) return;

    this.ref!.setAttribute(key, value);
    this.hasAttribute[key] = true;
  }

  removeAttribute(key: AllowedAttributes) {
    if (!this.hasAttribute[key]) return;

    this.ref!.removeAttribute(key);
    this.hasAttribute[key] = false;
  }

  clearAttributes() {
    (Object.keys(this.hasAttribute) as AttributesIndicators[]).forEach(
      (key) => {
        if (key === "dragged") this.removeAttribute(key);
        else this.rmDateset(key);
      }
    );

    // @ts-expect-error.
    this.hasAttribute = {};
  }
}

export default AbstractInstance;
