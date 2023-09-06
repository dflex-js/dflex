/* eslint-disable no-unused-vars */
import DFlexBaseStore from "@dflex/store";
import type { RegisterInputOpts, RegisterInputProcessed } from "@dflex/store";

import {
  canUseDOM,
  Dimensions,
  featureFlags,
  DFlexCycle,
  clearComputedStyleCache,
  updateElmDatasetGrid,
  setFixedDimensions,
  CSS,
  getAnimationOptions,
  removeStyleProperty,
  TimeoutFunction,
  DFlexCreateTimeout,
} from "@dflex/utils";

import {
  DFlexElement,
  DFlexParentContainer,
  DFlexScrollContainer,
  DFlexSerializedElement,
} from "@dflex/core-instance";

import initDFlexListeners, {
  DFlexListenerPlugin,
  DFlexListenerEvents,
} from "./DFlexListeners";

import scheduler, { SchedulerOptions, UpdateFn } from "./DFlexScheduler";

import updateSiblingsVisibilityLinearly from "./DFlexVisibilityUpdater";

import {
  addObserver,
  connectObservers,
  disconnectObservers,
  hasMutationsInProgress,
  DFlexDirtyLeavesCollector,
  TerminatedDOMiDs,
} from "../Mutation";

import DOMReconciler from "./DFlexDOMReconciler";
import DFlexIDGarbageCollector from "../Mutation/DFlexIDGarbageCollector";

type Containers = Map<string, DFlexParentContainer>;

type Scrolls = Map<string, DFlexScrollContainer>;

type UnifiedContainerDimensions = Record<number, Dimensions>;

type MutationObserverValue = MutationObserver | null;

type UpdatesQueue = [
  UpdateFn | null,
  SchedulerOptions | null,
  DFlexListenerEvents | undefined,
][];

type Deferred = (() => void)[];

function validateCSS(id: string, css?: CSS): void {
  if (css !== undefined && typeof css !== "string" && typeof css !== "object") {
    throw new Error(
      `Invalid CSS type for element ${id}. Expected a non-empty string, non-empty object, or undefined.`,
    );
  }

  if (typeof css === "string") {
    if (css.trim().length === 0) {
      throw new Error(
        `Invalid CSS value for element ${id}. Expected a non-empty string.`,
      );
    }

    const isCamelCase = /[A-Z]/.test(css);
    if (isCamelCase) {
      const snakeCase = css.replace(
        /[A-Z]/g,
        (match) => `-${match.toLowerCase()}`,
      );
      throw new Error(
        `Invalid CSS rule for element ${id}. The property '${css}' should be in snake_case. Use '${snakeCase}' instead.`,
      );
    }
  }

  if (typeof css === "object" && Object.keys(css).length === 0) {
    throw new Error(
      `Invalid CSS value for element ${id}. Expected a non-empty object.`,
    );
  }

  if (typeof css === "object") {
    const convertedProperties: Record<string, string> = {};
    Object.entries(css).forEach(([key, value]) => {
      if (/[A-Z]/.test(key)) {
        const snakeCaseKey = key.replace(
          /[A-Z]/g,
          (match) => `-${match.toLowerCase()}`,
        );
        if (typeof value !== "string" && value !== null) {
          throw new Error(
            `Invalid CSS value for element ${id}. Property '${key}' should have a value of type null or string. Received: ${value}`,
          );
        }
        convertedProperties[snakeCaseKey] = value!;
        if (snakeCaseKey !== key) {
          throw new Error(
            `Invalid CSS rule for element ${id}. The property '${key}' should be in snake_case. Use '${snakeCaseKey}' instead.`,
          );
        }
      } else {
        if (typeof value === "object" && value !== null) {
          throw new Error(
            `Invalid CSS value for element ${id}. Property '${key}' should have a value of type null or string. Received: ${value}`,
          );
        } else if (typeof value !== "string" && value !== null) {
          throw new Error(
            `Invalid CSS value for element ${id}. Property '${key}' should have a value of type null or string. Received: ${value}`,
          );
        }
        convertedProperties[key] = value as string;
      }
    });
  }
}

class DFlexDnDStore extends DFlexBaseStore {
  containers: Containers;

  scrolls: Scrolls;

  unifiedContainerDimensions: UnifiedContainerDimensions;

  mutationObserverMap: Map<string, MutationObserverValue>;

