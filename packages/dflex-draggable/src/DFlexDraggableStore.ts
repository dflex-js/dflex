import DFlexBaseStore from "@dflex/store";
import { canUseDOM } from "@dflex/utils";

declare global {
  // eslint-disable-next-line
  var $DFlex_Draggable: DFlexDraggableStore;
}

const DRAGGABLE_ELM = "draggable";

class DFlexDraggableStore extends DFlexBaseStore {
  constructor() {
    super();
    this._initBranch = this._initBranch.bind(this);
    this._initElmDOMInstance = this._initElmDOMInstance.bind(this);
  }

  private _initElmDOMInstance(id: string) {
    const [dflexNode, DOM] = this.getElmWithDOM(id);

    dflexNode.resume(DOM, 0, 0);
    dflexNode.setAttribute(DOM, "ELM_TYPE", DRAGGABLE_ELM);
  }

  private _initBranch(SK: string) {
    this.getElmBranchByKey(SK).forEach(this._initElmDOMInstance);
  }

  /**
   * Register element for Draggable store.
   * @param id
   */
  // @ts-ignore
  register(id: string) {
    if (!canUseDOM()) return;

    super.register(
      {
        id,
        depth: 0,
        type: DRAGGABLE_ELM,
      },
      this._initBranch
    );
  }
}

export default (function createStoreInstance() {
  const store = new DFlexDraggableStore();

  if (__DEV__) {
    if (canUseDOM()) {
      if (!globalThis.$DFlex_Draggable) {
        globalThis.$DFlex_Draggable = store;
      }
    }
  }

  return store;
})();
