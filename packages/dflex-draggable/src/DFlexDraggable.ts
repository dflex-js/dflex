import type { DFlexBaseElement } from "@dflex/core-instance";
import type { AxesPoint } from "@dflex/utils";

import store from "./DFlexDraggableStore";
import DFlexBaseDraggable from "./DFlexBaseDraggable";

class DFlexDraggable extends DFlexBaseDraggable<DFlexBaseElement> {
  /**
   * Creates an instance of Draggable.
   * Works Only on dragged element level.
   *
   * @param id - elementId
   * @param clickCoordinates -
   */
  constructor(id: string, clickCoordinates: AxesPoint) {
    const [element, DOM] = store.getDOMbyElmID(id);
    super(element, DOM, clickCoordinates);

    this._setDOMAttrAndStyle(this.draggedDOM, null, true, false, null, null);
  }

  dragAt(x: number, y: number) {
    this._translate(x, y);

    this.draggedElm._translate._clone(this._translatePlaceholder);
  }

  endDragging() {
    this._setDOMAttrAndStyle(this.draggedDOM, null, false, false, null, null);
  }
}

export default DFlexDraggable;
