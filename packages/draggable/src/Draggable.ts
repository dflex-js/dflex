import store from "./DraggableStoreImp";
import AbstractDraggable from "./AbstractDraggable";

/** @typedef  {import("packages/coreInstance/src/AbstractCoreInstance").AbstractCoreElm} AbstractCoreElm */
/** @typedef {import("./AbstractDraggable").MouseCoordinates} MouseCoordinates */

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
   * @param {string} elementId
   * @param {MouseCoordinates} clickCoordinates
   * @memberof Draggable
   */
  constructor(elementId, clickCoordinates) {
    /** @type {AbstractCoreElm} */
    // @ts-ignore
    const element = store.getElmById(elementId);

    super(element, clickCoordinates);
  }

  /**
   * @param {number} x
   * @param {number} y
   * @memberof Draggable
   */
  dragAt(x, y) {
    this.translate(x, y);

    this.draggedElm.translateX = this.tempTranslate.x;
    this.draggedElm.translateY = this.tempTranslate.y;
  }

  endDragging() {
    this.setDragged(false);
  }
}

export default Draggable;
