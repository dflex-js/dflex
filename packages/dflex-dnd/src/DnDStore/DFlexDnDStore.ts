import Store from "@dflex/store";
import type { RegisterInputOpts } from "@dflex/store";

import { Tracker, Scroll, canUseDOM, Dimensions } from "@dflex/utils";
import type { ITracker } from "@dflex/utils";

import { DFlexContainer, IDFlexContainer } from "@dflex/core-instance";

import initDFlexListeners, {
  DFlexListenerPlugin,
  ListenerEvents,
} from "./DFlexListeners";

import scheduler, {
  Scheduler,
  SchedulerOptions,
  UpdateFn,
} from "./DFlexScheduler";

import {
  updateBranchVisibility,
  updateElementVisibility,
} from "./DFlexVisibilityUpdater";

import { MAX_NUM_OF_SIBLINGS_BEFORE_DYNAMIC_VISIBILITY } from "./constants";

type Containers = Map<string, IDFlexContainer>;

type UnifiedContainerDimensions = Map<number, Dimensions>;

type Observer = MutationObserver | null;

type UpdatesQueue = Array<
  [UpdateFn | null, SchedulerOptions | null, ListenerEvents | undefined]
>;

type Deferred = Array<() => void>;

class DnDStoreImp extends Store {
  containers: Containers;

  unifiedContainerDimensions: UnifiedContainerDimensions;

  tracker: ITracker;

  observer: Observer;

  listeners: DFlexListenerPlugin;

  updatesQueue: UpdatesQueue;

  isUpdating: boolean;

  deferred: Deferred;

  update: Scheduler;

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
    this.isUpdating = false;
    this.deferred = [];
    this.updatesQueue = [];
    this.listeners = initDFlexListeners();
    this.update = scheduler;
  }

  private _initWhenRegister() {
    scheduler(this, null, null, {
      layoutState: "pending",
      type: "layoutState",
    });
  }

  initSiblingContainer(SK: string) {
    if (this.containers.has(SK)) {
      return;
    }

    this.containers.set(SK, new DFlexContainer());

    const branch = this.DOMGen.getElmBranchByKey(SK);

    const scroll = new Scroll({
      element: this.interactiveDOM.get(branch[0])!,
      requiredBranchKey: SK,
      scrollEventCallback: null,
    });

    const hasSiblings = branch.length > 1;

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

  private _initElmDOMInstance(id: string) {
    const elm = this.registry.get(id)!;

    const {
      keys: { SK },
      depth,
    } = elm;

    const container = this.containers.get(SK)!;

    if (!this.interactiveDOM.has(id)) {
      const DOM = elm.attach();

      if (DOM === null) {
        return;
      }

      this.interactiveDOM.set(id, DOM);

      elm.resume(DOM, container.scroll.scrollX, container.scroll.scrollY);
    }

    // Using element grid zero to know if the element has been initiated inside
    // container or not.
    if (elm.grid.x === 0) {
      const { initialOffset } = elm;

      container.registerNewElm(
        initialOffset,
        this.unifiedContainerDimensions.get(depth)!
      );

      elm.grid.clone(container.grid);
    }

    updateElementVisibility(
      this.interactiveDOM.get(id)!,
      elm,
      container.scroll,
      false
    );
  }

  register(element: RegisterInputOpts) {
    if (!this._isDOM) {
      this._isDOM = canUseDOM();

      if (!this._isDOM) return;
    }

    if (!this._isInitialized) {
      this._initWhenRegister();
      this._isInitialized = true;
    }

    const { id } = element;

    if (this.has(id)) {
      const [elm, DOM] = this.getElmWithDOM(id);

      if (elm.isVisible) {
        // Preserves last changes.
        elm.transform(DOM);
      }

      return;
    }

    scheduler(
      this,
      () => {
        const coreInput = {
          id,
          isInitialized: element.priority === "high",
          parentID: element.parentID,
          depth: element.depth || 0,
          readonly: !!element.readonly,
        };

        super.register(coreInput);
      },
      {
        onUpdate: () => {
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

          this._initElmDOMInstance(id);
        },
      }
    );
  }

  commit() {
    this.getBranchesByDepth(0).forEach((key) => {
      if (!this.interactiveDOM.has(key)) {
        if (__DEV__) {
          // eslint-disable-next-line no-console
          console.info(
            `Nothing to commit: Container with key-${key} is not initiated yet.`
          );
        }
      }

      // const parentDOM = this.interactiveDOM.get(key)!;

      // const branch = this.getElmBranchByKey(key);

      // branch.forEach((elmId) => {
      //   const elm = this.registry.get(elmId)!;

      //   if (elm.isTransformed()) {
      //   }
      // });
    });
  }

  getSerializedElm(id: string) {
    if (__DEV__) {
      if (!this.registry.has(id)) {
        throw new Error(
          `getSerializedElm: Element with id ${id} does not exist in the registry.`
        );
      }
    }

    return this.registry.has(id)
      ? this.registry.get(id)!.getSerializedElm()
      : null;
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

  destroy() {
    this._clearBranchesScroll();

    // Destroys all registered instances.
    super.destroy();

    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

export default DnDStoreImp;
