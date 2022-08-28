/* eslint-disable no-unused-vars */
/* eslint-disable no-dupe-class-members */
import DFlexBaseStore from "@dflex/store";
import type { RegisterInputOpts } from "@dflex/store";

import { Tracker, canUseDOM, Dimensions, featureFlags } from "@dflex/utils";

import {
  DFlexParentContainer,
  DFlexScrollContainer,
} from "@dflex/core-instance";

import type { ELmBranch } from "@dflex/dom-gen";

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
import { addMutationObserver } from "./DFlexMutations";
import DOMReconciler from "./DFlexDOMReconciler";

type Containers = Map<string, DFlexParentContainer>;

type Scrolls = Map<string, DFlexScrollContainer>;

type UnifiedContainerDimensions = Record<number, Dimensions>;

type Observer = MutationObserver | null;

type UpdatesQueue = [
  UpdateFn | null,
  SchedulerOptions | null,
  DFlexListenerEvents | undefined
][];

type Deferred = (() => void)[];

class DFlexDnDStore extends DFlexBaseStore {
  containers: Containers;

  scrolls: Scrolls;

  unifiedContainerDimensions: UnifiedContainerDimensions;

  observer: Map<string, Observer>;

  listeners: DFlexListenerPlugin;

  updatesQueue: UpdatesQueue;

  isUpdating: boolean;

  isTransforming: boolean;

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
    this.observer = new Map();
    this.isTransforming = false;
    this.isUpdating = false;
    this.deferred = [];
    this.updatesQueue = [];
    this.listeners = initDFlexListeners();
    this.update = scheduler;

    this._initBranch = this._initBranch.bind(this);
  }

  isIDle(): boolean {
    return (
      !this.isUpdating &&
      this.updatesQueue.length === 0 &&
      this.deferred.length === 0
    );
  }

  isLayoutAvailable(): boolean {
    return !this.isTransforming && this.isIDle();
  }

  private _initWhenRegister() {
    scheduler(this, null, null, {
      layoutState: "pending",
      type: "layoutState",
    });
  }

  private _initElmGrid(container: DFlexParentContainer, id: string) {
    const [dflexElm, DOM] = this.getElmWithDOM(id);

    dflexElm.resume(DOM);

    // Using element grid zero to know if the element has been initiated inside
    // container or not.
    if (dflexElm.DOMGrid.x === 0) {
      const { rect } = dflexElm;

      container.registerNewElm(
        rect,
        this.unifiedContainerDimensions[dflexElm.depth]
      );

      dflexElm.DOMGrid.clone(container.grid);
    }
  }

  private _initBranch(SK: string, depth: number, id: string, DOM: HTMLElement) {
    let container: DFlexParentContainer;
    let scroll: DFlexScrollContainer;

    if (!this.unifiedContainerDimensions[depth]) {
      this.unifiedContainerDimensions[depth] = Object.seal({
        width: 0,
        height: 0,
      });
    }

    const branch = this.DOMGen.getElmBranchByKey(SK);

    if (this.scrolls.has(SK)) {
      if (__DEV__) {
        throw new Error(
          `_initBranchScrollAndVisibility: Scroll with key:${SK} already exists.`
        );
      }

      scroll = this.scrolls.get(SK)!;
    } else {
      scroll = new DFlexScrollContainer(
        this.interactiveDOM.get(branch[0])!,
        SK,
        branch.length,
        true,
        updateBranchVisibilityLinearly.bind(null, this)
      );

      this.scrolls.set(SK, scroll);
    }

    if (this.containers.has(SK)) {
      if (__DEV__) {
        throw new Error(
          `_initBranchScrollAndVisibility: Container with key:${SK} already exists.`
        );
      }

      container = this.containers.get(SK)!;
    } else {
      container = new DFlexParentContainer(branch.length, id);

      this.containers.set(SK, container);
    }

    const initElmGrid = this._initElmGrid.bind(this, container);

    branch.forEach(initElmGrid);

    updateBranchVisibilityLinearly(this, SK);

    // This is not right, but it's workaround. The ideal solution is to observe the layer itself.
    // E.g, find a solution where we have the higher order parent.
    if (depth === 0) {
      addMutationObserver(this, SK, DOM);
    }
  }

  register(element: RegisterInputOpts) {
    if (!this._isDOM) {
      this._isDOM = canUseDOM();

      if (!this._isDOM) {
        return;
      }
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

  reconcileBranch(SK: string) {
    const container = this.containers.get(SK)!;
    const branch = this.getElmBranchByKey(SK);
    const parentDOM = this.interactiveDOM.get(container.id)!;

    scheduler(
      this,
      () => {
        if (__DEV__) {
          if (!parentDOM) {
            throw new Error(
              `Unable to commit: No DOM found for ${container.id}`
            );
          }

          if (featureFlags.enableCommit) {
            // eslint-disable-next-line no-console
            console.info("Reconcile branch: ", branch);
          }
        }

        this.observer.get(SK)!.disconnect();
        DOMReconciler(branch, parentDOM, this, container, true);
      },
      {
        onUpdate: () => {
          addMutationObserver(this, SK, parentDOM);
        },
      },
      {
        type: "mutation",
        mutation: "committed",
        target: parentDOM,
        ids: branch,
      }
    );
  }

  /**
   *
   * @param id
   * @returns
   */
  commit(id?: string): void {
    let dp = 0;

    if (id !== undefined) {
      const dflexElm = this.registry.get(id);

      if (!dflexElm) {
        if (__DEV__) {
          throw new Error(
            `commit: Element with id:${id} not found in the registry.`
          );
        }

        return;
      }

      dp = dflexElm.depth;
    }

    this.getBranchesByDepth(dp).forEach(this.reconcileBranch);
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

  /**
   * Returns DFlexScrollContainer and element siblings for a given id.
   *
   * Note: These are static siblings, not the dynamic siblings.
   *
   * @param id
   * @returns
   */
  getScrollWithSiblingsByID(id: string): [DFlexScrollContainer, ELmBranch] {
    const {
      keys: { SK },
    } = this.registry.get(id)!;

    const scroll = this.scrolls.get(SK)!;
    const siblings = this.getElmBranchByKey(SK);

    return [scroll, siblings];
  }

  /**
   * Returns DFlexParentContainer for a given element id.
   *
   * @param id
   * @returns
   */
  getContainerByID(id: string): DFlexParentContainer {
    const {
      keys: { SK },
    } = this.registry.get(id)!;

    const container = this.containers.get(SK)!;

    return container;
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
      VDOMOrder: { self },
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

    // Destroys all connected observers.
    this.observer.forEach((observer) => {
      observer!.disconnect();
    });
    this.observer.clear();
  }
}

export default DFlexDnDStore;
