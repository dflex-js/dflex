import Store from "@dflex/store";
import type { RegisterInputOpts } from "@dflex/store";

import { Tracker, Scroll, canUseDOM } from "@dflex/utils";
import type { Dimensions, ITracker } from "@dflex/utils";

import { DFlexContainer } from "@dflex/core-instance";
import type { IDFlexContainer } from "@dflex/core-instance";

import type { ElmTree, IDFlexDnDStore } from "./types";

import initDFlexListeners from "./DFlexListeners";

import {
  updateBranchVisibility,
  updateElementVisibility,
} from "./DFlexVisibilityUpdater";

import { MAX_NUM_OF_SIBLINGS_BEFORE_DYNAMIC_VISIBILITY } from "./constants";

function throwElementIsNotConnected(id: string) {
  throw new Error(
    `Elements in the branch are not valid. Trying to validate element with id:${id} but failed.\n` +
      `Did you forget to call store.unregister(${id}) or add parenID when register the element?`
  );
}

class DnDStoreImp extends Store implements IDFlexDnDStore {
  containers: Map<string, IDFlexContainer>;

  unifiedContainerDimensions: Map<number, Dimensions>;

  tracker: ITracker;

  observer: MutationObserver | null;

  listeners: ReturnType<typeof initDFlexListeners>;

  private _isDOM: boolean;

  private _isInitialized: boolean;

  constructor() {
    super();
    this.containers = new Map();
    this.unifiedContainerDimensions = new Map();
    this.tracker = new Tracker();
    this._isInitialized = false;
    this._isDOM = false;
    this.observer = null;
    this.listeners = initDFlexListeners();
    this.listeners.notify({ layoutState: "pending", type: "layoutState" });
  }

  private _initWhenRegister() {
    window.onbeforeunload = this.dispose();
  }

  initSiblingContainer(SK: string) {
    if (!this.containers.has(SK)) {
      this.containers.set(SK, new DFlexContainer());
    }

    const branch = this.DOMGen.getElmBranchByKey(SK);

    const firstElemID = branch[0];
    const lastElemID = branch[branch.length - 1];
    const hasSiblings = branch.length > 1;

    if (__DEV__) {
      if (firstElemID && this.registry.get(firstElemID)!.isInitialized) {
        const isHeadNotConnected = !this.registry
          .get(firstElemID)!
          .isConnected();
        let isNotConnected = isHeadNotConnected;

        if (hasSiblings && lastElemID.length > 0) {
          const isTailNotConnected = !this.registry
            .get(lastElemID!)!
            .isConnected();
          isNotConnected = isTailNotConnected || isHeadNotConnected;
        }

        if (isNotConnected) {
          const container = this.containers.get(SK)!;

          if (container.scroll) {
            container.scroll.destroy();
            // @ts-expect-error
            container.scroll = null;
          }

          throwElementIsNotConnected(firstElemID);

          return;
        }
      }
    }

    if (this.containers.get(SK)!.scroll) {
      return;
    }

    const scroll = new Scroll({
      element: this.registry.get(firstElemID)!.ref!,
      requiredBranchKey: SK,
      scrollEventCallback: null,
    });

    // Override allowDynamicVisibility taking into consideration the length of
    // the branch itself. Iterate for a limited number of elements won't be a problem.
    if (
      hasSiblings &&
      scroll.allowDynamicVisibility &&
      this.DOMGen.getElmBranchByKey(SK).length <=
        MAX_NUM_OF_SIBLINGS_BEFORE_DYNAMIC_VISIBILITY
    ) {
      scroll.allowDynamicVisibility = false;
    }

    const container = this.containers.get(SK)!;

    container.scroll = scroll;

    if (scroll.allowDynamicVisibility) {
      scroll.scrollEventCallback = updateBranchVisibility.bind(null, this);
    }
  }

  private _initElmInstance(id: string) {
    const elm = this.registry.get(id)!;

    const {
      keys: { SK },
      depth,
    } = elm;

    const container = this.containers.get(SK)!;

    if (elm.isPaused) {
      elm.resume(container.scroll.scrollX, container.scroll.scrollY);

      if (!elm.isInitialized) {
        return;
      }
    }

    // Using element grid zero to know if the element has been initiated inside
    // container or not.
    if (elm.grid.x === 0) {
      const { offset } = elm;

      container.registerNewElm(
        offset,
        this.unifiedContainerDimensions.get(depth)!
      );

      elm.grid.clone(container.grid);
    }

    updateElementVisibility(elm, container.scroll, false);
  }

