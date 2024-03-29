/* eslint-disable no-underscore-dangle */
import DOMKeysGenerator, { Keys } from "@dflex/dom-gen";

import { DFlexElement, DFlexElementInput } from "@dflex/core-instance";
import {
  AnimationOpts,
  CSS,
  CSSClass,
  CSSStyle,
  featureFlags,
  getAnimationOptions,
  getParentElm,
  removeOpacity,
  setParentDimensions,
  setRelativePosition,
  TaskQueue,
  updateIndexAttr,
} from "@dflex/utils";
import DFlexDOMManager from "./DFlexDOMManager";
import { getElmDOMOrThrow, assignElementID } from "./utils";

type DeepRequired<T> = {
  [K in keyof T]-?: T[K] extends object
    ? DeepRequired<T[K]>
    : NonNullable<T[K]>;
};

/**
 * The options for the `register` method in DnD store.
 */
export type RegisterInputOpts = {
  /** Targeted element ID. */
  id: string;

  /**
   * The depth of the targeted element within its container, starting from zero.
   * A higher depth value means the element is visually positioned above elements with lower depth values.
   * @default 0
   *
   * `Example`: 1, 2, 3, ...
   *
   */ depth?: number;

  /**
   * Indicates whether the element is read-only and won't be transformed during drag and drop interactions,
   * but it still belongs to the same interactive container.
   * @default false
   *
   */
  readonly?: boolean;

  /**
   * Configuration options for animations applied to the element being transformed during dragging.
   * If specified, the element will animate according to these options, overwriting the default values.
   * To disable animation altogether set the property to `null`.
   *
   * `Example`: { easing: 'ease-out', duration: 500 }
   */
  animation?: Partial<AnimationOpts>;

  /**
   * CSS to be applied to the element when it is being transformed during dragging.
   * The CSS will be removed when the element is settled in its new position.
   *
   * `Example`: "CSSTransform: 'dragged-element'" or "CSSTransform: { background: '#ff0000', opacity: 0.5 }"
   *
   * __Note__: CSS property names should be in snake_case.
   */
  CSSTransform?: CSSClass | CSSStyle;
};

/**
 * The processed data from user input for the `register` method in DnD store.
 */
export type RegisterInputProcessed = DeepRequired<
  Omit<RegisterInputOpts, "animation" | "CSSTransform">
> & {
  animation: AnimationOpts;
  CSSTransform: CSS | null;
};

/**
 * Configuration options for DFlex.
 */
export type DFlexGlobalConfig = {
  /**
   * If set to true, empty containers will be automatically removed if all of
   * its elements have been successfully migrated.
   * @default false
   */
  removeEmptyContainer: boolean;

  /**
   * If true, allows a dragged element to switch positions with another element
   * and settle into the new position, even if the drag didn't end inside the
   * new position bounds.
   * @default true
   */
  enableDragSettleOnSwitch: boolean;

  /**
   * If true, enables DFlex events.
   * @default true
   */
  enableEvents: boolean;

  /**
   * If true, enables DFlex listeners.
   * @default true
   */
  enableListeners: boolean;
};

const DEFAULT_GLOBAL_CONFIG = {
  removeEmptyContainer: false,
  enableEvents: true,
  enableListeners: true,
  enableDragSettleOnSwitch: true,
};

if (__DEV__) {
  Object.freeze(DEFAULT_GLOBAL_CONFIG);
}

type BranchComposedCallBackFunction = (
  // eslint-disable-next-line no-unused-vars
  childrenSK: string,
  // eslint-disable-next-line no-unused-vars
  parentDepth: number,
  // eslint-disable-next-line no-unused-vars
  parentDOM: HTMLElement,
) => void;

type HighestContainerComposedCallBack = () => void;

/**
 * Does the element share the same parent with the previous element in the same depth?
 *
 * @param DOM
 * @param DOMGen
 * @param interactiveDOM
 * @param depth
 * @returns
 */