  listeners: DFlexListenerPlugin;

  migration: DFlexCycle;

  updatesQueue: UpdatesQueue;

  isUpdating: boolean;

  isComposing: boolean;

  deferred: Deferred;

  private _terminatedDOMiDs: TerminatedDOMiDs;

  private _unregisterSchedule: TimeoutFunction;

  private _isDOM: boolean;

  private _isInitialized: boolean;

  private _refreshAllElmBranchWhileReconcile?: boolean;

  private _resizeThrottle: TimeoutFunction;

  constructor() {
    super();
    this.containers = new Map();
    this.scrolls = new Map();
    this.unifiedContainerDimensions = {};
    this._terminatedDOMiDs = new Set();
    [this._unregisterSchedule] = DFlexCreateTimeout(0);

    // @ts-ignore- `null` until we have element to drag.
    this.migration = null;
    this._isInitialized = false;
    this._isDOM = false;

    [this._resizeThrottle] = DFlexCreateTimeout(100);

    // Observers.
    this.mutationObserverMap = new Map();

    this.isComposing = false;
    this.isUpdating = false;
    this.deferred = [];
    this.updatesQueue = [];
    this.listeners = initDFlexListeners();

    this._initSiblings = this._initSiblings.bind(this);
    this._initObservers = this._initObservers.bind(this);
    this._windowResizeHandler = this._windowResizeHandler.bind(this);
  }

  isIdle(): boolean {
    return (
      !this.isUpdating &&
      this.updatesQueue.length === 0 &&
      this.deferred.length === 0
    );
  }

  isLayoutAvailable(): boolean {
    return !(this.isComposing || hasMutationsInProgress()) && this.isIdle();
  }

  private _initWhenRegister() {
    window.addEventListener("resize", this._windowResizeHandler);

    scheduler(this, null, null, {
      type: "layoutState",
      status: "pending",
    });
  }

  setElmGridBridge(
    container: DFlexParentContainer,
    dflexElm: DFlexElement,
  ): void {
    // Using element grid zero to know if the element has been initiated inside
    // container or not.
    const { rect } = dflexElm;

    const gridIndex = container.register(
      rect,
      this.unifiedContainerDimensions[dflexElm.depth],
    );

    dflexElm.DOMGrid.clone(gridIndex);
  }

  private _resumeAndInitElmGrid(
    container: DFlexParentContainer,
    scroll: DFlexScrollContainer,
    id: string,
  ): void {
    const [dflexElm, DOM] = this.getElmWithDOM(id);

    const {
      totalScrollRect: { left, top },
    } = scroll;

    dflexElm.initElmRect(DOM, left, top);

    this.setElmGridBridge(container, dflexElm);

    if (__DEV__) {
      updateElmDatasetGrid(DOM, dflexElm.DOMGrid);
    }
  }

  private _initSiblings(
    SK: string,
    parentDepth: number,
    parentDOM: HTMLElement,
  ) {
    // Unified dimension is for siblings/children depth.
    if (!this.unifiedContainerDimensions[parentDepth - 1]) {
      const unifiedContainerDimensions = {
        width: 0,
        height: 0,
      };

      this.unifiedContainerDimensions[parentDepth - 1] = __DEV__
        ? Object.seal(unifiedContainerDimensions)
        : unifiedContainerDimensions;
    }

    const siblings = this.DOMGen.getElmSiblingsByKey(SK);

    if (__DEV__) {
      if (featureFlags.enableRegisterDebugger) {
        // eslint-disable-next-line no-console
        console.log(`_initSiblings: ${SK}`, siblings);
      }

      if (siblings.length === 0 || !this.interactiveDOM.has(siblings[0])) {
        throw new Error(
          `_initSiblings: Unable to find DOM element for siblings ${JSON.stringify(
            siblings,
          )} at index 0.`,
        );
      }
    }

    const firstELmDOM = this.interactiveDOM.get(siblings[0])!;

    const scrollEventCallback = updateSiblingsVisibilityLinearly.bind(
      null,
      this,
    );

    const scroll = new DFlexScrollContainer(
      firstELmDOM,
      SK,
      siblings.length,
      scrollEventCallback,
    );

    if (this.scrolls.has(SK)) {
      if (__DEV__) {
        // eslint-disable-next-line no-console
        console.warn(`_initSiblings: Scroll with key ${SK} already exists.`);
      }

      this.scrolls.get(SK)!.destroy();
    }

    this.scrolls.set(SK, scroll);

    const container = new DFlexParentContainer(
      parentDOM.id,
      parentDOM,
      siblings.length,
      scroll.totalScrollRect,
    );

    if (this.containers.has(SK)) {
      if (__DEV__) {
        // eslint-disable-next-line no-console
        console.warn(`_initSiblings: Container with key:${SK} already exists.`);
      }

      // this.containers.get(SK)!.destroy();
    }

    this.containers.set(SK, container);

    const initElmGrid = this._resumeAndInitElmGrid.bind(
      this,
      container,
      scroll,
    );

    siblings.forEach(initElmGrid);

    updateSiblingsVisibilityLinearly(this, SK);
  }

