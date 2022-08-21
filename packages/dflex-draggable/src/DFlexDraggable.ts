import type { DFlexBaseNode } from "@dflex/core-instance";
import type { AxesPoint } from "@dflex/utils";

import store from "./DFlexDraggableStore";
import DFlexBaseDraggable from "./DFlexBaseDraggable";

class DFlexDraggable extends DFlexBaseDraggable<DFlexBaseNode> {
  /**
   * Creates an instance of Draggable.
   * Works Only on dragged element level.
   *
   * @param id - elementId
   * @param clickCoordinates -
   */
  constructor(id: string, clickCoordinates: AxesPoint) {
    const [element, DOM] = store.getElmWithDOM(id);
    super(element, DOM, clickCoordinates);

    this.setDOMAttrAndStyle(this.draggedDOM, null, true, false, null, null);
  }

  dragAt(x: number, y: number) {
    this.translate(x, y);

    this.draggedElm.translate.clone(this.translatePlaceholder);
  }

  endDragging() {
    this.setDOMAttrAndStyle(this.draggedDOM, null, false, false, null, null);
  }
}

export default DFlexDraggable;
