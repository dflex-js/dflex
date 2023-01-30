/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-underscore-dangle */
import Generator, { ELmBranch, Keys } from "@dflex/dom-gen";

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
  keys: Keys,
  // eslint-disable-next-line no-unused-vars
  childrenDepth: number,
  // eslint-disable-next-line no-unused-vars
  containerID: string,
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

class DFlexBaseStore {
  globals: DFlexGlobalConfig;

  registry: Map<string, DFlexElement>;

  interactiveDOM: Map<string, HTMLElement>;

  tracker: Tracker;

  protected DOMGen: Generator;

  private _lastDOMParent: HTMLElement | null;

  private _queue: (() => void)[];

  private queueTimeoutId?: ReturnType<typeof setTimeout>;

  constructor() {
    this.globals = {
      removeContainerWhenEmpty: false,
    };
    this._lastDOMParent = null;
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
  config(globals: DFlexGlobalConfig) {
    if (globals.removeContainerWhenEmpty) {
      if (__DEV__) {
        throw new Error("removeContainerWhenEmpty is not supported yet.");
      }
    }

    Object.assign(this.globals, globals);
  }

  private _handleQueue() {
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

    let hasSiblingInSameLevel = false;

    // If it's a container
    if (depth > 0) {
      // Does the element share the same parent with the previous  element in the
      // same depth?

      const branchesByDp = this.DOMGen.getBranchByDepth(depth);

      const branchesByDpLength = branchesByDp.length;

      if (branchesByDpLength > 0) {
        const lastSKInSameDP = this.DOMGen.getElmBranchByKey(
          branchesByDp[branchesByDpLength - 1]
        );

        const lastSKInSameDPLength = lastSKInSameDP.length;

        if (lastSKInSameDPLength > 0) {
          const allegedPrevSiblingID = lastSKInSameDP[lastSKInSameDPLength - 1];

          hasSiblingInSameLevel = DOM.previousElementSibling!.isSameNode(
            this.interactiveDOM.get(allegedPrevSiblingID)!
          );
        }
      }
    }

    const { order, keys } = dflexParentElm
      ? this.DOMGen.insertElmBtwLayers(id, depth, dflexParentElm.keys.SK)
      : this.DOMGen.register(id, depth, hasSiblingInSameLevel);

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

    if (depth >= 1) {
      setRelativePosition(DOM);

      if (!this.globals.removeContainerWhenEmpty) {
        setFixedWidth(DOM);
      }

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
        branchComposedCallBack(keys, depth, id, DOM);
      }
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
      let { id: parentID } = _parentDOM;

      if (!parentID) {
        parentID = this.tracker.newTravel(Tracker.PREFIX_ID);
        _parentDOM.id = parentID;
      }

      const isParentChanged =
        this._lastDOMParent === null ||
        !this._lastDOMParent.isSameNode(_parentDOM);

      let isParentRegistered = false;

      if (isParentChanged) {
        // Parent DOM changed empty the queue.
        this._handleQueue();

        this._submitElementToRegistry(DOM, element, null, null);

        this.interactiveDOM.set(parentID, _parentDOM);

        const parentDepth = depth + 1;

        // keep the reference for comparison.
        this._lastDOMParent = _parentDOM;

        // A new branch. Queue the new branch.
        this._queue.push(() => {
          this._submitElementToRegistry(
            _parentDOM,
            {
              id: parentID,
              depth: parentDepth,
              // Default value for inserted parent element.
              readonly: true,
            },
            null,
            branchComposedCallBack || null
          );
        });
      } else {
        isParentRegistered = this.registry.has(parentID);

        if (isParentRegistered) {
          const dflexParentElm = this.registry.get(parentID)!;

          this._submitElementToRegistry(DOM, element, dflexParentElm, null);

          // A new branch. Queue the new branch.
          this._queue.push(() => {
            // typeof branchComposedCallBack === "function";
            branchComposedCallBack!(
              dflexParentElm.keys,
              dflexParentElm.depth,
              parentID,
              _parentDOM
            );
          });
        }
      }

      if (isParentChanged || isParentRegistered) {
        if (this.queueTimeoutId === undefined) {
          clearTimeout(this.queueTimeoutId);
        }

        this.queueTimeoutId = setTimeout(this._handleQueue, 0);
      } else {
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
  getElmBranchByKey(SK: string): ELmBranch {
    return this.DOMGen.getElmBranchByKey(SK);
  }

  /**
   * Gets branches key belongs to the same depth.
   *
   * @param dp - depth.
   * @returns
   */
  getBranchesByDepth(dp: number): ELmBranch {
    return this.DOMGen.getBranchByDepth(dp);
  }

  /**
   * Mutates branch in the generated DOM tree.
   *
   * @param SK
   * @param newBranch
   */
  updateBranch(SK: string, newBranch: ELmBranch): void {
    return this.DOMGen.updateBranch(SK, newBranch);
  }

  /**
   * @deprecated
   * @param _id
   */
  unregister(_id: string): void {}

  /**
   * Removes an element from the store.
   *
   * @param id - element id.
   */
  clearElm(id: string): void {
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
      this.clearElm(id);
    });
  }

  /**
   * Destroys all branches and all their related instances in the store. This
   * method should be called when the app will no longer use the store.
   */
  destroy(): void {
    this.DOMGen.forEachBranch((SK) => {
      this.DOMGen.destroyBranch(SK, (id) => {
        this.clearElm(id);
      });
    });

    this.interactiveDOM.clear();
    this.registry.clear();
    this._lastDOMParent = null;

    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.info("DFlexBaseStore destroyed.");
    }
  }
}

export default DFlexBaseStore;
