/* eslint-disable no-underscore-dangle */
import Generator, { Keys, Siblings } from "@dflex/dom-gen";

import { DFlexElement, DFlexElementInput } from "@dflex/core-instance";
import {
  featureFlags,
  getParentElm,
  setFixedWidth,
  setRelativePosition,
  TaskQueue,
  Tracker,
} from "@dflex/utils";

// https://github.com/microsoft/TypeScript/issues/28374#issuecomment-536521051
type DeepNonNullable<T> = {
  [P in keyof T]-?: NonNullable<T[P]>;
};

/**
 * The options for the `register` method in DnD store.
 */
export type RegisterInputOpts = {
  /** Targeted element-id. */
  id: string;

  /** The depth of targeted element starting from zero (The default value is zero).  */
  depth?: number;

  /**
   * True for elements that won't be transformed during DnD but belongs to the
   * same interactive container.
   * */
  readonly?: boolean;
};

export type RegisterInputBase = DeepNonNullable<RegisterInputOpts>;

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

  const siblingsByDp = DOMGen.getSiblingKeysByDepth(depth);

  const siblingsByDpLength = siblingsByDp.length;

  if (siblingsByDpLength > 0) {
    const lastSKInSameDP = DOMGen.getElmSiblingsByKey(
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
  globals: DFlexGlobalConfig;

  registry: Map<string, DFlexElement>;

  interactiveDOM: Map<string, HTMLElement>;

  tracker: Tracker;

  protected DOMGen: Generator;

  private _lastDOMParent: HTMLElement | null;

  private _taskQ: TaskQueue;

  constructor() {
    this.globals = {
      removeContainerWhenEmpty: false,
    };
    this._lastDOMParent = null;
    this.tracker = new Tracker();
    this._taskQ = new TaskQueue();
    this.registry = new Map();
    this.interactiveDOM = new Map();
    this.DOMGen = new Generator();
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

    Object.assign(this.globals, globals);
  }

  private _submitElementToRegistry(
    DOM: HTMLElement,
    elm: RegisterInputBase,
    dflexParentElm: null | DFlexElement
  ): Keys | null {
    const { id, depth, readonly } = elm;

    if (__DEV__) {
      if (this.registry.has(id) || this.interactiveDOM.has(id)) {
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
        this.DOMGen,
        this.interactiveDOM,
        depth
      );

      setRelativePosition(DOM);

      if (!this.globals.removeContainerWhenEmpty) {
        setFixedWidth(DOM);
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

    const { order, keys } = this.DOMGen.register(
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
    };

    const dflexElm = new DFlexElement(coreElement);

    if (__DEV__) {
      if (featureFlags.enableRegisterDebugger) {
        // eslint-disable-next-line no-console
        console.log(`${id}: is created`);
      }
    }

    this.registry.set(id, dflexElm);
    this.interactiveDOM.set(id, DOM);

    dflexElm.setAttribute(DOM, "INDEX", dflexElm.VDOMOrder.self);

    if (depth > 0) {
      DOM.dataset.dflexKey = keys.SK;
    }

    return keys;
  }

  private _submitContainerChildren(
    parentDOM: HTMLElement,
    depth: number,
    registeredElmID: string,
    dflexParentElm: DFlexElement | null
  ) {
    let SK: string | null = null;

    parentDOM.childNodes.forEach((DOM, i) => {
      if (DOM instanceof HTMLElement) {
        let { id } = DOM;

        if (!id) {
          id = this.tracker.newTravel(Tracker.PREFIX_ID);
          DOM.id = id;
        }

        if (!this.registry.has(id)) {
          const elm = {
            depth,
            readonly: registeredElmID !== id,
            id,
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

  endRegistration() {
    this._lastDOMParent = null;
    this.DOMGen.endRegistration();

    if (__DEV__) {
      if (featureFlags.enableRegisterDebugger) {
        // eslint-disable-next-line no-console
        console.log("Registration has been ended");
      }
    }
  }

  register(
    element: RegisterInputBase,
    branchComposedCallBack?: BranchComposedCallBackFunction,
    highestContainerComposedCallBack?: HighestContainerComposedCallBack
  ) {
    // Don't execute the parent registration if there's new element in the branch.
    this._taskQ.cancelQueuedTask();

    const { id, depth, readonly } = element;

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
      DOM = this.interactiveDOM.get(id)!;

      const dflexElm = this.registry.get(id)!;
      // Update `readonly` cause default is `true.`
      dflexElm.readonly = readonly;
      ({ SK } = dflexElm.keys);
    } else {
      DOM = getElmDOMOrThrow(id)!;
    }

    getParentElm(DOM, (parentDOM) => {
      let isParentRegistered = false;

      let { id: parentID } = parentDOM;

      if (!parentID) {
        parentID = this.tracker.newTravel(Tracker.PREFIX_ID);
        parentDOM.id = parentID;
      } else {
        isParentRegistered = this.registry.has(parentID);
      }

      // Is this element already queued as parent?
      if (this._taskQ.hasElm(id)) {
        if (__DEV__) {
          if (featureFlags.enableRegisterDebugger) {
            // eslint-disable-next-line no-console
            console.log("Empty the queue cause element's waiting");
          }
        }

        [SK] = this._taskQ.handleQueue(REGISTER_Q) as string[];

        const dflexElm = this.registry.get(id)!;
        // Update `readonly` cause default is `true.`
        dflexElm.readonly = readonly;

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

            this._taskQ.insertBeforeEnd(
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

          this._taskQ.handleQueue(REGISTER_Q);

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
                // Default value for inserted parent element.
                readonly: true,
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
          this._taskQ.add(submitParentElm, REGISTER_Q, parentID);

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
            `register: Element ${id} has not been registered. Element should be registered when detecting its parent.`
          );
        }
      }

      this._taskQ.scheduleNextTask([REGISTER_Q, CB_Q]);

      return true;
    });
  }

  /**
   * Gets DFlex element from the store along with its DOM element.
   *
   * @param id
   * @returns
   */
  getElmWithDOM(id: string): GetElmWithDOMOutput {
    if (__DEV__) {
      if (!(this.registry.has(id) && this.interactiveDOM.has(id))) {
        throw new Error(`getElmWithDOM: Unable to find element with ID: ${id}`);
      }
    }

    const elm = this.registry.get(id)!;
    const DOM = this.interactiveDOM.get(id)!;

    return [elm, DOM];
  }

  /**
   * True when the element is registered.
   *
   * @param id
   * @returns
   */
  has(id: string): boolean {
    return this.interactiveDOM.has(id) && this.registry.has(id);
  }

  /**
   * Gets all element IDs Siblings in given node represented by sibling key.
   *
   * @param SK - Siblings Key.
   * @returns
   */
  getElmSiblingsByKey(SK: string): Siblings {
    return this.DOMGen.getElmSiblingsByKey(SK);
  }

  /**
   * Gets branches key belongs to the same depth.
   *
   * @param dp - depth.
   * @returns
   */
  getSiblingKeysByDepth(dp: number): Siblings {
    return this.DOMGen.getSiblingKeysByDepth(dp);
  }

  /**
   * Mutates siblings in the generated DOM tree.
   *
   * @param SK
   * @param newSiblings
   */
  mutateSiblings(SK: string, newSiblings: Siblings): void {
    this.DOMGen.mutateSiblings(SK, newSiblings);
  }

  /**
   * Removes an element from the store.
   *
   * @param id - element id.
   */
  unregister(id: string): void {
    this.registry.delete(id);
    this.interactiveDOM.delete(id);
  }

  /**
   * Destroys all branches and all their related instances in the store. This
   * method should be called when the app will no longer use the store.
   */
  destroy(): void {
    this.DOMGen.clear();

    this.interactiveDOM.clear();
    this.registry.clear();

    this._lastDOMParent = null;

    this._taskQ.clear();

    // @ts-expect-error - Cleaning up.
    this._taskQ = undefined;
    // @ts-expect-error - Cleaning up.
    this.tracker = undefined;
    // @ts-expect-error - Cleaning up.
    this.DOMGen = undefined;

    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.info("DFlexBaseStore destroyed.");
    }
  }
}

export default DFlexBaseStore;
