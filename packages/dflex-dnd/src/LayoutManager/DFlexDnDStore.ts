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
  autoCleanupAllTimeouts,
  autoCleanupAllRAFs,
} from "@dflex/utils";

import {
  DFlexElement,
  DFlexParentContainer,
  DFlexScrollContainer,
  DFlexSerializedElement,
} from "@dflex/core-instance";

import {
  DFlexListeners,
  notifyLayoutStateListeners,
  notifyMutationListeners,
  LAYOUT_STATES,
} from "../Listeners";

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

import DFlexDOMReconciler from "./DFlexDOMReconciler";

import {
  DFlexIDGarbageCollector,
  hasGCInProgress,
} from "../Mutation/DFlexIDGarbageCollector";

type Containers = Map<string, DFlexParentContainer>;

type Scrolls = Map<string, DFlexScrollContainer>;

type UnifiedContainerDimensions = Record<number, Dimensions>;

type MutationObserverValue = MutationObserver | null;

type UpdatesQueue = [UpdateFn | null, SchedulerOptions | null][];

type Deferred = (() => void)[];

/**
 * Represents the scroll position as a tuple of **left** and **top** coordinates.
 */
type ScrollPosTuple = [number, number];

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

const { PENDING, READY } = LAYOUT_STATES;

let hasThrownForID = false;

// eslint-disable-next-line no-shadow
enum PENDING_REASON {
  REGISTER,
  // UNREGISTER,
}

type PendingReason = PENDING_REASON.REGISTER;

class DFlexDnDStore extends DFlexBaseStore {
  containers: Containers;

  scrolls: Scrolls;

  unifiedContainerDimensions: UnifiedContainerDimensions;

  mutationObserverMap: Map<string, MutationObserverValue>;

  listeners: ReturnType<typeof DFlexListeners> | null;

  migration: DFlexCycle;

  updatesQueue: UpdatesQueue;

  isUpdating: boolean;

  isComposing: boolean;

  deferred: Deferred;

  pending: [() => void, PendingReason][];

  private _terminatedDOMiDs: TerminatedDOMiDs;

  private _unregisterSchedule: TimeoutFunction;

  private _isDOM: boolean;

  private _isInitialized: boolean;

  private _resizeThrottle: TimeoutFunction;

  constructor() {
    super();
    this.containers = new Map();
    this.scrolls = new Map();
    this.unifiedContainerDimensions = {};

    // Observers.
    this.mutationObserverMap = new Map();

    this._terminatedDOMiDs = new Set();
    [this._unregisterSchedule] = DFlexCreateTimeout(0);

    // @ts-ignore- `null` until we have element to drag.
    this.migration = null;
    this._isInitialized = false;
    this._isDOM = false;

    [this._resizeThrottle] = DFlexCreateTimeout(100);

    this.isComposing = false;
    this.isUpdating = false;
    this.deferred = [];
    this.updatesQueue = [];
    this.pending = [];
    this.listeners = this.globals.enableListeners ? DFlexListeners() : null;

    this._initSiblings = this._initSiblings.bind(this);
    this._initObservers = this._initObservers.bind(this);
    this._windowResizeHandler = this._windowResizeHandler.bind(this);
  }

  private _isIdle(): boolean {
    return (
      !this.isUpdating &&
      this.updatesQueue.length === 0 &&
      this.deferred.length === 0
    );
  }

  isLayoutAvailable(): boolean {
    return (
      this._isIdle() &&
      this.pending.length === 0 &&
      !(this.isComposing || hasGCInProgress() || hasMutationsInProgress())
    );
  }

  private _initWhenRegister(): void {
    if (this.listeners) {
      notifyLayoutStateListeners(this.listeners, PENDING);
    }

    window.addEventListener("resize", this._windowResizeHandler);
  }

  linkElmToContainerGrid(
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

    if (__DEV__) {
      if (featureFlags.enableReconcileDebugger) {
        // eslint-disable-next-line no-console
        console.log(`${dflexElm.id} grid is`, JSON.stringify(gridIndex));
      }
    }

    dflexElm.DOMGrid.clone(gridIndex);
  }

