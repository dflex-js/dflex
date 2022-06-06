import DFlexBaseStore from "@dflex/store";

class DraggableStoreImp extends DFlexBaseStore {
  /**
   * Register element for Draggable store
   */
  // @ts-expect-error
  register(id: string) {
    super.register({
      id,
      depth: 0,
      parentID: "",
      isInitialized: true,
      isPaused: false,
      scrollX: 0,
      scrollY: 0,
      readonly: false,
    });
  }
}

export default (function createStoreInstance() {
  const store = new DraggableStoreImp();

  return store;
})();
