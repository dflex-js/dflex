/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-underscore-dangle */
import Generator, { Siblings } from "@dflex/dom-gen";

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
  dflexElm: DFlexElement,
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

  const branchesByDp = DOMGen.getBranchByDepth(depth);

  const branchesByDpLength = branchesByDp.length;

  if (branchesByDpLength > 0) {
    const lastSKInSameDP = DOMGen.getElmBranchByKey(
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

  private _queue: (() => void)[];

  private queueTimeoutId?: ReturnType<typeof setTimeout>;

  constructor() {
    this.globals = {
      removeContainerWhenEmpty: false,
    };
    this._lastDOMParent = null;
    this._isParentQueued = new Set();

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

  private _handleQueue(): void {
    try {
      if (this._queue.length === 0) {
        return;
      }

      const queue = this._queue;

      this._queue = [];

      queue.forEach((fn) => fn());
    } finally {
      this.queueTimeoutId = undefined;
    }
  }

  private _submitElementToRegistry(
    DOM: HTMLElement,
    elm: RegisterInputBase,
    dflexParentElm: null | DFlexElement,
    branchComposedCallBack: BranchComposedCallBackFunction | null
  ): void {
    const { id, depth, readonly } = elm;

    if (!this.interactiveDOM.has(id)) {
      this.interactiveDOM.set(id, DOM);
    }

    if (this.registry.has(id)) {
      const elmInRegistry = this.registry.get(id);

      // This is the only difference between register by default and register
      // with a user only. In the future if there's new options then this should
      // be updated.
      elmInRegistry!.readonly = readonly;

      if (__DEV__) {
        // eslint-disable-next-line no-console
        console.warn(`Element with ID: ${id} is already registered.`);
      }

      return;
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
      ? this.DOMGen.insertElmBtwLayers(id, depth, dflexParentElm.keys.SK)
      : this.DOMGen.register(id, depth, _hasSiblingInSameLevel);

    const coreElement: DFlexElementInput = {
      id,
      order,
      keys,
      depth,
      readonly,
    };

    const dflexElm = new DFlexElement(coreElement);

    this.registry.set(id, dflexElm);

    dflexElm.setAttribute(DOM, "INDEX", dflexElm.VDOMOrder.self);

    if (depth > 0) {
      if (keys.CHK === null) {
        if (__DEV__) {
          throw new Error(
            `Invalid keys for element with ID: ${id} Elements over depth-1 must have a CHK key.`
          );
        }

        return;
      }

      DOM.dataset.dflexKey = keys.CHK;

      if (typeof branchComposedCallBack === "function") {
        branchComposedCallBack(dflexElm, DOM);

        if (_hasSiblingInSameLevel) {
          getParentElm(DOM, (_parentDOM) => {
            this._registerParentInQueue(
              _parentDOM,
              depth + 1,
              branchComposedCallBack
            );

            return true;
          });
        }
      }
    }
  }

  private _registerParentInQueue(
    parentDOM: HTMLElement,
    parentDepth: number,
    branchComposedCallBack: BranchComposedCallBackFunction | null
  ): void {
    let { id: parentID } = parentDOM;

    if (!parentID) {
      parentID = this.tracker.newTravel(Tracker.PREFIX_ID);
      parentDOM.id = parentID;
    }

    // Parent DOM changed empty the queue.
    this._handleQueue();

    this.interactiveDOM.set(parentID, parentDOM);

    // keep the reference for comparison.
    this._lastDOMParent = parentDOM;

    // A new branch. Queue the new branch.
    this._queue.push(() => {
      this._submitElementToRegistry(
        parentDOM,
        {
          id: parentID,
          depth: parentDepth,
          // Default value for inserted parent element.
          readonly: true,
        },
        null,
        branchComposedCallBack
      );
    });

    if (this.queueTimeoutId !== undefined) {
      clearTimeout(this.queueTimeoutId);
    }

    this.queueTimeoutId = setTimeout(this._handleQueue, 0);
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
      this._submitElementToRegistry(childDOM, element, dflexParentElm, null);

      if (!this._isParentQueued.has(parentID)) {
        this._isParentQueued.add(parentID);

        // A new branch. Queue the new branch.
        this._queue.push(() => {
          branchComposedCallBack!(dflexParentElm, parentDOM);

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
    const hasDelKeys = this.DOMGen.getBranchDeletedKeys(dflexParentElm.keys.SK);

    if (hasDelKeys) {
      submit();
    } else {
      queueMicrotask(submit);
    }
  }

  /**
   * Registers an element to the store.
   *
   * @param element - element to register
   * @returns
   */
  register(
    element: RegisterInputBase,
    branchComposedCallBack?: BranchComposedCallBackFunction
  ): void {
    const { id, depth } = element;

    const DOM = this.interactiveDOM.has(id)
      ? this.interactiveDOM.get(id)!
      : getElmDOMOrThrow(id)!;

    getParentElm(DOM, (_parentDOM) => {
      const isParentChanged =
        this._lastDOMParent === null ||
        !this._lastDOMParent.isSameNode(_parentDOM);

      let isParentRegistered = false;

      if (isParentChanged) {
        const parentDepth = depth + 1;

        this._registerParentInQueue(
          _parentDOM,
          parentDepth,
          branchComposedCallBack || null
        );

        this._submitElementToRegistry(DOM, element, null, null);
      } else {
        isParentRegistered = this.registry.has(_parentDOM.id);

        if (isParentRegistered) {
          this._insertElmAndInitBranch(
            element,
            DOM,
            _parentDOM,
            branchComposedCallBack!
          );
        }
      }

      if (!(isParentChanged || isParentRegistered)) {
        this._submitElementToRegistry(DOM, element, null, null);
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
    return this.DOMGen.getElmBranchByKey(SK);
  }

  /**
   * Gets branches key belongs to the same depth.
   *
   * @param dp - depth.
   * @returns
   */
  getBranchesByDepth(dp: number): Siblings {
    return this.DOMGen.getBranchByDepth(dp);
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
