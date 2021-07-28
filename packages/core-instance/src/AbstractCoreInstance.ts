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

  protected isInitialized: boolean;

  isPaused: boolean;

  isDetached: boolean;

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
      this.validateAndAssignRef(ref);
    } else {
      this.ref = null;
    }

    if (!this.isPaused) {
      this.initTranslate();
    }

    this.isDetached = false;
  }

  initTranslate() {
    /**
     * Since element render once and being transformed later we keep the data
     * stored to navigate correctly.
     */
    this.translateY = 0;
    this.translateX = 0;

    this.isPaused = false;
  }

  validateAndAssignRef(incomingRef: HTMLElement | null) {
    if (!incomingRef) {
      const ref = document.getElementById(this.id);
      if (!ref) {
        throw new Error(`Element with ID: ${this.id} is not found.`);
      }
    } else if (incomingRef.nodeType !== Node.ELEMENT_NODE) {
      throw new Error(
        `DFlex: Invalid HTMLElement: ${incomingRef} is passed to registry.`
      );
    }

    this.ref = incomingRef;
  }

  initialize(ref: HTMLElement | null) {
    this.validateAndAssignRef(ref);
    this.isInitialized = true;
  }

  attach(ref: HTMLElement | null) {
    this.validateAndAssignRef(ref);
    this.isDetached = false;
  }

  detach() {
    this.ref = null;
    this.isDetached = true;
  }
}

export default AbstractCoreInstance;