function hasSiblingInSameLevel(
  DOM: HTMLElement,
  depth: number,
  store: DFlexBaseStore,
): boolean {
  let has = false;

  const siblingsByDp = store.DOMGen.getSKByDepth(depth);

  const siblingsByDpLength = siblingsByDp.length;

  if (siblingsByDpLength > 0) {
    const lastSKInSameDP = store.DOMGen.getSiblingsByKey(
      siblingsByDp[siblingsByDpLength - 1],
    );

    const lastSKInSameDPLength = lastSKInSameDP.length;

    if (lastSKInSameDPLength > 0) {
      const allegedPrevSiblingID = lastSKInSameDP[lastSKInSameDPLength - 1];

      const { previousElementSibling } = DOM;

      if (previousElementSibling) {
        has = previousElementSibling.isSameNode(
          store.interactiveDOM.get(allegedPrevSiblingID)!,
        );
      }
    }
  }

  return has;
}

function submitToRegistry(
  DOM: HTMLElement,
  elm: RegisterInputProcessed,
  dflexParentElm: null | DFlexElement,
  store: DFlexBaseStore,
): Keys {
  const { id, depth, readonly, animation, CSSTransform } = elm;

  if (__DEV__) {
    if (store.registry.has(id) || store.interactiveDOM.has(id)) {
      throw new Error(
        `submitToRegistry: Element with id: ${id} is already registered.`,
      );
    }
  }

  let _hasSiblingInSameLevel = false;

  // If it's a container
  if (depth > 0) {
    _hasSiblingInSameLevel = hasSiblingInSameLevel(DOM, depth, store);

    setRelativePosition(DOM);
    removeOpacity(DOM);

    const {
      globals: { removeEmptyContainer },
    } = store;

    if (!removeEmptyContainer) {
      setParentDimensions(DOM);
    }
  }

  let restoredKeys;
  let restoredSiblingsIndex;

  if (dflexParentElm) {
    ({
      keys: restoredKeys,
      VDOMOrder: { self: restoredSiblingsIndex },
    } = dflexParentElm);
  }

  const { order, keys } = store.DOMGen.register(
    id,
    depth,
    _hasSiblingInSameLevel,
    restoredKeys,
    restoredSiblingsIndex,
  );

  const coreElement: DFlexElementInput = {
    id,
    order,
    keys,
    depth,
    readonly,
    animation,
    CSSTransform,
  };

  if (__DEV__) {
    Object.freeze(coreElement);
  }

  const dflexElm = new DFlexElement(coreElement);

  if (__DEV__) {
    if (featureFlags.enableRegisterDebugger) {
      // eslint-disable-next-line no-console
      console.log(`submitToRegistry: ${id} is created`);
    }
  }

  store.registry.set(id, dflexElm);
  store.interactiveDOM.set(id, DOM);

  updateIndexAttr(DOM, dflexElm.VDOMOrder.self);

  if (depth > 0) {
    DOM.dataset.dflexKey = keys.SK;
  }

  return keys;
}

function submitContainerChildren(
  parentDOM: HTMLElement,
  depth: number,
  store: DFlexBaseStore,
  animation: AnimationOpts,
  CSSTransform: CSS | null,
  registeredElmID: string,
  dflexParentElm: DFlexElement | null,
): string | null {
  let SK: string | null = null;

  parentDOM.childNodes.forEach((DOM, i) => {
    if (DOM instanceof HTMLElement) {
      const id = assignElementID(DOM);

      if (!store.registry.has(id)) {
        const elm: RegisterInputProcessed = {
          depth,
          readonly: registeredElmID !== id,
          // Assuming all siblings have the same animation settings.
          animation,
          id,
          CSSTransform,
        };

        ({ SK } = submitToRegistry(DOM, elm, dflexParentElm, store));
      } else if (__DEV__) {
        if (featureFlags.enableRegisterDebugger) {
          throw new Error(
            `submitContainerChildren: ${id} is already registered.`,
          );
        }
      }
    } else if (DOM.nodeValue) {
      // This branch handles non-empty node values, which are disallowed in this
      // context.
      // However, if the node value is empty, it's acceptable since it doesn't
      // have any dimensions.
      // This specific case is related to Vue integration.
      // For more information, see: https://github.com/dflex-js/dflex/issues/729
      if (__DEV__) {
        throw new Error(
          `_submitContainerChildren: Received an element with a non-empty node value that's not an instanceof HTMLElement at index: ${i}`,
        );
      }
    }
  });

  return SK;
}

