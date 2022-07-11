import DFlexBaseStore from "@dflex/store";

class DFlexDraggableStore extends DFlexBaseStore {
  /**
   * Register element for Draggable store.
   * @param id
   */
  // @ts-ignore
  register(id: string) {
    super.register({
      id,
      depth: 0,
      readonly: false,
    });
  }
}

export default (function createStoreInstance() {
  const store = new DFlexDraggableStore();

  return store;
})();