  private _initObservers() {
    const highestSKInAllBranches = this.DOMGen.getHighestSKInAllBranches();

    highestSKInAllBranches.forEach(({ id }) => {
      if (__DEV__) {
        if (!this.interactiveDOM.has(id)) {
          throw new Error(`_initObservers: Unable to find DOM for SK: ${id}`);
        }
      }

      if (!this.mutationObserverMap.has(id)) {
        const parentDOM = this.interactiveDOM.get(id)!;

        addObserver(this, id, parentDOM);

        if (__DEV__) {
          if (featureFlags.enableRegisterDebugger) {
            // eslint-disable-next-line no-console
            console.log(`_initObservers: observe ${id}`);
          }
        }
      } else if (__DEV__) {
        if (featureFlags.enableRegisterDebugger) {
          // eslint-disable-next-line no-console
          console.log(`_initObservers: ${id} already exist`);
        }
      }
    });

    this.isComposing = false;

    this.endRegistration();

    scheduler(this, null, null, { type: "layoutState", status: "ready" });
  }

  register(elm: RegisterInputOpts) {
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

    this.isComposing = true;

    const { id, readonly = false, depth = 0, CSSTransform = null } = elm;

    // DFlex optimizes registration so that when one sibling is registered, all
    // the other siblings are automatically registered as well. Therefore, it is
    // acceptable if the incoming element is already in the store. However, if
    // the element is not connected to the DOM, we need to clean up the
    // registry.
    if (this.registry.has(id)) {
      const DOM = this.interactiveDOM.get(id)!;

      if (!DOM.isConnected) {
        if (__DEV__) {
          if (featureFlags.enableRegisterDebugger) {
            throw new Error(
              `The element with ID ${id} is already registered, but its DOM is not connected. This situation can lead to memory leaks and unpredictable behavior. ` +
                `To prevent this, please make sure to call "store.unregister(${id})" to properly clean up the element before attempting to re-register it.`,
            );
          }
        }

        DFlexDirtyLeavesCollector(this, 0);
      }
    }

    if (__DEV__) {
      // Validate without initialize.
      validateCSS(id, elm.CSSTransform);
    }

    scheduler(
      this,
      () => {
        const coreInput: RegisterInputProcessed = {
          id,
          readonly,
          depth,
          CSSTransform,
          animation: getAnimationOptions(elm.animation),
        };

        if (__DEV__) {
          Object.freeze(coreInput);
        }

        // Create an instance of DFlexCoreNode and gets the DOM element into the store.
        this.addElmToRegistry(
          coreInput,
          this._initSiblings,
          this._initObservers,
        );
      },
      null,
    );
  }

  unregister(id: string): void {
    // If the regeneration process is still ongoing and an 'unregister' has been
    // called, then we should ignore this call.
    if (!this.registry.has(id)) {
      return;
    }

    // Same scenario as above: The element is registered, but the process of
    // registering siblings is still active.
    if (this.isComposing) {
      return;
    }

    // If unregister has been triggered more than once, ignore any calls except
    // the first one.
    if (this._terminatedDOMiDs.has(id)) {
      return;
    }

    this._terminatedDOMiDs.add(id);

    // Delay execution to prevent a race condition with the mutation observer.
    // Instead, reschedule and then check the observer flag.
    this._unregisterSchedule(() => {
      // Abort and clear pending IDs, allowing the observer to handle them.
      if (hasMutationsInProgress()) {
        this._terminatedDOMiDs.clear();

        if (__DEV__) {
          if (featureFlags.enableRegisterDebugger) {
            // eslint-disable-next-line no-console
            console.log(
              "Aborting unregister. Cleanup handling will be performed by the mutation observer.",
            );
          }
        }

        return;
      }

      DFlexIDGarbageCollector(this, this._terminatedDOMiDs);
      this._terminatedDOMiDs.clear();
    }, true);
  }