const REGISTER_Q = "registerQ";

const CB_Q = "submitQ";

class DFlexBaseStore extends DFlexDOMManager {
  globals: DFlexGlobalConfig;

  DOMGen: DOMKeysGenerator;

  private _lastDOMParent: HTMLElement | null;

  private _taskQ: TaskQueue;

  constructor() {
    super();

    this.globals = {
      ...DEFAULT_GLOBAL_CONFIG,
    };

    this._lastDOMParent = null;
    this._taskQ = new TaskQueue();
    this.DOMGen = new DOMKeysGenerator();
  }

  /**
   * Sets DFlex global configurations.
   *
   * @param globals
   */
  config(globals: Partial<DFlexGlobalConfig>): void {
    if (globals.removeEmptyContainer) {
      if (__DEV__) {
        throw new Error("removeContainerWhenEmpty is not supported yet.");
      }
    }

    Object.assign(this.globals, globals);
  }

  endRegistration() {
    this._lastDOMParent = null;
    this.DOMGen.endRegistration();

    if (__DEV__) {
      if (featureFlags.enableRegisterDebugger) {
        // eslint-disable-next-line no-console
        console.log(
          "%cRegistration has been ended",
          "color: blue; font-weight: bold;",
        );
      }
    }
  }

  protected addElmToRegistry(
    element: RegisterInputProcessed,
    branchComposedCallBack?: BranchComposedCallBackFunction,
    highestContainerComposedCallBack?: HighestContainerComposedCallBack,
  ): void {
    // Don't execute the parent registration if there's new element in the branch.
    this._taskQ.cancelQueuedTask();

    const { id, depth, readonly, animation, CSSTransform } = element;

    let isElmRegistered = this.registry.has(id);

    if (__DEV__) {
      if (featureFlags.enableRegisterDebugger) {
        if (isElmRegistered) {
          // eslint-disable-next-line no-console
          console.warn(`${id} is already registered.`);
        } else {
          // eslint-disable-next-line no-console
          console.log(`Receiving: ${id}`);
        }
      }
    }

    let DOM: HTMLElement;
    let SK: string;

    if (isElmRegistered) {
      let dflexElm;

      [dflexElm, DOM] = this.getElmWithDOM(id);

      // Update default values created earlier.
      dflexElm.updateConfig(readonly, animation, CSSTransform);

      ({ SK } = dflexElm.keys);
    } else {
      DOM = getElmDOMOrThrow(id)!;
    }

    const getParentElmCallback = (parentDOM: HTMLElement) => {
      const parentID = assignElementID(parentDOM);

      const isParentRegistered = this.registry.has(parentID);

      // Is this element already queued as parent?
      if (this._taskQ.hasElm(id)) {
        if (__DEV__) {
          if (featureFlags.enableRegisterDebugger) {
            // eslint-disable-next-line no-console
            console.log("Empty the queue cause element's waiting");
          }
        }

        [SK] = this._taskQ.executeQueue(REGISTER_Q) as string[];

        const dflexElm = this.registry.get(id)!;

        // Update default values created earlier.
        dflexElm.updateConfig(readonly, animation, CSSTransform);

        if (__DEV__) {
          if (!SK) {
            throw new Error(
              "register: Executing element in the queue has't returned SK.",
            );
          }
        }

        isElmRegistered = true;
      }

      const isNewParent =
        this._lastDOMParent === null ||
        !this._lastDOMParent.isSameNode(parentDOM);

      if (isNewParent) {
        const registerAllChildren = (dflexParentElm: DFlexElement | null) => {
          if (__DEV__) {
            if (featureFlags.enableRegisterDebugger) {
              // eslint-disable-next-line no-console
              console.log("Submit container children.");
            }
          }

          SK = submitContainerChildren(
            parentDOM,
            depth,
            this,
            animation,
            CSSTransform,
            id,
            dflexParentElm,
          )!;

          if (!SK) {
            if (__DEV__) {
              throw new Error(
                `The container '${parentID}' contains invalid HTML elements in its children. ` +
                  `This is an unexpected scenario, and there are no elements to register.`,
              );
            }
          }

          isElmRegistered = true;
        };

        const scheduleCBFunctions = () => {
          if (branchComposedCallBack && highestContainerComposedCallBack) {
            if (__DEV__) {
              if (featureFlags.enableRegisterDebugger) {
                // eslint-disable-next-line no-console
                console.log("Add callback functions to queue.");
              }
            }

            const fn = () => branchComposedCallBack(SK, depth + 1, parentDOM);

            this._taskQ.enqueueBeforeLast(
              highestContainerComposedCallBack,
              fn,
              CB_Q,
            );
          }
        };

        if (__DEV__) {
          if (featureFlags.enableRegisterDebugger) {
            // eslint-disable-next-line no-console
            console.log(
              `New parent: ${parentID}, isParentRegistered: ${isParentRegistered}`,
            );
          }
        }

        // keep the reference for comparison.
        this._lastDOMParent = parentDOM;

        if (!isParentRegistered) {
          // If it's a new parent then execute the previous one.
          if (__DEV__) {
            if (featureFlags.enableRegisterDebugger) {
              // eslint-disable-next-line no-console
              console.log("New parent empty the queue");
            }
          }

          this._taskQ.executeQueue(REGISTER_Q);

          const parentDepth = depth + 1;

          if (!isElmRegistered) {
            registerAllChildren(null);
          }

          if (__DEV__) {
            if (!SK) {
              throw new Error("register: Executing element has't returned SK.");
            }
          }

          const submitParentElm = (): string => {
            if (__DEV__) {
              if (featureFlags.enableRegisterDebugger) {
                // eslint-disable-next-line no-console
                console.log("Executing parent element.");
              }
            }

            const { SK: _ } = submitToRegistry(
              parentDOM,
              {
                id: parentID,
                depth: parentDepth,
                // Default values:
                readonly: true,
                animation: getAnimationOptions(),
                CSSTransform: null,
              },
              null,
              this,
            );

            return _;
          };

          if (__DEV__) {
            if (featureFlags.enableRegisterDebugger) {
              // eslint-disable-next-line no-console
              console.log(`Add parent ${parentID} to queue.`);
            }
          }

          // A new branch. Queue the new branch.
          this._taskQ.enqueue(submitParentElm, REGISTER_Q, parentID);

          scheduleCBFunctions();
        } else if (!isElmRegistered) {
          // Streaming case.
          // Registration finished but one of the layer has changed.
          registerAllChildren(this.registry.get(parentID)!);

          scheduleCBFunctions();
        }
      }

      if (__DEV__) {
        if (!isElmRegistered) {
          throw new Error(
            `register: Element ${id} has not been registered. Element should be registered when detecting its parent.`,
          );
        }
      }

      this._taskQ.scheduleNextTask([REGISTER_Q, CB_Q]);

      return true;
    };

    getParentElm(DOM, getParentElmCallback);
  }

  /**
   * Gets all element IDs Siblings in given node represented by sibling key.
   *
   * @param SK - Siblings Key.
   * @returns
   */
  getElmSiblingsByKey(SK: string): string[] {
    return this.DOMGen.getSiblingsByKey(SK);
  }

  /**
   * Gets branches key belongs to the same depth.
   *
   * @param dp - depth.
   * @returns
   */
  getSiblingKeysByDepth(dp: number): string[] {
    return this.DOMGen.getSKByDepth(dp);
  }

  unregister(id: string): void {
    this.dispose(id);
  }

  /**
   * Destroys all branches and all their related instances in the store. This
   * method should be called when the app will no longer use the store.
   */
  destroy(): void {
    this.DOMGen.clear();
    this._taskQ.clear();
    this._lastDOMParent = null;

    super.destroy();

    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.info("DFlexBaseStore destroyed.");
    }
  }
}

export default DFlexBaseStore;
