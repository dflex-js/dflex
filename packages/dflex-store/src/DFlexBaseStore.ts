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

  const branchesByDp = DOMGen.getSKByDepth(depth);

  const branchesByDpLength = branchesByDp.length;

  if (branchesByDpLength > 0) {
    const lastSKInSameDP = DOMGen.getElmSiblingsByKey(
      branchesByDp[branchesByDpLength - 1]
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

class DFlexBaseStore {
  globals: DFlexGlobalConfig;

  registry: Map<string, DFlexElement>;

  interactiveDOM: Map<string, HTMLElement>;

  tracker: Tracker;

  protected DOMGen: Generator;

  private _lastDOMParent: HTMLElement | null;

  private _submitTaskQ: TaskQueue;

  private _registerTaskQ: TaskQueue;

  constructor() {
    this.globals = {
      removeContainerWhenEmpty: false,
    };
    this._lastDOMParent = null;
    this.tracker = new Tracker();
    this._submitTaskQ = new TaskQueue();
    this._registerTaskQ = new TaskQueue();
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

    const { order, keys } = dflexParentElm
      ? this.DOMGen.insertElmBtwLayers(
          id,
          depth,
          dflexParentElm.keys.CHK!,
          dflexParentElm.VDOMOrder.self
        )
      : this.DOMGen.register(id, depth, _hasSiblingInSameLevel);

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

  register(
    element: RegisterInputBase,
    branchComposedCallBack?: BranchComposedCallBackFunction
  ) {
    // Don't execute the parent registration if there's new element in the branch.
    this._registerTaskQ.cancelQueuedTask();

    const { id, depth } = element;

    let isElmRegistered = this.registry.has(id);

    if (__DEV__) {
      if (featureFlags.enableRegisterDebugger) {
        // eslint-disable-next-line no-console
        console.log(`Checking ${id}: ${isElmRegistered}`);
      }
    }

    const DOM = isElmRegistered
      ? this.interactiveDOM.get(id)!
      : getElmDOMOrThrow(id)!;

    getParentElm(DOM, (_parentDOM) => {
      let isParentRegistered = false;

      let { id: parentID } = _parentDOM;

      if (!parentID) {
        parentID = this.tracker.newTravel(Tracker.PREFIX_ID);
        _parentDOM.id = parentID;
      } else {
        isParentRegistered = this.registry.has(parentID);
      }

      // Is this element already queued as parent?
      if (this._registerTaskQ.hasElm(id)) {
        if (__DEV__) {
          if (featureFlags.enableRegisterDebugger) {
            // eslint-disable-next-line no-console
            console.log("Empty the queue cause element's waiting");
          }
        }

        this._registerTaskQ.handleQueue();

        isElmRegistered = true;
      }

      const isNewParent =
        this._lastDOMParent === null ||
        !this._lastDOMParent.isSameNode(_parentDOM);

      if (isNewParent) {
        if (__DEV__) {
          if (featureFlags.enableRegisterDebugger) {
            // eslint-disable-next-line no-console
            console.log(`New parent: ${parentID}`);
          }
        }

        // keep the reference for comparison.
        this._lastDOMParent = _parentDOM;

        if (!isParentRegistered) {
          // If it's a new parent then execute the previous one.
          if (__DEV__) {
            if (featureFlags.enableRegisterDebugger) {
              // eslint-disable-next-line no-console
              console.log("New parent empty the queue");
            }
          }

          this._registerTaskQ.handleQueue();

          const parentDepth = depth + 1;

          const submitParentElm = () => {
            if (__DEV__) {
              if (featureFlags.enableRegisterDebugger) {
                // eslint-disable-next-line no-console
                console.log("Executing parent element.");
              }
            }

            this._submitElementToRegistry(
              _parentDOM,
              {
                id: parentID,
                depth: parentDepth,
                // Default value for inserted parent element.
                readonly: true,
              },
              null
            );
          };

          if (__DEV__) {
            if (featureFlags.enableRegisterDebugger) {
              // eslint-disable-next-line no-console
              console.log(`Add parent ${parentID} to queue.`);
            }
          }

          // A new branch. Queue the new branch.
          this._registerTaskQ.add(submitParentElm, parentID);

          // In case it's the only parent. Then it won't be triggered manually.
          this._registerTaskQ.scheduleNextTask();

          if (typeof branchComposedCallBack === "function") {
            this._submitTaskQ.reset();

            this._submitTaskQ.add(() => {
              this.DOMGen.forEachBranch((SK) => {
                branchComposedCallBack(SK, parentDepth, _parentDOM);
              });
            });
          }
        }
      }

      if (!isElmRegistered) {
        this._submitElementToRegistry(DOM, element, null);
      }

      this._submitTaskQ.scheduleNextTask();
      this._registerTaskQ.scheduleNextTask();

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
  getElmBranchByKey(SK: string): Siblings {
    return this.DOMGen.getElmSiblingsByKey(SK);
  }

  /**
   * Gets branches key belongs to the same depth.
   *
   * @param dp - depth.
   * @returns
   */
  getBranchesByDepth(dp: number): Siblings {
    return this.DOMGen.getSKByDepth(dp);
  }

  /**
   * Mutates branch in the generated DOM tree.
   *
   * @param SK
   * @param newBranch
   */
  updateBranch(SK: string, newBranch: Siblings): void {
    return this.DOMGen.updateBranch(SK, newBranch);
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
   * Destroys branch and all its related instances in the store. This method is
   * automatically `unregister(id)`.
   *
   * @param SK - Siblings Key.
   */
  destroyBranch(SK: string): void {
    this.DOMGen.destroyBranch(SK, (id) => {
      this.unregister(id);
    });
  }

  /**
   * Destroys all branches and all their related instances in the store. This
   * method should be called when the app will no longer use the store.
   */
  destroy(): void {
    this.DOMGen.forEachBranch((SK) => {
      this.DOMGen.destroyBranch(SK);
    });

    this.interactiveDOM.clear();
    this.registry.clear();

    this._lastDOMParent = null;

    this._registerTaskQ.cancelQueuedTask();
    this._submitTaskQ.cancelQueuedTask();

    // @ts-expect-error - Cleaning up.
    this._registerTaskQ = undefined;
    // @ts-expect-error - Cleaning up.
    this._submitTaskQ = undefined;
    // @ts-expect-error - Cleaning up.
    this.tracker = undefined;

    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.info("DFlexBaseStore destroyed.");
    }
  }
}

export default DFlexBaseStore;
