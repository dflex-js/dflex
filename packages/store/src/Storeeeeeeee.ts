import Generator from "@dflex/dom-gen/src";

interface ElmInstance {
  id: string;
  depth: number;
  ref?: HTMLElement;
}

type Class<T> = new (...args: any[]) => T;

/**
 *
 * @class Store
 */
class Store<T> {
  registry: {
    [id: string]: T;
  };

  /**
   * Creates an instance of Store.
   *
   * @constructor
   * @memberof Store
   */
  constructor() {
    this.registry = {};
  }

  /**
   * Mutate elmInstance into CustomInstance then add the new object to registry
   * by id.
   *
   * @param {ElmInstance} element
   * @param {Class<T>} CustomInstance
   * @memberof Store
   */
  register(element: ElmInstance, CustomInstance: Class<T>) {
    const { id, depth, ref } = element;

    if (!ref) return;

    const coreElement = { id, depth, ref, order: 0, keys: 0 };

    this.registry[id] =
      CustomInstance && typeof CustomInstance.constructor === "function"
        ? new CustomInstance(coreElement)
        : coreElement;
  }
}

export default Store;
