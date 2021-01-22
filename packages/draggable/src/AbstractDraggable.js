import { DRAGGED_ELM } from "../constants.json";

/** @type  { prop: string, dragValue: string, afterDragValue:? string }[]  */
const draggedStyleProps = [
  {
    prop: "zIndex",
    dragValue: "99",
    afterDragValue: null,
  },
  {
    prop: "pointerEvents",
    dragValue: "none",
    afterDragValue: null,
  },
];

/**
 * AbstractDraggable element.
 *
 * @class AbstractDraggable
 */

class AbstractDraggable {
  /**
   * Creates an instance of AbstractDraggable.
   * Works Only on dragged element level.
   *
   * @param {Object}  element - object reference from store
   * @param {Object}  initCoordinates
   * @param {number}  initCoordinates.x
   * @param {number}  initCoordinates.y
   *
   * @memberof AbstractDraggable
   */
  constructor(element, { x: initX, y: initY }) {
    /**
     * Assign instance for dragged.
     */
    this[DRAGGED_ELM] = element;

    const {
      translateX,
      translateY,
      element: { style: draggedStyle },
    } = this[DRAGGED_ELM];

    this.draggedStyleRef = draggedStyle;

    /**
     * When dragging start, element shouldn't jump from its translate. So, we
     * calculate offset that make translate X,Y start from zero:
     *  goToX = x + this.outerOffsetX.
     *  goToY = y + this.outerOffsetY.
     *
     * goToX and goToY both should be zero with first click. Starts with simple
     * equating: initX = X. Taking into considerations translate value.
     *
     */
    this.outerOffsetX = -initX + translateX;
    this.outerOffsetY = -initY + translateY;

    this.tempTranslate = {
      x: 0,
      y: 0,
    };

    this.draggedStyle = draggedStyleProps;

    this.setDragged(true);
  }

  /**
   * Triggers twice. Once when constructor is initiated, the other when drag is
   * ended. It adds/removes style.
   *
   * @param {boolean} isActive - is dragged operation active or it is ended.
   * @memberof AbstractDraggable
   */
  setDragged(isActive) {
    if (isActive) {
      this.draggedStyle.forEach(({ prop, dragValue }) => {
        this.draggedStyleRef[prop] = dragValue;
      });

      return;
    }

    /**
     * Not active: end of dragging.
     */
    this.draggedStyle.forEach(({ prop, afterDragValue }) => {
      this.draggedStyleRef[prop] = afterDragValue;
    });
  }

  /**
   * Executes dragging by applying transform.
   * Writes to draggedElmCurrentOffset in Transform class.
   * Set values to isDragged flags.
   *
   * @param {number} x - mouse x coordinates
   * @param {number} y - mouse y coordinates
   * @memberof AbstractDraggable
   */
  translate(x, y) {
    /**
     * Calculates translate coordinates.
     *
     * Indicates dragged y-transformation that's will be updated during the
     * dropping process. Updating Y immediately will effect calculations in
     * transform, that's why it is updated when dragging is done.
     */
    this.tempTranslate.x = x + this.outerOffsetX;
    this.tempTranslate.y = y + this.outerOffsetY;

    this.draggedStyleRef.transform = `translate(${this.tempTranslate.x}px,${this.tempTranslate.y}px)`;
  }
}

export default AbstractDraggable;
