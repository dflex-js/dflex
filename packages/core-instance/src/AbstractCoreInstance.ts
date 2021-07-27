/**
 * Copyright (c) Jalal Maskoun.
 *
 * This source code is licensed under the AGPL3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { AbstractCoreInterface, AbstractCoreInput } from "./types";

/**
 * This is the link (bridge) between the Store and element actions/classes.
 * Abstract is essential for Draggable & extended Store.
 */
class AbstractCoreInstance implements AbstractCoreInterface {
  ref: HTMLElement | null;

  id: string;

  translateY?: number;

  translateX?: number;

  isInitialized: boolean;

  /**
   * Creates an instance of AbstractCoreInstance.
   */
  constructor({ ref, id, isInitialized = true }: AbstractCoreInput) {
    this.ref = ref;
    this.id = id;

    this.isInitialized = isInitialized;

    if (this.isInitialized) {
      this.initialize();
    }
  }

  private initTranslate() {
    /**
     * Since element render once and being transformed later we keep the data
     * stored to navigate correctly.
     */
    this.translateY = 0;
    this.translateX = 0;
  }

  initialize() {
    if (!this.ref) {
      const ref = document.getElementById(this.id);
      if (!ref) {
        throw new Error(`Element with ID: ${this.id} is not found.`);
      }
      this.ref = ref;
    }

    this.initTranslate();

    if (!this.isInitialized) {
      this.isInitialized = true;
    }
  }
}

export default AbstractCoreInstance;
