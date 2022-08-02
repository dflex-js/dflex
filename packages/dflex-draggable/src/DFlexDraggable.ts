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
  }

  dragAt(x: number, y: number) {
    if (this.draggedElm.getType() === "droppable") {
      if (__DEV__) {
        // eslint-disable-next-line no-console
        console.warn("Droppable element can't be dragged");
      }

      return;
    }

    this.translate(x, y);

    this.draggedElm.translate.clone(this.translatePlaceholder);
  }

  endDragging() {
    this.setDragged(false);
  }
}

export default DFlexDraggable;
