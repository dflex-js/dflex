import DFlexBaseStore from "@dflex/store";

class DFlexDraggableStore extends DFlexBaseStore {
  /**
   * Register element for Draggable store
   */
  // @ts-expect-error
  register(id: string) {
    super.register({
      id,
      depth: 0,
      parentID: "",
      readonly: false,
      isInitialized: false,
    });
  }
}

export default (function createStoreInstance() {
  const store = new DFlexDraggableStore();

  return store;
})();
