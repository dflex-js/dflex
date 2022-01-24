import { AbstractCoreInterface } from "@dflex/core-instance";
import store from "./DraggableStoreImp";
import AbstractDraggable from "./AbstractDraggable";
import type { Coordinates } from "./types";

class Draggable extends AbstractDraggable<AbstractCoreInterface> {
  /**
   * Creates an instance of Draggable.
   * Works Only on dragged element level.
   *
   *
   * @param id - elementId
   * @param clickCoordinates -
   */
  constructor(id: string, clickCoordinates: Coordinates) {
    const element = store.registry[id];

    super(element, clickCoordinates);
  }

  /**
   * @param x -
   * @param y -
   */
  dragAt(x: number, y: number) {
    this.translate(x, y);

    this.draggedElm.translateX = this.tempTranslate.x;
    this.draggedElm.translateY = this.tempTranslate.y;
  }

  endDragging() {
    this.setDragged(false);
  }
}

export default Draggable;
