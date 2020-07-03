import { DRAGGED_ELM } from "../constants.json";

/**
 * Style that will be added to dragged element.
 *
 * @static
 * @property draggedStyleProps,
 * @type {Array}
 * @readonly
 * @memberof AbstractDraggable
 */
const draggedStyleProps = [
  {
    prop: "pointerEvents",
    value: "none",
  },
  {
    prop: "zIndex",
    value: "1",
  },
  {
    prop: "transition",
    value: `opacity 0.2s cubic-bezier(0.2, 0, 0, 1) 0s`,
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

    this.draggedStyle = draggedStyle;

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
      draggedStyleProps.forEach(({ prop, value }) => {
        this.draggedStyle[prop] = value;
      });

      return;
    }

    /**
     * Not active: end of dragging.
     */
    this.draggedStyle.pointerEvents = null;
  }

  endDragging() {
    this.setDragged(false);
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
  dragAt(x, y) {
    /**
     * Calculates translate coordinates.
     *
     * Indicates dragged y-transformation that's will be updated during the
     * dropping process. Updating Y immediately will effect calculations in
     * transform, that's why it is updated when dragging is done.
     */
    this[DRAGGED_ELM].translateX = x + this.outerOffsetX;
    this[DRAGGED_ELM].translateY = y + this.outerOffsetY;

    this.draggedStyle.transform = `translate(${this[DRAGGED_ELM].translateX}px,${this[DRAGGED_ELM].translateY}px)`;
  }
}

export default AbstractDraggable;
