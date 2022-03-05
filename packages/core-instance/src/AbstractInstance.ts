/* eslint-disable max-classes-per-file */
import { AxesCoordinates } from "@dflex/utils";

import type {
  AbstractInterface,
  AbstractInput,
  AbstractOpts,
  AllowedAttributes,
} from "./types";

class AbstractInstance implements AbstractInterface {
  ref!: HTMLElement | null;

  id: string;

  translate!: AxesCoordinates;

  isInitialized!: boolean;

  isPaused!: boolean;

  hasAttribute!: {
    // eslint-disable-next-line no-unused-vars
    [key in AllowedAttributes]: boolean;
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
      this.translate = new AxesCoordinates(0, 0);

      // @ts-expect-error - Just for initialization.
      this.hasAttribute = {};
    }

    this.isPaused = false;
  }

  updateDatasetIndex(i: number) {
    this.ref!.dataset.index = `${i}`;
  }

  setAttribute(key: AllowedAttributes, value: string) {
    if (this.hasAttribute[key] === true) {
      // console.log(`DFlex: Attribute ${key} is already set.`);

      return;
    }

    this.ref!.setAttribute(key, value);
    this.hasAttribute[key] = true;
  }

  removeAttribute(key: AllowedAttributes) {
    if (this.hasAttribute[key] === true) {
      this.ref!.removeAttribute(key);
      this.hasAttribute[key] = false;
    }
  }

  clearAttributes() {
    (Object.keys(this.hasAttribute) as AllowedAttributes[]).forEach((key) => {
      if (this.hasAttribute[key]) {
        this.removeAttribute(key);
      }
    });

    // @ts-expect-error.
    this.hasAttribute = {};
  }
}

export default AbstractInstance;
