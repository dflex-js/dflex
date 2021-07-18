/**
 * Copyright (c) Jalal Maskoun.
 *
 * This source code is licensed under the AGPL3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Store from "@dflex/store";
import CoreInstance from "@dflex/core-instance";

import type { Offset } from "@dflex/core-instance";
import type { ElmInstance } from "@dflex/store";
import type { ElmTree, BoundariesOffset, DnDStoreInterface } from "./types";

import Tracker from "./Tracker";

// function noop() {}

// const handlers = ["onDragOver", "onDragLeave"];

class DnDStoreImp extends Store<CoreInstance> implements DnDStoreInterface {
  tracker: Tracker;

  siblingsBoundaries: { [k: string]: BoundariesOffset };

  constructor() {
    super();

    this.siblingsBoundaries = {};
    this.tracker = new Tracker();
  }

  private assignSiblingsBoundaries(siblingsK: string, elemOffset: Offset) {
    const elmRight = elemOffset.left + elemOffset.width;

    if (!this.siblingsBoundaries[siblingsK]) {
      this.siblingsBoundaries[siblingsK] = {
        top: elemOffset.top,
        maxLeft: elemOffset.left,
        minRight: elmRight,
        bottom: elemOffset.height,
      };

      return;
    }

    const $ = this.siblingsBoundaries[siblingsK];

    if ($.maxLeft < elemOffset.left) {
      $.maxLeft = elemOffset.left;
    }

    if ($.minRight > elmRight) {
      $.minRight = elmRight;
    }

    if ($.top > elemOffset.top) {
      $.top = elemOffset.top;
    } else {
      $.bottom = elemOffset.top + elemOffset.height;
    }
  }

  /**
   * Reattach element reference.
   * This happens when element is unmounted from the screen and mounted again.
   *
   * @param id -
   * @param elmRef -
   */
  reattachElmRef(id: string, elmRef: HTMLElement) {
    this.registry[id].ref = elmRef;

    // Preserves last changes.
    this.registry[id].transformElm();
  }

  /**
   *  Register DnD element.
   *
   * @param element -
   */
  register(element: ElmInstance) {
    /**
     * If element already exist in the store, then the reattach the reference.
     */
    const id = element.id || element.ref.id;

    if (this.registry[id]) {
      if (element.ref) {
        this.reattachElmRef(id, element.ref);
      }

      return;
    }

    super.register(element, CoreInstance);

    const {
      offset,
      keys: { sK },
    } = this.registry[id];

    this.assignSiblingsBoundaries(sK, offset);
  }

  getELmOffsetById(id: string) {
    return this.getElmById(id).getOffset();
  }

  getELmTranslateById(id: string) {
    const { translateX, translateY } = this.getElmById(id);

    return { translateX, translateY };
  }

  getElmSiblingsById(id: string) {
    const element = this.getElmById(id);

    const {
      keys: { sK },
    } = element;

    const siblings = this.getElmBranchByKey(sK);

    return siblings;
  }

  /**
   * Gets element connections instance for a given id.
   *
   * @param id -
   */
  getElmTreeById(id: string): ElmTree {
    const element = this.getElmById(id);

    const {
      keys: { sK, pK },
      order: { parent: pi },
    } = element;

    /**
     * getting connected branches
     */
    const siblings = this.getElmBranchByKey(sK);
    const parents = this.getElmBranchByKey(pK);

    /**
     * getting parent instance
     */
    let parent = null;
    if (parents !== undefined) {
      const parentsID = Array.isArray(parents) ? parents[pi] : parents;
      parent = this.getElmById(parentsID);
    }

    return {
      element,
      parent,

      branches: {
        siblings,
        parents,
      },
    };
  }
}

export default (function createStoreInstance() {
  const store = new DnDStoreImp();

  return store;
})();
