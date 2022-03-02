import { AxesCoordinates } from "@dflex/utils";

import type { AbstractInterface, AbstractInput, AbstractOpts } from "./types";

class AbstractInstance implements AbstractInterface {
  ref!: HTMLElement | null;

  id: string;

  translate!: AxesCoordinates;

  isInitialized!: boolean;

  isPaused!: boolean;

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

  detach() {
    this.isInitialized = false;
    this.ref = null;
  }

  initTranslate() {
    if (!this.translate) {
      this.translate = new AxesCoordinates(0, 0);
    }

    this.isPaused = false;
  }
}

export default AbstractInstance;
