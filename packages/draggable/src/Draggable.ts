import store from "./DraggableStoreImp";
import AbstractDraggable, { MouseCoordinates } from "./AbstractDraggable";

class Draggable extends AbstractDraggable {
  /**
   * Creates an instance of Draggable.
   * Works Only on dragged element level.
   *
   *
   * @param id - elementId
   * @param clickCoordinates
   */
  constructor(id: string, clickCoordinates: MouseCoordinates) {
    const element = store.getElmById(id);

    super(element, clickCoordinates);
  }

  /**
   * @param x
   * @param y
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
