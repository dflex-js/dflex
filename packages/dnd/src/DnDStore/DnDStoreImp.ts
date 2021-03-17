import Store from "@dflex/store";
import CoreInstance from "@dflex/core-instance";
import type { ElmInstance } from "@dflex/store";
import type { Offset } from "@dflex/core-instance";

import Tracker from "./Tracker";

import type { ElmTree } from "./types";

// function noop() {}

// const handlers = ["onDragOver", "onDragLeave"];

class DnDStoreImp extends Store<CoreInstance> {
  tracker: Tracker;

  boundaries: { [k: string]: Offset };

  constructor() {
    super();

    this.boundaries = {};
    this.tracker = new Tracker();
  }

  assignSiblingsBoundaries(siblingsK: string, elemOffset: Offset) {
    const $ = this.boundaries[siblingsK];

    if ($) {
      $.height += elemOffset.height;

      if ($.left < elemOffset.left) {
        $.left = elemOffset.left;
      }

      if ($.top > elemOffset.top) {
        $.top = elemOffset.top;
      }

      if ($.width > elemOffset.width) {
        $.width = elemOffset.width;
      }
    } else {
      this.boundaries[siblingsK] = { ...elemOffset };
    }
  }

  /**
   *  Register DnD element.
   *
   * @param element -
   */
  register(element: ElmInstance) {
    super.register(element, CoreInstance);

    const {
      offset,
      keys: { sK },
    } = this.registry[element.id];

    this.assignSiblingsBoundaries(sK, offset);
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
