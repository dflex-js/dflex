import Generator from "@dflex/dom-gen";

import { DFlexNode, DFlexNodeInput } from "@dflex/core-instance";
import { getParentElm, Tracker } from "@dflex/utils";

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

type GetElmWithDOMOutput = [DFlexNode, HTMLElement];

function getElmDOMOrThrow(id: string): HTMLElement | null {
  let DOM = document.getElementById(id);

  if (!DOM) {
    if (__DEV__) {
      throw new Error(
        `Attach: Element with ID: ${id} is not found.` +
          `This could be due wrong ID or missing DOM element.`
      );
    }
  }

  if (!DOM || DOM.nodeType !== Node.ELEMENT_NODE) {
    if (__DEV__) {
      throw new Error(
        `Attach: Invalid HTMLElement ${DOM} is passed to registry.`
      );
    }

    DOM = null;
  }

  return DOM;
}

class DFlexBaseStore {
  registry: Map<string, DFlexNode>;

  interactiveDOM: Map<string, HTMLElement>;

  tracker: Tracker;

  protected DOMGen: Generator;

  private _lastDOMParent: HTMLElement | null;

  constructor() {
    this._lastDOMParent = null;
    this.tracker = new Tracker();
    this.registry = new Map();
    this.interactiveDOM = new Map();
    this.DOMGen = new Generator();
  }

  private _submitElementToRegistry(DOM: HTMLElement, elm: RegisterInputBase) {
    const { id, depth, readonly } = elm;

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

    const { order, keys } = this.DOMGen.register(id, depth);

    const coreElement: DFlexNodeInput = {
      id,
      order,
      keys,
      depth,
      readonly,
    };

    const dflexElm = new DFlexNode(coreElement);

    this.registry.set(id, dflexElm);

    dflexElm.setAttribute(DOM, "INDEX", dflexElm.order.self);

    if (depth >= 1) {
      if (keys.CHK === null) {
        if (__DEV__) {
          throw new Error(
            `Attach: Invalid keys for element with ID: ${id}` +
              `Elements over depth-1 must have a CHK key.`
          );
        }

        return;
      }

      DOM.dataset.dflexKey = keys.CHK;
    }
  }

  /**
   * Registers an element to the store.
   *
   * @param element - element to register
   * @returns
   */
  register(element: RegisterInputBase, cb?: () => void): void {
    const { id, depth } = element;

    const DOM = this.interactiveDOM.has(id)
      ? this.interactiveDOM.get(id)!
      : getElmDOMOrThrow(id)!;

    getParentElm(DOM, (_parentDOM) => {
      if (
        this._lastDOMParent === null ||
        !this._lastDOMParent.isSameNode(_parentDOM)
      ) {
        let { id: parentID } = _parentDOM;

        if (!parentID) {
          parentID = this.tracker.newTravel("DFlex-id");
          _parentDOM.id = parentID;
        }

        this.interactiveDOM.set(parentID, _parentDOM);

        const parentDepth = depth + 1;

        this._submitElementToRegistry(DOM, element);

        // A new branch.
        this._submitElementToRegistry(_parentDOM, {
          id: parentID,
          depth: parentDepth,
          // Default value for inserted parent element.
          readonly: true,
        });

        // keep the reference for comparison.
        this._lastDOMParent = _parentDOM;
      } else {
        this._submitElementToRegistry(DOM, element);
      }

      if (typeof cb === "function") {
        cb();
      }

      return true;
    });
  }

  getElmWithDOM(id: string): GetElmWithDOMOutput {
    const elm = this.registry.get(id)!;
    const DOM = this.interactiveDOM.get(id)!;

    return [elm, DOM];
  }

  has(id: string): boolean {
    return this.interactiveDOM.has(id) && this.registry.has(id);
  }

  /**
   * Gets all element IDs Siblings in given node represented by sibling key.
   *
   * @param SK - Siblings Key.
   * @returns
   */
  getElmBranchByKey(SK: string) {
    return this.DOMGen.getElmBranchByKey(SK);
  }

  /**
   * Gets branches key belongs to the same depth.
   *
   * @param dp - depth.
   * @returns
   */
  getBranchesByDepth(dp: number) {
    return this.DOMGen.getBranchByDepth(dp);
  }

  /**
   * Mutates branch in the generated DOM tree.
   *
   * @param SK - Siblings Key.
   * @param newOrder
   */
  updateBranch(SK: string, newOrder: string[]) {
    return this.DOMGen.updateBranch(SK, newOrder);
  }

  /**
   * Removes an element from the store.
   *
   * @param id - element id.
   */
  unregister(id: string): void {
    this.registry.delete(id);
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
      this.DOMGen.destroyBranch(SK, (id) => {
        this.unregister(id);
      });
    });
  }
}

export default DFlexBaseStore;
