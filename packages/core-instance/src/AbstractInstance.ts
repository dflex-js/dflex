import type { AbstractInterface, AbstractCoreInput } from "./types";

class AbstractInstance implements AbstractInterface {
  ref!: HTMLElement | null;

  id: string;

  isInitialized: boolean;

  /**
   * Creates an instance of AbstractCoreInstance.
   */
  constructor({ ref, id, isInitialized }: AbstractCoreInput) {
    this.id = id;

    this.isInitialized = isInitialized;

    if (this.isInitialized && ref) {
      this.attach(ref);

      return;
    }

    this.ref = null;
    this.isInitialized = false;
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
}

export default AbstractInstance;
