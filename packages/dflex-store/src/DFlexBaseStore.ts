/* eslint-disable no-underscore-dangle */
import Generator, { Keys, Siblings } from "@dflex/dom-gen";

import { DFlexElement, DFlexElementInput } from "@dflex/core-instance";
import {
  AnimationOpts,
  CSS,
  CSSClass,
  CSSStyle,
  featureFlags,
  getAnimationOptions,
  getParentElm,
  PREFIX_ID,
  setFixedDimensions,
  setRelativePosition,
  TaskQueue,
  Tracker,
} from "@dflex/utils";

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
   * Default: 0
   *
   * `Example`: 1, 2, 3, ...
   *
   */ depth?: number;

  /**
   * Indicates whether the element is read-only and won't be transformed during drag and drop interactions,
   * but it still belongs to the same interactive container.
   * Default: false
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

export type DFlexGlobalConfig = {
  removeContainerWhenEmpty: boolean;
};

type GetElmWithDOMOutput = [DFlexElement, HTMLElement];

type BranchComposedCallBackFunction = (
  // eslint-disable-next-line no-unused-vars
  childrenSK: string,
  // eslint-disable-next-line no-unused-vars
  parentDepth: number,
  // eslint-disable-next-line no-unused-vars
  parentDOM: HTMLElement
) => void;

type HighestContainerComposedCallBack = () => void;

function getElmDOMOrThrow(id: string): HTMLElement | null {
  let DOM = document.getElementById(id);

  if (!DOM) {
    if (__DEV__) {
      throw new Error(
        `Element with ID: ${id} is not found.This could be due wrong ID or missing DOM element.`
      );
    }
  }

  if (!DOM || DOM.nodeType !== Node.ELEMENT_NODE) {
    if (__DEV__) {
      throw new Error(`Invalid HTMLElement ${DOM} is passed to registry.`);
    }

    DOM = null;
  }

  return DOM;
}

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
  DOMGen: Generator,
  interactiveDOM: Map<string, HTMLElement>,
  depth: number
): boolean {
  let has = false;

  const siblingsByDp = DOMGen._getSiblingKeysByDepth(depth);

  const siblingsByDpLength = siblingsByDp.length;

  if (siblingsByDpLength > 0) {
    const lastSKInSameDP = DOMGen._getElmSiblingsByKey(
      siblingsByDp[siblingsByDpLength - 1]
    );

    const lastSKInSameDPLength = lastSKInSameDP.length;

    if (lastSKInSameDPLength > 0) {
      const allegedPrevSiblingID = lastSKInSameDP[lastSKInSameDPLength - 1];

      const { previousElementSibling } = DOM;

      if (previousElementSibling) {
        has = previousElementSibling.isSameNode(
          interactiveDOM.get(allegedPrevSiblingID)!
        );
      }
    }
  }

  return has;
}

const REGISTER_Q = "registerQ";

const CB_Q = "submitQ";

class DFlexBaseStore {
  _globals: DFlexGlobalConfig;

  _registry: Map<string, DFlexElement>;

  _interactiveDOM: Map<string, HTMLElement>;

  _tracker: Tracker;

  protected _DOMGen: Generator;

  private _lastDOMParent: HTMLElement | null;

  private _taskQ: TaskQueue;

  constructor() {
    this._globals = {
      removeContainerWhenEmpty: false,
    };
    this._lastDOMParent = null;
    this._tracker = new Tracker();
    this._taskQ = new TaskQueue();
    this._registry = new Map();
    this._interactiveDOM = new Map();
    this._DOMGen = new Generator();
  }

  /**
   * Sets DFlex global configurations.
   *
   * @param globals
   */
  config(globals: DFlexGlobalConfig): void {
    if (globals.removeContainerWhenEmpty) {
      if (__DEV__) {
        throw new Error("removeContainerWhenEmpty is not supported yet.");
      }
    }

    Object.assign(this._globals, globals);
  }

  private _submitElementToRegistry(
    DOM: HTMLElement,
    elm: RegisterInputProcessed,
    dflexParentElm: null | DFlexElement
  ): Keys | null {
    const { id, depth, readonly, animation, CSSTransform } = elm;

    if (__DEV__) {
      if (this._registry.has(id) || this._interactiveDOM.has(id)) {
        throw new Error(
          `_submitElementToRegistry: Element with id: ${id} is already registered.`
        );
      }
    }

    let _hasSiblingInSameLevel = false;

    // If it's a container
    if (depth > 0) {
      _hasSiblingInSameLevel = hasSiblingInSameLevel(
        DOM,
        this._DOMGen,
        this._interactiveDOM,
        depth
      );

      setRelativePosition(DOM);

      if (!this._globals.removeContainerWhenEmpty) {
        setFixedDimensions(DOM);
      }
    }

    let restoredKeys;
    let restoredSiblingsIndex;

    if (dflexParentElm) {
      ({
        _keys: restoredKeys,
        _VDOMOrder: { self: restoredSiblingsIndex },
      } = dflexParentElm);
    }

    const { order, keys } = this._DOMGen._register(
      id,
      depth,
      _hasSiblingInSameLevel,
      restoredKeys,
      restoredSiblingsIndex
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

    const dflexElm = new DFlexElement(coreElement);

    if (__DEV__) {
      if (featureFlags.enableRegisterDebugger) {
        // eslint-disable-next-line no-console
        console.log(`${id}: is created`);
      }
    }

    this._registry.set(id, dflexElm);
    this._interactiveDOM.set(id, DOM);

    dflexElm._setAttribute(DOM, "INDEX", dflexElm._VDOMOrder.self);

    if (depth > 0) {
      DOM.dataset.dflexKey = keys.SK;
    }

    return keys;
  }

  private _submitContainerChildren(
    parentDOM: HTMLElement,
    depth: number,
    animation: AnimationOpts,
    CSSTransform: CSS | null,
    registeredElmID: string,
    dflexParentElm: DFlexElement | null
  ) {
    let SK: string | null = null;

    parentDOM.childNodes.forEach((DOM, i) => {
      if (DOM instanceof HTMLElement) {
        let { id } = DOM;

        if (!id) {
          id = this._tracker._newTravel(PREFIX_ID);
          DOM.id = id;
        }

        if (!this._registry.has(id)) {
          const elm: RegisterInputProcessed = {
            depth,
            readonly: registeredElmID !== id,
            // Assuming all siblings have the same animation settings.
            animation,
            id,
            CSSTransform,
          };

          ({ SK } = this._submitElementToRegistry(DOM, elm, dflexParentElm)!);
        } else if (__DEV__) {
          if (featureFlags.enableRegisterDebugger) {
            // eslint-disable-next-line no-console
            console.warn(`${id} is already registered.`);
          }
        }
      } else if (__DEV__) {
        throw new Error(
          `_submitContainerChildren: Received an element that's not an instanceof HTMLElement at index: ${i}`
        );
      }
    });

    return SK;
  }

  _endRegistration() {
    this._lastDOMParent = null;
    this._DOMGen._endRegistration();

    if (__DEV__) {
      if (featureFlags.enableRegisterDebugger) {
        // eslint-disable-next-line no-console
        console.log("Registration has been ended");
      }
    }
  }

  protected _addElmToRegistry(
    element: RegisterInputProcessed,
    branchComposedCallBack?: BranchComposedCallBackFunction,
    highestContainerComposedCallBack?: HighestContainerComposedCallBack
  ): void {
    // Don't execute the parent registration if there's new element in the branch.
    this._taskQ._cancelQueuedTask();

    const { id, depth, readonly, animation, CSSTransform } = element;

    let isElmRegistered = this._registry.has(id);

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
      DOM = this._interactiveDOM.get(id)!;

      const dflexElm = this._registry.get(id)!;

      // Update default values created earlier.
      dflexElm._updateConfig(readonly, animation, CSSTransform);

      ({ SK } = dflexElm._keys);
    } else {
      DOM = getElmDOMOrThrow(id)!;
    }

    getParentElm(DOM, (parentDOM) => {
      let isParentRegistered = false;

      let { id: parentID } = parentDOM;

      if (!parentID) {
        parentID = this._tracker._newTravel(PREFIX_ID);
        parentDOM.id = parentID;
      } else {
        isParentRegistered = this._registry.has(parentID);
      }

      // Is this element already queued as parent?
      if (this._taskQ._hasElm(id)) {
        if (__DEV__) {
          if (featureFlags.enableRegisterDebugger) {
            // eslint-disable-next-line no-console
            console.log("Empty the queue cause element's waiting");
          }
        }

        [SK] = this._taskQ._executeQueue(REGISTER_Q) as string[];

        const dflexElm = this._registry.get(id)!;

        // Update default values created earlier.
        dflexElm._updateConfig(readonly, animation, CSSTransform);

        if (__DEV__) {
          if (!SK) {
            throw new Error(
              "register: Executing element in the queue has't returned SK."
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

          SK = this._submitContainerChildren(
            parentDOM,
            depth,
            animation,
            CSSTransform,
            id,
            dflexParentElm
          )!;

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

            this._taskQ._enqueueBeforeLast(
              highestContainerComposedCallBack,
              fn,
              CB_Q
            );
          }
        };

        if (__DEV__) {
          if (featureFlags.enableRegisterDebugger) {
            // eslint-disable-next-line no-console
            console.log(
              `New parent: ${parentID}, isParentRegistered: ${isParentRegistered}`
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

          this._taskQ._executeQueue(REGISTER_Q);

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

            const { SK: _ } = this._submitElementToRegistry(
              parentDOM,
              {
                id: parentID,
                depth: parentDepth,
                // Default values:
                readonly: true,
                animation: getAnimationOptions(),
                CSSTransform: null,
              },
              null
            )!;

            return _;
          };

          if (__DEV__) {
            if (featureFlags.enableRegisterDebugger) {
              // eslint-disable-next-line no-console
              console.log(`Add parent ${parentID} to queue.`);
            }
          }

          // A new branch. Queue the new branch.
          this._taskQ._enqueue(submitParentElm, REGISTER_Q, parentID);

          scheduleCBFunctions();
        } else if (!isElmRegistered) {
          // Streaming case.
          // Registration finished but one of the layer has changed.
          registerAllChildren(this._registry.get(parentID)!);

          scheduleCBFunctions();
        }
      }

      if (__DEV__) {
        if (!isElmRegistered) {
          throw new Error(
            `register: Element ${id} has not been registered. Element should be registered when detecting its parent.`
          );
        }
      }

      this._taskQ._scheduleNextTask([REGISTER_Q, CB_Q]);

      return true;
    });
  }

  /**
   * Gets DFlex element from the store along with its DOM element.
   *
   * @param id
   * @returns
   */
  getDOMbyElmID(id: string): GetElmWithDOMOutput {
    if (__DEV__) {
      if (!(this._registry.has(id) && this._interactiveDOM.has(id))) {
        throw new Error(`getDOMbyElmID: Unable to find element with ID: ${id}`);
      }
    }

    const elm = this._registry.get(id)!;
    const DOM = this._interactiveDOM.get(id)!;

    return [elm, DOM];
  }

  /**
   * True when the element is registered.
   *
   * @param id
   * @returns
   */
  has(id: string): boolean {
    return this._interactiveDOM.has(id) && this._registry.has(id);
  }

  /**
   * Gets all element IDs Siblings in given node represented by sibling key.
   *
   * @param SK - Siblings Key.
   * @returns
   */
  _getElmSiblingsByKey(SK: string): Siblings {
    return this._DOMGen._getElmSiblingsByKey(SK);
  }

  /**
   * Gets branches key belongs to the same depth.
   *
   * @param dp - depth.
   * @returns
   */
  _getSiblingKeysByDepth(dp: number): Siblings {
    return this._DOMGen._getSiblingKeysByDepth(dp);
  }

  /**
   * Mutates siblings in the generated DOM tree.
   *
   * @param SK
   * @param newSiblings
   */
  _mutateSiblings(SK: string, newSiblings: Siblings): void {
    this._DOMGen._mutateSiblings(SK, newSiblings);
  }

  /**
   * Removes an element from the store.
   *
   * @param id - element id.
   */
  unregister(id: string): void {
    this._registry.delete(id);
    this._interactiveDOM.delete(id);
  }

  /**
   * Destroys all branches and all their related instances in the store. This
   * method should be called when the app will no longer use the store.
   */
  destroy(): void {
    this._DOMGen._clear();
    this._interactiveDOM.clear();
    this._registry.clear();
    this._taskQ._clear();
    this._lastDOMParent = null;

    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.info("DFlexBaseStore destroyed.");
    }
  }
}

export default DFlexBaseStore;
