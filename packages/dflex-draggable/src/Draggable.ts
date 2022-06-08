import { IDFlexBaseNode } from "@dflex/core-instance";
import type { IPointAxes } from "@dflex/utils";
import store from "./DraggableStoreImp";
import AbstractDraggable from "./AbstractDraggable";

class Draggable extends AbstractDraggable<IDFlexBaseNode> {
  /**
   * Creates an instance of Draggable.
   * Works Only on dragged element level.
   *
   *
   * @param id - elementId
   * @param clickCoordinates -
   */
  constructor(id: string, clickCoordinates: IPointAxes) {
    const element = store.registry[id];

    super(element, clickCoordinates);
  }

  dragAt(x: number, y: number) {
    this.translate(x, y);

    this.draggedElm.translate.clone(this.translatePlaceholder);
  }

  endDragging() {
    this.setDragged(false);
  }
}

export default Draggable;
