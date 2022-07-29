import DFlexBaseStore from "@dflex/store";
import type { RegisterInputOpts } from "@dflex/store";

import { Tracker, canUseDOM, Dimensions } from "@dflex/utils";

import {
  DFlexParentContainer,
  DFlexScrollContainer,
} from "@dflex/core-instance";

import initDFlexListeners, {
  DFlexListenerPlugin,
  DFlexListenerEvents,
} from "./DFlexListeners";

import scheduler, {
  Scheduler,
  SchedulerOptions,
  UpdateFn,
} from "./DFlexScheduler";

import updateBranchVisibilityLinearly from "./DFlexVisibilityUpdater";
import { initMutationObserver } from "./DFlexMutations";

type Containers = Map<string, DFlexParentContainer>;

type Scrolls = Map<string, DFlexScrollContainer>;

type UnifiedContainerDimensions = Record<number, Dimensions>;

type Observer = MutationObserver | null;

type UpdatesQueue = Array<
  [UpdateFn | null, SchedulerOptions | null, DFlexListenerEvents | undefined]
>;

type Deferred = Array<() => void>;

class DFlexDnDStore extends DFlexBaseStore {
  containers: Containers;

  scrolls: Scrolls;

  unifiedContainerDimensions: UnifiedContainerDimensions;

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
    this.scrolls = new Map();
    this.unifiedContainerDimensions = {};
    this.tracker = new Tracker();
    this._isInitialized = false;
    this._isDOM = false;
    this.observer = null;
    this.isUpdating = false;
    this.deferred = [];
    this.updatesQueue = [];
    this.listeners = initDFlexListeners();
    this.update = scheduler;

    this._initBranch = this._initBranch.bind(this);
  }

  private _initWhenRegister() {
    scheduler(this, null, null, {
      layoutState: "pending",
      type: "layoutState",
    });
  }

  private _initElmGrid(
    scroll: DFlexScrollContainer,
    container: DFlexParentContainer,
    id: string
  ) {
    const [dflexNode, DOM] = this.getElmWithDOM(id);

    const { scrollRect } = scroll;

    dflexNode.resume(DOM, scrollRect.left, scrollRect.top);

    // Using element grid zero to know if the element has been initiated inside
    // container or not.
    if (dflexNode.grid.x === 0) {
      const { initialOffset } = dflexNode;

      container.registerNewElm(
        initialOffset,
        this.unifiedContainerDimensions[dflexNode.depth]
      );

      dflexNode.grid.clone(container.grid);
    }
  }

  private _initBranch(SK: string, depth: number, DOM: HTMLElement) {
    let container: DFlexParentContainer;
    let scroll: DFlexScrollContainer;

    if (!this.unifiedContainerDimensions[depth]) {
      this.unifiedContainerDimensions[depth] = Object.seal({
        width: 0,
        height: 0,
      });
    }

    const branch = this.DOMGen.getElmBranchByKey(SK);

    if (!this.scrolls.has(SK)) {
      scroll = new DFlexScrollContainer(
        this.interactiveDOM.get(branch[0])!,
        SK,
        branch.length,
        updateBranchVisibilityLinearly.bind(null, this)
      );

      this.scrolls.set(SK, scroll);
    } else {
      if (__DEV__) {
        throw new Error(
          `_initBranchScrollAndVisibility: Scroll with key:${SK} already exists.` +
            `This function supposed to be called once when initializing the branch during the registration.`
        );
      }

      scroll = this.scrolls.get(SK)!;
    }

    if (!this.containers.has(SK)) {
      container = new DFlexParentContainer(branch.length);

      this.containers.set(SK, container);
    } else {
      if (__DEV__) {
        throw new Error(
          `_initBranchScrollAndVisibility: Container with key:${SK} already exists.` +
            `This function supposed to be called once when initializing the branch during the registration.`
        );
      }

      container = this.containers.get(SK)!;
    }

    const initElmGrid = this._initElmGrid.bind(this, scroll, container);

    branch.forEach(initElmGrid);

    updateBranchVisibilityLinearly(this, SK);

    initMutationObserver(this, DOM);
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
          readonly: !!element.readonly,
          depth: element.depth || 0,
        };

        // Create an instance of DFlexCoreNode and gets the DOM element into the store.
        super.register(coreInput, this._initBranch);
      },
      null
    );
  }

  commit() {
    scheduler(
      this,
      () => {
        this.getBranchesByDepth(0).forEach((key) => {
          if (!this.interactiveDOM.has(key)) {
            if (__DEV__) {
              // eslint-disable-next-line no-console
              console.info(
                `Nothing to commit: Container with key-${key} is not initiated yet.`
              );
            }

            return;
          }

          const parentDOM = this.interactiveDOM.get(key)!;
          const branch = this.getElmBranchByKey(key);

          const DOMS = branch.map((elmId) => {
            const DOM = this.interactiveDOM.get(elmId)!;
            DOM.style.removeProperty("transform");
            return DOM;
          });

          parentDOM.replaceChildren(...DOMS);
        });
      },
      {
        onUpdate: () => {
          this.getBranchesByDepth(0).forEach((SK) => {
            const container = this.containers.get(SK)!;

            const branch = this.getElmBranchByKey(SK);

            container.resetIndicators();

            container.originLength = branch.length;

            branch.forEach((elmId) => {
              const DOM = this.interactiveDOM.get(elmId)!;
              const elm = this.registry.get(elmId)!;

              elm.flushIndicators(DOM);

              // TODO: Find a unified call. This is duplicated from `handleElmMigration`.
              container.registerNewElm(elm.getOffset());
              elm.grid.clone(container.grid);
            });
          });
        },
      },
      {
        type: "mutation",
        mutation: "committed",
        targets: this.getBranchesByDepth(0).map((SK) => {
          return this.interactiveDOM.get(SK)!;
        }),
      }
    );
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
      ? this.registry.get(id)!.getSerializedInstance()
      : null;
  }

  private _clearBranchesScroll() {
    this.scrolls.forEach((scroll) => {
      scroll.destroy();
    });
    this.scrolls.clear();
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
    if (!this.registry.has(id)) {
      return;
    }

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

export default DFlexDnDStore;