  private _syncSiblingElmRectsWithGrid(
    siblingsIDs: readonly string[],
    container: DFlexParentContainer,
    scrollTuple: ScrollPosTuple,
    reconciledIDs: Set<string> | null,
  ) {
    container.resetIndicators(siblingsIDs.length);

    for (let i = 0; i <= siblingsIDs.length - 1; i += 1) {
      const elmID = siblingsIDs[i];

      const [dflexElm, DOM] = this.getElmWithDOM(elmID);

      // If no `reconciledIDs` are provided, it means all elements need initialization.
      // If `reconciledIDs` are specified, only the affected elements will be checked.
      if (!reconciledIDs || reconciledIDs.has(elmID)) {
        const [scrollLeft, scrollTop] = scrollTuple;

        dflexElm.initElmRect(DOM, scrollLeft, scrollTop);
      }

      this.linkElmToContainerGrid(container, dflexElm);

      if (__DEV__) {
        updateElmDatasetGrid(DOM, dflexElm.DOMGrid);
      }
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

    const siblings = this.DOMGen.getSiblingsByKey(SK);

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

    const {
      totalScrollRect: { left, top },
    } = scroll;

    const scrollTuple: ScrollPosTuple = [left, top];

    this._syncSiblingElmRectsWithGrid(siblings, container, scrollTuple, null);

    updateSiblingsVisibilityLinearly(this, SK);
  }

  private _executePendingFunctions(reason: PendingReason) {
    this.pending.forEach(([fn, r]) => {
      if (r === reason) {
        scheduler(this, fn, null);
      }
    });

    this.pending = this.pending.filter(([, r]) => r !== reason);
  }

  private _initObservers() {
    const containerIDs = this.DOMGen.getTopLevelSKs();

    containerIDs.forEach(({ id }) => {
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

    this._executePendingFunctions(PENDING_REASON.REGISTER);

    if (this.listeners) {
      notifyLayoutStateListeners(this.listeners, READY);
    }
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

    const {
      id,
      readonly = false,
      depth = 0,
      CSSTransform = null,
      animation: _userAnimation,
    } = elm;

    if (__DEV__) {
      if (!hasThrownForID && /^\d+$/.test(id)) {
        hasThrownForID = true;
        // eslint-disable-next-line no-console
        console.error(
          `DFlex register: Invalid ID (${id}) provided. Expected a non-numeric value, but received a number.`,
        );
      }
    }

    const animation = getAnimationOptions(_userAnimation);

    // DFlex optimizes registration so that when one sibling is registered, all
    // the other siblings are automatically registered as well. Therefore, it is
    // acceptable if the incoming element is already in the store. However, if
    // the element is not connected to the DOM, we need to clean up the
    // registry.
    const dflexElm = this.registry.get(id);

    if (dflexElm) {
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

      if (DOM.isSameNode(DOM)) {
        // Update default values created earlier.
        dflexElm.updateConfig(readonly, animation, CSSTransform);

        if (__DEV__) {
          if (featureFlags.enableRegisterDebugger) {
            // eslint-disable-next-line no-console
            console.warn(
              `Skipping registrations for ${id} because it's already registered.`,
            );
          }

          validateCSS(id, elm.CSSTransform);
        }
        return;
      }
    }

    if (__DEV__) {
      if (featureFlags.enableRegisterDebugger) {
        // eslint-disable-next-line no-console
        console.log(`Received id (${id}) to register`);
      }

      // Validate without initialize.
      validateCSS(id, elm.CSSTransform);

      if (hasGCInProgress()) {
        throw new Error(
          `Garbage Collector process is already in progress. Cannot register new elements.`,
        );
      }
    }

    scheduler(
      this,
      () => {
        const coreInput: RegisterInputProcessed = {
          id,
          readonly,
          depth,
          CSSTransform,
          animation,
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

  deleteFromRegistry(id: string): void {
    super.unregister(id);
  }

  unregister(id: string): void {
    if (__DEV__) {
      if (featureFlags.enableMutationDebugger) {
        // eslint-disable-next-line no-console
        console.log(`Received id (${id}) to unregister`);
      }
    }

    if (!this.registry.has(id)) {
      if (__DEV__) {
        if (featureFlags.enableMutationDebugger) {
          // eslint-disable-next-line no-console
          console.warn(
            "Ignoring unregister: Registration process still ongoing.",
          );
        }
      }

      return;
    }

    if (this.isComposing) {
      const unregisterLater = () => {
        this.unregister(id);
      };

      // Add the unregister function to the pending tasks.
      this.pending.push([unregisterLater, PENDING_REASON.REGISTER]);

      if (__DEV__) {
        if (featureFlags.enableMutationDebugger) {
          // eslint-disable-next-line no-console
          console.warn(`Postponed unregister for id (${id})`);
        }
      }

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
          if (featureFlags.enableMutationDebugger) {
            // eslint-disable-next-line no-console
            console.log(
              "Aborting unregister. Cleanup handling will be performed by the mutation observer.",
            );
          }
        }

        return;
      }

      scheduler(
        this,
        () => DFlexIDGarbageCollector(this, this._terminatedDOMiDs),
        {
          onUpdate: () => this._terminatedDOMiDs.clear(),
        },
      );
    }, true);
  }

  private _refreshBranchesRect() {
    this.containers.forEach((container, SK) => {
      const hasContainerMigrated =
        this.migration && this.migration.getMigrationBySK(SK);

      // If migrated then the reconciler will trigger `_syncSiblingElmRectsWithGrid`.
      if (!hasContainerMigrated) {
        const scroll = this.scrolls.get(SK)!;
        const siblings = this.getElmSiblingsByKey(SK);

        const {
          totalScrollRect: { left, top },
        } = scroll;

        const scrollTuple: ScrollPosTuple = [left, top];

        this._syncSiblingElmRectsWithGrid(
          siblings,
          container,
          scrollTuple,
          null,
        );
      } else if (__DEV__) {
        if (featureFlags.enableReconcileDebugger) {
          // eslint-disable-next-line no-console
          console.log(
            `Container ${SK} is being passed for synchronization during reconciliation.`,
          );
        }
      }
    });
  }

  private _forEachContainerDOM(cb: (DOM: HTMLElement) => void) {
    this.containers.forEach((container) => {
      const DOM = this.interactiveDOM.get(container.id)!;

      cb(DOM);
    });
  }

  private _isEmptyMigration() {
    const isEmptyMigration =
      this.migration === null || this.migration.SKs.length === 0;

    return isEmptyMigration;
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

    if (this._isEmptyMigration()) {
      this._refreshBranchesRect();

      return;
    }

    const commitCB = () => this._refreshBranchesRect();

    this._commitChangesToDOM(true, commitCB);
  }

  private _reconcileSiblings(SK: string, syncAllSiblings: boolean): void {
    const container = this.containers.get(SK)!;
    const scroll = this.scrolls.get(SK)!;

    if (__DEV__) {
      if (!container) {
        throw new Error(`Container is not defined for element with SK: ${SK}`);
      }

      if (!scroll) {
        throw new Error(
          `Scroll container is not defined for element with SK: ${SK}`,
        );
      }
    }

    const siblings = this.getElmSiblingsByKey(SK);

    if (siblings.length === 0) {
      if (__DEV__) {
        if (featureFlags.enableReconcileDebugger) {
          // eslint-disable-next-line no-console
          console.warn(
            `No sibling elements found for SK: ${SK}. Nothing to reconcile.`,
          );
        }
      }

      return;
    }

    const parentDOM = this.interactiveDOM.get(container.id)!;

    if (__DEV__) {
      if (!(parentDOM instanceof HTMLElement)) {
        throw new Error(
          `Parent DOM element is not of type HTMLElement for container with ID: ${container.id}`,
        );
      }
    }

    scheduler(
      this,
      () => {
        DFlexDOMReconciler(siblings, parentDOM, SK, this);
      },
      {
        onUpdate: () => {
          const hasChanged = scroll.hasScrollDimensionChanges();

          if (hasChanged) {
            const { length } = siblings;

            const refDOM: HTMLElement | null =
              length > 0 ? this.interactiveDOM.get(siblings[0])! : null;

            scroll.initScrollContainer(refDOM!, length);
          }

          const {
            totalScrollRect: { left, top },
          } = scroll;

          const scrollTuple: ScrollPosTuple = [left, top];

          this._syncSiblingElmRectsWithGrid(
            siblings,
            container,
            scrollTuple,
            syncAllSiblings ? null : this.migration.getReconciledIDsBySK(SK),
          );

          if (this.listeners) {
            notifyMutationListeners(this.listeners, siblings, parentDOM);
          }
        },
      },
    );
  }

  private _commitChangesToDOM(
    syncAllSiblings: boolean,
    callback: (() => void) | null = null,
  ): void {
    if (this._isEmptyMigration()) {
      if (__DEV__) {
        // eslint-disable-next-line no-console
        console.warn("Migration is empty. Nothing to commit.");
      }

      return;
    }

    this.isComposing = true;

    const reconcile = (SK: string) =>
      this._reconcileSiblings(SK, syncAllSiblings);

    if (__DEV__) {
      if (featureFlags.enableCommit) {
        if (this.migration === null) {
          // eslint-disable-next-line no-console
          console.warn("Migration is not set yet. Nothing to commit.");
          // eslint-disable-next-line no-console
          console.warn();
          // eslint-disable-next-line no-console
          console.warn("Executing commit for zero depth layer.");

          this.getSiblingKeysByDepth(0).forEach(reconcile);

          return;
        }

        this.migration.SKs.forEach(reconcile);

        return;
      }
    }

    disconnectObservers(this);

    this.migration.SKs.forEach(reconcile);

    scheduler(this, callback, {
      onUpdate: () => {
        // Done reconciliation.
        connectObservers(this);

        this.migration.clear();

        this.isComposing = false;
      },
    });
  }

  commit(callback?: () => void): void {
    this._commitChangesToDOM(false, callback);
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

  getScrollByID(id: string): DFlexScrollContainer {
    const SK = this.getSKByID(id);

    if (__DEV__) {
      if (!this.scrolls.has(SK)) {
        throw new Error(`Scroll with key '${SK}' is not found.`);
      }
    }

    const scroll = this.scrolls.get(SK)!;

    return scroll;
  }

  getContainerByID(id: string): DFlexParentContainer | undefined {
    const SK = this.getSKByID(id);

    if (__DEV__) {
      if (!this.containers.has(SK)) {
        // eslint-disable-next-line no-console
        console.warn(
          `Container with key '${SK}' is not found. Ignore this warning If this element '${id}' is a parent.`,
        );
      }
    }

    const container = this.containers.get(SK);

    return container;
  }

  getParentByElmID(id: string): [string, HTMLElement] | undefined {
    const container = this.getContainerByID(id);

    if (container) {
      const { id: parentID } = container;

      if (__DEV__) {
        if (!this.interactiveDOM.has(id)) {
          throw new Error(`DOM element for ID '${id}' is not found.`);
        }
      }

      const parentDOM = this.interactiveDOM.get(parentID)!;

      return [parentID, parentDOM];
    }

    return undefined;
  }

  getParentBySK(SK: string): HTMLElement | undefined {
    const container = this.containers.get(SK)!;

    if (container) {
      const target = this.interactiveDOM.get(container.id);

      return target;
    }

    return undefined;
  }

  cleanupSiblingsAttachments(BK: string, SK: string, depth: number): void {
    const scroll = this.scrolls.get(SK)!;

    if (__DEV__) {
      if (!scroll && depth === 0) {
        throw new Error(
          `cleanupSiblingsAttachments: Scroll container with SK: ${SK} doesn't exists`,
        );
      }
    }

    if (scroll) {
      scroll.destroy();

      this.scrolls.delete(SK);
    }

    const deletedContainer = this.containers.delete(SK);

    if (__DEV__) {
      if (!deletedContainer && depth === 0) {
        throw new Error(
          `cleanupSiblingsAttachments: Container with SK: ${SK} doesn't exists`,
        );
      }
    }

    const [, { ids }] = this.DOMGen.getHighestDepthInBranch(BK)!;

    const branchParentID = ids[0];

    // At some point there's going to be a parent with dead end.
    if (this.mutationObserverMap.has(branchParentID)) {
      this.mutationObserverMap.get(branchParentID)!.disconnect();

      const deletedObserver = this.mutationObserverMap.delete(branchParentID);

      if (__DEV__) {
        if (!deletedObserver) {
          throw new Error(
            `cleanupSiblingsAttachments: Mutation Observer with id: ${branchParentID} doesn't exists`,
          );
        }
      }
    }

    // Delete pending migration when the DOM element is no longer exists.
    if (this.migration !== null) {
      this.migration.pruneSKFromMigration(SK);
    }

    // Self destroy the store and related instances.
    if (this.registry.size === 0) {
      this._cleanup();
    }
  }

  /**
   * Retrieves store attachments for debugging purposes.
   *
   * @note This method will be removed in production builds.
   */
  _DEV_getStoreAttachments() {
    return {
      containers: Object.fromEntries(this.containers),
      scrolls: Object.fromEntries(this.scrolls),
      mutationObserverMap: Object.fromEntries(this.mutationObserverMap),
    };
  }

  private _cleanup(): void {
    window.removeEventListener("resize", this._windowResizeHandler);

    autoCleanupAllTimeouts();
    autoCleanupAllRAFs();

    this._isInitialized = false;
  }

  destroy(): void {
    // Nothing to destroy.
    if (this._isInitialized) {
      return;
    }

    this.containers.clear();

    if (this.listeners) {
      this.listeners.clear();
    }

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

    this._cleanup();
  }
}

export default DFlexDnDStore;
