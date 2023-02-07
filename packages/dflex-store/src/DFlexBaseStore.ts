/* eslint-disable no-underscore-dangle */
import Generator, { Keys, Siblings } from "@dflex/dom-gen";

import { DFlexElement, DFlexElementInput } from "@dflex/core-instance";
import {
  getParentElm,
  setFixedWidth,
  setRelativePosition,
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
  childrenKeys: Keys,
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

  private _isParentQueued: Set<string>;

  private _prevParentDepth: number;

  private _queue: (() => Keys)[];

  private queueTimeoutId?: ReturnType<typeof setTimeout>;

  constructor() {
    this.globals = {
      removeContainerWhenEmpty: false,
    };
    this._lastDOMParent = null;
    this._isParentQueued = new Set();
    this._prevParentDepth = -99;
    this._queue = [];
    this.tracker = new Tracker();
    this.registry = new Map();
    this.interactiveDOM = new Map();
    this.DOMGen = new Generator();
    this._handleQueue = this._handleQueue.bind(this);
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

  private _handleQueue(): Keys[] {
    const results: Keys[] = [];

    try {
      if (this._queue.length === 0) {
        return results;
      }

      const queue = this._queue;

      this._queue = [];

      console.log("empty queue");

      queue.forEach((fn) => {
        const res = fn();

        results.push(res);
      });
    } finally {
      this.queueTimeoutId = undefined;
    }

    return results;
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

    console.log(id, ":is created");

    this.registry.set(id, dflexElm);
    this.interactiveDOM.set(id, DOM);

    dflexElm.setAttribute(DOM, "INDEX", dflexElm.VDOMOrder.self);

    if (depth > 0) {
      DOM.dataset.dflexKey = keys.SK;
    }

    return keys;
  }

  private _submitElmOrRestore(
    element: RegisterInputBase,
    DOM: HTMLElement,
    isElmRegistered: boolean
  ): Keys {
    const { id, readonly } = element;

    let keys: Keys | null = null;

    if (isElmRegistered) {
      const dflexElm = this.registry.get(id)!;

      ({ keys } = dflexElm);

      // This is the only difference between register by default and register
      // with a user only. In the future if there's new options then this should
      // be updated.
      dflexElm.readonly = readonly;

      if (__DEV__) {
        // eslint-disable-next-line no-console
        console.warn(`Element with ID: ${id} is already registered.`);
      }
    } else {
      keys = this._submitElementToRegistry(DOM, element, null);

      if (__DEV__) {
        if (!keys) {
          throw new Error(
            `register: _submitElementToRegistry is excepted to return new keys but it returned null for element id: ${id}`
          );
        }
      }
    }

    return keys!;
  }

  private _registerParent(
    parentDOM: HTMLElement,
    parentDepth: number,
    childrenKeys: Keys,
    isSameBranch: boolean,
    branchComposedCallBack: BranchComposedCallBackFunction | null
  ): void {
    const { id } = parentDOM;

    // Parent DOM changed empty the queue.
    this._handleQueue();

    // keep the reference for comparison.
    this._lastDOMParent = parentDOM;

    const submitParent = () => {
      this._submitElementToRegistry(
        parentDOM,
        {
          id,
          depth: parentDepth,
          // Default value for inserted parent element.
          readonly: true,
        },
        null
      );

      if (typeof branchComposedCallBack === "function") {
        branchComposedCallBack(childrenKeys, parentDepth, parentDOM);
      }
    };

    // Increase layer in the same branch.
    submitParent();
  }

  private _insertElmAndInitBranch(
    element: RegisterInputBase,
    childDOM: HTMLElement,
    parentDOM: HTMLElement,
    branchComposedCallBack: BranchComposedCallBackFunction
  ): void {
    this._lastDOMParent = parentDOM;

    const parentID = parentDOM.id;

    const dflexParentElm = this.registry.get(parentID)!;

    const submit = () => {
      this._submitElementToRegistry(childDOM, element, dflexParentElm)!;

      if (!this._isParentQueued.has(parentID)) {
        this._isParentQueued.add(parentID);

        // A new branch. Queue the new branch.
        this._queue.push(() => {
          branchComposedCallBack!(dflexParentElm.depth, parentDOM);

          // To support continuos streaming.
          this._isParentQueued.delete(parentID);
        });

        if (this.queueTimeoutId !== undefined) {
          clearTimeout(this.queueTimeoutId);
        }

        this.queueTimeoutId = setTimeout(this._handleQueue, 0);
      }
    };

    // Mutation observer is not fired yet. Wait until it's done.
    // When it's fired then `branchDeletedKeys` should be defined.
    const hasDelKeys = this.DOMGen.getBranchDeletedKeys(
      dflexParentElm.keys.CHK!,
      dflexParentElm.VDOMOrder.self
    );

    if (hasDelKeys) {
      submit();
    } else {
      queueMicrotask(submit);
    }
  }

  register(
    element: RegisterInputBase,
    branchComposedCallBack?: BranchComposedCallBackFunction
  ) {
    // Don't execute the parent if there's new element in the branch.
    if (typeof this.queueTimeoutId === "number") {
      // postpone queue.
      clearTimeout(this.queueTimeoutId);
    }

    const { id, depth } = element;

    const isElmRegistered = this.registry.has(id);

    console.log("checking ", id, isElmRegistered);

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

      let childrenKeys: Keys | null = null;

      // Is this element already queued as parent?
      if (this._isParentQueued.has(id)) {
        console.log("empty the queue cause it's waiting");
        [childrenKeys] = this._handleQueue();
      }

      const isNewParent =
        this._lastDOMParent === null ||
        !this._lastDOMParent.isSameNode(_parentDOM);

      if (isNewParent) {
        console.log("isNewParent", parentID);
        // keep the reference for comparison.
        this._lastDOMParent = _parentDOM;

        if (!isParentRegistered) {
          // If it's a new parent then execute the previous one.
          console.log("new parent empty the queue...");
          this._handleQueue();

          if (!childrenKeys) {
            childrenKeys = this._submitElmOrRestore(
              element,
              DOM,
              isElmRegistered
            );
          }

          const parentDepth = depth + 1;

          const submitParent = (): Keys => {
            console.log("executing parent.");

            const keys: Keys = this._submitElementToRegistry(
              _parentDOM,
              {
                id: parentID,
                depth: parentDepth,
                // Default value for inserted parent element.
                readonly: true,
              },
              null
            )!;

            if (typeof branchComposedCallBack === "function") {
              branchComposedCallBack(childrenKeys!, parentDepth, _parentDOM);
            }

            return keys;
          };

          console.log(`add parent to queue.${parentID}`);

          // A new branch. Queue the new branch.
          this._queue.push(submitParent);
          this._isParentQueued.add(parentID);
        }
      }

      if (!childrenKeys) {
        childrenKeys = this._submitElmOrRestore(element, DOM, isElmRegistered);
      }

      return true;
    });
  }

  register3(
    element: RegisterInputBase,
    branchComposedCallBack?: BranchComposedCallBackFunction
  ): void {
    // Don't execute parent if there'e new element in the branch.
    if (typeof this.queueTimeoutId === "number") {
      console.log("postpone queue..");
      clearTimeout(this.queueTimeoutId);
    }

    const { id, depth } = element;

    const isElmRegistered = this.registry.has(id);

    console.log("checking ", id, isElmRegistered);

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

      if (this._isParentQueued.has(id)) {
        console.log("cancel the queue.");
        this._queue.length = 0;
        this.queueTimeoutId = undefined;
      }

      const isParentChanged =
        this._lastDOMParent === null ||
        !this._lastDOMParent.isSameNode(_parentDOM);

      if (isParentChanged) {
        console.log("new parent empty the queu...");
        this._handleQueue();

        const childrenKeys: Keys = this._submitElmOrRestore(
          element,
          DOM,
          isElmRegistered
        );

        // keep the reference for comparison.
        this._lastDOMParent = _parentDOM;

        if (!isParentRegistered) {
          const parentDepth = depth + 1;

          const submitParent = () => {
            console.log("executing parent.");
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

            if (typeof branchComposedCallBack === "function") {
              branchComposedCallBack(childrenKeys!, parentDepth, _parentDOM);
            }
          };

          console.log(`add parent to queue.${parentID}`);

          // A new branch. Queue the new branch.
          this._queue.push(submitParent);
          this._isParentQueued.add(parentID);
        }
      } else {
        const childrenKeys: Keys = this._submitElmOrRestore(
          element,
          DOM,
          isElmRegistered
        );
      }

      // Add it to the next task in case there's no parent change to empty the
      // queue.
      console.log("add queue to the timeout.");
      this.queueTimeoutId = setTimeout(this._handleQueue, 0);

      return true;
    });
  }

  /**
   * Registers an element to the store.
   *
   * @param element - element to register
   * @returns
   */
  register2(
    element: RegisterInputBase,
    branchComposedCallBack?: BranchComposedCallBackFunction
  ): void {
    const { id, depth } = element;

    let isElmRegistered = this.registry.has(id);
    console.log("checking ", id, isElmRegistered);

    const DOM = isElmRegistered
      ? this.interactiveDOM.get(id)!
      : getElmDOMOrThrow(id)!;

    getParentElm(DOM, (_parentDOM) => {
      const isParentChanged =
        this._lastDOMParent === null ||
        !this._lastDOMParent.isSameNode(_parentDOM);

      let isParentRegistered = false;

      let { id: parentID } = _parentDOM;

      if (!parentID) {
        parentID = this.tracker.newTravel(Tracker.PREFIX_ID);
        _parentDOM.id = parentID;
      } else {
        isParentRegistered = this.registry.has(parentID);
      }

      if (isParentChanged) {
        console.log("isParentChanged...");
        const parentDepth = depth + 1;

        const isSameBranch = this._prevParentDepth < parentDepth;
        this._prevParentDepth = parentDepth;

        if (!isParentRegistered) {
          const childrenKeys: Keys = this._submitElmOrRestore(
            element,
            DOM,
            isElmRegistered
          );

          isElmRegistered = true;

          const submitParent = () => {
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

            if (typeof branchComposedCallBack === "function") {
              branchComposedCallBack(childrenKeys!, parentDepth, _parentDOM);
            }
          };

          if (this._lastDOMParent === null) {
            this._handleQueue();
            // A new branch. Queue the new branch.
            this._queue.push(submitParent);
            this.queueTimeoutId = setTimeout(this._handleQueue, 0);
          } else {
            // Increase layer in the same branch.
            submitParent();
          }

          // keep the reference for comparison.
          this._lastDOMParent = _parentDOM;
        }
      }

      if (!isElmRegistered) {
        console.log("calling registered after siblings..");
        this._submitElementToRegistry(DOM, element, null);
      } else {
        console.log("nothing to create");
      }

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
    this._isParentQueued.clear();

    // @ts-expect-error - Cleaning up.
    this.tracker = undefined;

    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.info("DFlexBaseStore destroyed.");
    }
  }
}

export default DFlexBaseStore;