  register(element: RegisterInputOpts) {
    if (!this._isDOM) {
      this._isDOM = canUseDOM();

      if (!this._isDOM) return;
    }

    /**
     * If element already exist in the store, then the reattach the reference.
     */

    if (!this._isInitialized) {
      this._initWhenRegister();
      this._isInitialized = true;
    }

    const { id } = element;

    if (this.registry.has(id)) {
      const elm = this.registry.get(id)!;
      if (elm.isInitialized) {
        elm.attach();

        if (elm.isVisible) {
          // Preserves last changes.
          elm.transformElm();
        }
      }

      return;
    }

    const coreInput = {
      id,
      isInitialized: element.priority === "high",
      parentID: element.parentID,
      depth: element.depth || 0,
      readonly: !!element.readonly,
    };

    queueMicrotask(() => {
      const {
        depth,
        keys: { SK },
      } = this.registry.get(id)!;

      if (!this.containers.has(SK)) {
        this.initSiblingContainer(SK);

        if (!this.unifiedContainerDimensions.has(depth)) {
          this.unifiedContainerDimensions.set(depth, {
            width: 0,
            height: 0,
          });
        }
      }

      this._initElmInstance(id!);
    });

    super.register(coreInput);
  }

  getElmSiblingsById(id: string) {
    const element = this.registry.get(id)!;

    if (!element) return null;

    const {
      keys: { SK },
    } = element;

    const siblings = this.getElmBranchByKey(SK);

    return siblings;
  }

  /**
   * Gets element connections instance for a given id.
   *
   * @param id -
   */
  getElmTreeById(id: string): ElmTree {
    const element = this.registry.get(id)!;

    const {
      keys: { SK, PK },
      order,
    } = element;

    /**
     * getting connected branches
     */
    const siblings = this.getElmBranchByKey(SK);
    const parents = this.getElmBranchByKey(PK);

    /**
     * getting parent instance
     */
    let parent = null;
    if (parents !== undefined) {
      const parentsID = parents[order.parent];
      parent = this.registry.get(parentsID)!;
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

  getSerializedElm(id: string) {
    if (__DEV__) {
      if (!this.registry.has(id)) {
        throw new Error(
          `getSerializedElm: Element with id ${id} does not exist in the registry.`
        );
      }
    }

    return this.registry.has(id) ? this.registry.get(id)!.exportJSON() : null;
  }

  private _clearBranchesScroll() {
    this.DOMGen.forEachBranch((SK) => {
      const container = this.containers.get(SK)!;
      if (container.scroll) {
        container.scroll.destroy();
      }
    });
  }

  /**
   * Unregister DnD element.
   *
   * Note: This will remove the element registry and the branch array. But,
   * in case all the branches will be removed.
   * This means, if, in rare cases when the user removes one element and keeps
   * the rest this methods going to generate a bug. It's going to remove an
   * element without updating the indexes inside registry instances.
   *
   * @param id -
   *
   */
  unregister(id: string) {
    const {
      keys: { SK },
      order: { self },
    } = this.registry.get(id)!;

    this.DOMGen.removeElmIDFromBranch(SK, self);

    super.unregister(id);

    // Nothing left?
    // Reset the branch instances.
    if (this.DOMGen.getElmBranchByKey(SK).length === 0) {
      this._clearBranchesScroll();
    }
  }

  dispose() {
    if (!this._isInitialized) return null;

    this._isInitialized = false;

    return null;
  }

  destroy() {
    this.dispose();

    this._clearBranchesScroll();

    // Destroys all registered instances.
    super.destroy();

    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
declare global {
  // eslint-disable-next-line
  var $DFlex: DnDStoreImp;
}
export default (function createStoreInstance() {
  const store = new DnDStoreImp();

  if (__DEV__) {
    if (canUseDOM()) {
      if (!globalThis.$DFlex) {
        globalThis.$DFlex = store;
      } else {
        throw new Error("DFlex store instances is already defined.");
      }
    }
  }

  return store;
})();
