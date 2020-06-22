import store from "./DraggableStoreImp";
import AbstractDraggable from "./AbstractDraggable";

/**
 * Draggable element.
 *
 * @class Draggable
 */
class Draggable extends AbstractDraggable {
  /**
   * Creates an instance of Draggable.
   * Works Only on dragged element level.
   *
   * @param {Object}  initCoordinates
   * @param {number}  initCoordinates.x
   * @param {number}  initCoordinates.y
   *
   * @memberof Draggable
   */
  constructor(elementId, clickCoordinates) {
    const element = store.getElmById(elementId);

    super(element, clickCoordinates);
  }
}

export default Draggable;