  private _updateContainerRect(
    container: DFlexParentContainer,
    containerKy: string,
    siblings: string[],
  ) {
    const scroll = this.scrolls.get(containerKy)!;

    const {
      totalScrollRect: { left, top },
    } = scroll;

    container.resetIndicators(siblings.length);

    siblings.forEach((elmID) => {
      const [dflexElm, elmDOM] = this.getElmWithDOM(elmID);

      dflexElm.initElmRect(elmDOM, left, top);

      container.register(
        dflexElm.rect,
        this.unifiedContainerDimensions[dflexElm.depth],
      );
    });
  }

  private _refreshBranchesRect(excludeMigratedContainers: boolean) {
    this.containers.forEach((container, containerKy) => {
      const shouldExcludeContainer =
        excludeMigratedContainers &&
        this.migration.containerKeys.has(containerKy);

      if (!shouldExcludeContainer) {
        const siblings = this.getElmSiblingsByKey(containerKy);

        this._updateContainerRect(container, containerKy, siblings);
      }
    });
  }

  private _forEachContainerDOM(cb: (DOM: HTMLElement) => void) {
    this.containers.forEach((container) => {
      const DOM = this.interactiveDOM.get(container.id)!;

      cb(DOM);
    });
  }

  private _windowResizeHandler() {
    this._forEachContainerDOM((DOM) => {
      removeStyleProperty(DOM, "width");
      removeStyleProperty(DOM, "height");
    });

    const throttleCB = () => {
      clearComputedStyleCache();

      this._forEachContainerDOM((DOM) => {
        setFixedDimensions(DOM);
      });
    };

    this._resizeThrottle(throttleCB, true);

    this._refreshAllElmBranchWhileReconcile = true;

    if (this.migration === null || this.migration.containerKeys.size === 0) {
      this._refreshBranchesRect(false);

      return;
    }

    // Reconcile then update Rects.
    this.commit(() => this._refreshBranchesRect(true));
  }

  private _reconcileBranch(
    SK: string,
    refreshAllBranchElements: boolean,
  ): void {
    const container = this.containers.get(SK)!;
    const scroll = this.scrolls.get(SK)!;
    const branch = this.getElmSiblingsByKey(SK);
    const parentDOM = this.interactiveDOM.get(container.id)!;

    scheduler(
      this,
      () => {
        if (__DEV__) {
          if (!parentDOM) {
            throw new Error(
              `Unable to commit: No DOM found for ${container.id}`,
            );
          }
        }

        DOMReconciler(
          branch,
          parentDOM,
          this,
          container,
          scroll,
          refreshAllBranchElements,
        );
      },
      null,
      {
        type: "mutation",
        status: "committed",
        payload: {
          target: parentDOM,
          ids: branch,
        },
      },
    );
  }

  /**
   *
   * @returns
   */
  commit(callback: (() => void) | null = null): void {
    if (this.migration === null || this.migration.containerKeys.size === 0) {
      if (__DEV__) {
        // eslint-disable-next-line no-console
        console.warn("Migration is empty. Nothing to commit.");
      }

      return;
    }

    this.isComposing = true;

    const refreshAllBranchElements =
      this._refreshAllElmBranchWhileReconcile === undefined
        ? // If more than one container involved reset all.
          this.migration.containerKeys.size > 1
        : this._refreshAllElmBranchWhileReconcile;

    if (__DEV__) {
      if (featureFlags.enableCommit) {
        if (this.migration === null) {
          // eslint-disable-next-line no-console
          console.warn("Migration is not set yet. Nothing to commit.");
          // eslint-disable-next-line no-console
          console.warn();
          // eslint-disable-next-line no-console
          console.warn("Executing commit for zero depth layer.");

          this.getSiblingKeysByDepth(0).forEach((k) =>
            this._reconcileBranch(k, refreshAllBranchElements),
          );

          return;
        }

        this.migration.containerKeys.forEach((k) => {
          this._reconcileBranch(k, refreshAllBranchElements);
        });

        return;
      }
    }

    disconnectObservers(this);

    this.migration.containerKeys.forEach((k) => {
      this._reconcileBranch(k, refreshAllBranchElements);
    });

    scheduler(this, callback, {
      onUpdate: () => {
        // Done reconciliation.
        connectObservers(this);

        this.migration.clear();

        this._refreshAllElmBranchWhileReconcile = undefined;
        this.isComposing = false;
      },
    });
  }

