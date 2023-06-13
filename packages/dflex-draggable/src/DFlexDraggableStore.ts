import DFlexBaseStore from "@dflex/store";
import { canUseDOM, getAnimationOptions } from "@dflex/utils";

declare global {
  // eslint-disable-next-line
  var $DFlex_Draggable: DFlexDraggableStore;
}

class DFlexDraggableStore extends DFlexBaseStore {
  constructor() {
    super();
    this._initBranch = this._initBranch.bind(this);
    this._initElmDOMInstance = this._initElmDOMInstance.bind(this);
  }

  private _initElmDOMInstance(id: string) {
    const [dflexNode, DOM] = this.getElmWithDOM(id);

    dflexNode.initElmRect(DOM, 0, 0);
  }

  private _initBranch(SK: string) {
    this.getElmSiblingsByKey(SK).forEach(this._initElmDOMInstance);
  }

  /**
   * Register element for Draggable store.
   * @param id
   */
  // @ts-ignore
  register(id: string) {
    this.addElmToRegistry(
      {
        id,
        depth: 0,
        readonly: false,
        animation: getAnimationOptions(),
        CSSTransform: null,
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
