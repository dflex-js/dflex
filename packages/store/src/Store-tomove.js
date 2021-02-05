import AbstractStore from "./Store";

/**
 * Store class contains all dnd elements and their orders.
 *
 */
class Store extends AbstractStore {
  /**
   * Reattach element reference.
   * This happens when element is unmounted from the screen and mounted again.
   * In this case, we need to reattach its reference and transform it to the
   * last know position.
   *
   * @param {string} id
   * @param {HTMLElement} elmRef
   * @memberof Store
   */
  reattachElmRef(id, elmRef) {
    super.reattachElmRef(id, elmRef);
    this.registry[id].transformElm();
  }

  /**
   * Add DOM element to registry.
   *
   * @param {ElmInstance} elmInstance
   * @param {ConstructorFunc} CustomInstance - Constructor Function.
   * @param {Object} opts - additional options to be stored in the registry.
   * @memberof Store
   */
  register(elmInstance, CustomInstance, opts) {
    const { id, depth, element } = elmInstance;

    if (!element) return;

    /*
     * If element already exist in the store, then the reattach the reference.
     */
    if (this.abstractStore.registry[id]) {
      this.reattachElmRef(id, element);

      return;
    }

    const { order, keys } = this.DOMGen.getElmPointer(id, depth);

    const coreInstance = { id, depth, element, order, keys, ...opts };

    this.abstractStore.register(id, coreInstance, CustomInstance);
  }
}

export default Store;
