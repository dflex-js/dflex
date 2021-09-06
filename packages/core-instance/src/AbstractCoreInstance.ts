/**
 * Copyright (c) Jalal Maskoun.
 *
 * This source code is licensed under the AGPL3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { AbstractCoreInterface, AbstractCoreInput } from "./types";

class AbstractCoreInstance implements AbstractCoreInterface {
  ref!: HTMLElement | null;

  id: string;

  translateY?: number;

  translateX?: number;

  isInitialized: boolean;

  isPaused: boolean;

  /**
   * Creates an instance of AbstractCoreInstance.
   */
  constructor({
    ref,
    id,
    isPaused = false,
    isInitialized = true,
  }: AbstractCoreInput) {
    this.id = id;

    this.isInitialized = isInitialized;
    this.isPaused = isPaused;

    if (this.isInitialized) {
      this.attach(ref);
    } else {
      this.ref = null;
    }

    if (!this.isPaused) {
      this.initTranslate();
    }
  }

  hasValidRef() {
    return this.isInitialized && this.ref !== null && this.ref.isConnected;
  }

  attach(incomingRef: HTMLElement | null) {
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
    this.isPaused = true;
    this.ref = null;
  }

  initTranslate() {
    /**
     * Since element render once and being transformed later we keep the data
     * stored to navigate correctly.
     *
     * If it's already initiated we don't need to do it again.
     * Reason: You may detach ref set flag to false and then attach it again. Do
     * you want to start from zero or maintain the last position.
     *
     * Continuity is fundamental in DFlex, please keep that in your mind.
     */
    if (typeof this.translateY !== "number") this.translateY = 0;
    if (typeof this.translateX !== "number") this.translateX = 0;

    this.isPaused = false;
  }
}

export default AbstractCoreInstance;