  getSerializedElm(id: string): DFlexSerializedElement | null {
    if (__DEV__) {
      if (!this.registry.has(id)) {
        throw new Error(
          `getSerializedElm: Element with id ${id} does not exist in the registry.`,
        );
      }
    }

    return this.registry.has(id)
      ? this.registry.get(id)!.getSerializedInstance()
      : null;
  }

  getElmKeyByID(id: string) {
    if (__DEV__) {
      if (!this.registry.has(id)) {
        throw new Error(`Element with ID '${id}' is not registered.`);
      }
    }

    const {
      keys: { SK },
    } = this.registry.get(id)!;

    return SK;
  }

  getScrollByID(id: string): DFlexScrollContainer {
    const SK = this.getElmKeyByID(id);

    if (__DEV__) {
      if (!this.scrolls.has(SK)) {
        throw new Error(`Scroll with key '${SK}' is not found.`);
      }
    }

    const scroll = this.scrolls.get(SK)!;

    return scroll;
  }

  getContainerByID(id: string): DFlexParentContainer {
    const SK = this.getElmKeyByID(id);

    if (__DEV__) {
      if (!this.containers.has(SK)) {
        throw new Error(`Container with key '${SK}' is not found.`);
      }
    }

    const container = this.containers.get(SK)!;

    return container;
  }

  getParentByElmID(id: string): [string, HTMLElement] {
    const { id: parentID } = this.getContainerByID(id);

    if (__DEV__) {
      if (!this.interactiveDOM.has(id)) {
        throw new Error(`DOM element for ID '${id}' is not found.`);
      }
    }

    const parentDOM = this.interactiveDOM.get(id)!;

    return [parentID, parentDOM];
  }

  deleteElm(id: string, BK: string): void {
    this.DOMGen.removeIDFromBranch(id, BK);

    super.unregister(id);
  }

  deleteSiblings(SK: string, BK: string, depth: number): void {
    this.DOMGen.destroySiblings(SK, BK, depth);

    const scroll = this.scrolls.get(SK)!;

    if (__DEV__) {
      if (!scroll) {
        throw new Error(
          `deleteSiblings: Scroll container with SK: ${SK} doesn't exists`,
        );
      }
    }

    scroll.destroy();

    this.scrolls.delete(SK);

    const deletedContainer = this.containers.delete(SK);

    if (__DEV__) {
      if (!deletedContainer) {
        throw new Error(
          `deleteSiblings: Container with SK: ${SK} doesn't exists`,
        );
      }
    }

    const SKIDs = this.DOMGen.getHighestSKInAllBranches();

    SKIDs.forEach(({ SK: _SK, id }) => {
      if (SK === _SK) {
        this.mutationObserverMap.get(id)!.disconnect();

        const deletedObserver = this.mutationObserverMap.delete(id);

        if (__DEV__) {
          if (!deletedObserver) {
            throw new Error(
              `deleteSiblings: Mutation Observer with id: ${id} doesn't exists`,
            );
          }
        }
      }
    });

    if (__DEV__) {
      if (featureFlags.enableRegisterDebugger) {
        // eslint-disable-next-line no-console
        console.log(`deleteSiblings for SK: ${SK}`);
      }
    }
  }

  destroy(): void {
    this.containers.clear();
    this.listeners.clear();

    // Destroys all scroll containers.
    this.scrolls.forEach((scroll) => {
      scroll.destroy();
    });
    this.scrolls.clear();

    // Destroys all connected observers.
    disconnectObservers(this);
    this.mutationObserverMap.clear();

    // TODO:
    // Migration is initiated with null. But it's not typed as such.
    if (this.migration) {
      this.migration.clear();
    }

    // Destroys all registered local instances in parent class.
    super.destroy();

    window.removeEventListener("resize", this._windowResizeHandler);

    this._initSiblings = undefined as any;
    this._initObservers = undefined as any;
    this._windowResizeHandler = undefined as any;
  }
}

export default DFlexDnDStore;
