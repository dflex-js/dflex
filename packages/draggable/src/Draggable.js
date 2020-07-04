import store from "./DraggableStoreImp";
import AbstractDraggable from "./AbstractDraggable";
import { DRAGGED_ELM } from "../constants.json";

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

  dragAt(x, y) {
    this.translate(x, y);

    this[DRAGGED_ELM].translateX = this.tempTranslate.x;
    this[DRAGGED_ELM].translateY = this.tempTranslate.y;
  }
}

export default Draggable;
