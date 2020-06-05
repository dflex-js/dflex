import { DRAGGED_ELM } from "../constants";

import Base from "../Base";

/**
 * Draggable element.
 *
 * @class Draggable
 */
class Draggable extends Base {
  /**
   * Style that will be added to dragged element.
   *
   * @static
   * @property draggedStyleProps,
   * @type {Array}
   * @readonly
   * @memberof Draggable
   */
  static draggedStyleProps = [
    {
      prop: "pointerEvents",
      value: "none"
    },
    {
      prop: "zIndex",
      value: "1"
    },
    {
      prop: "background",
      value: "brown"
    },
    {
      prop: "transition",
      value: `opacity 0.2s cubic-bezier(0.2, 0, 0, 1) 0s`
    }
  ];

  /**
   * Creates an instance of Draggable.
   * Works Only on dragged element level.
   *
   * @param {string} elementId
   * @param {Object}  initCoordinates
   * @param {number}  initCoordinates.x
   * @param {number}  initCoordinates.y
   *
   * @memberof Draggable
   */
  constructor(elementId, { x: initX, y: initY }) {
    super(elementId);

    const {
      translateX,
      translateY,
      indexes,
      ref: {
        current: { style: draggedStyle }
      }
    } = this[DRAGGED_ELM];

    /**
     * Initialize temp index that refers to element new position after
     * transformation happened.
     */
    this.draggedTempIndex = indexes.self;

    this.draggedStyle = draggedStyle;

    /**
     * previous X and Y are used to calculate mouse directions.
     */
    this.prevY = initY;
    this.prevX = initX;

    /**
     * When dragging start, element shouldn't jump from its translate. So, we
     * calculate offset that make translate X,Y start from zero:
     *  goToX = x + this.offsetX.
     *  goToY = y + this.offsetY.
     *
     * goToX and goToY both should be zero with first click. Starts with simple
     * equating: initX = X. Taking into considerations translate value.
     *
     */
    this.offsetX = -initX + translateX;
    this.offsetY = -initY + translateY;

    this.setDragged(true);
  }

  /**
   * Triggers twice. Once when constructor is initiated, the other when drag is
   * ended. It adds/removes style.
   *
   * @param {boolean} isActive - is dragged operation active or it is ended.
   * @memberof Draggable
   */
  setDragged(isActive) {
    const { draggedStyleProps } = Draggable;

    if (isActive) {
      draggedStyleProps.forEach(({ prop, value }) => {
        this.draggedStyle[prop] = value;
      });

      return;
    }

    /**
     * Not active: end of dragging.
     */
    draggedStyleProps.forEach(({ prop }) => {
      this.draggedStyle[prop] = null;
    });
  }

  /**
   * Dragged current-offset is essential to determine dragged position in
   * layout and parent.
   *
   * Is it moved form its translate? Is it out the parent or in
   * another parent? The answer is related to currentOffset.
   *
   * Note: these are the current offset related only to the dragging. When the
   * operation is done, different calculation will be set.
   *
   * @memberof Draggable
   */
  setDraggedTempCurrentOffset(x, y) {
    /**
     * Each time we got new translate, offset should be updated
     */
    const {
      offset: { top, left, width, height }
    } = this[DRAGGED_ELM];

    /**
     * Calculates the new offset
     */
    const _left = left + x;
    const _top = top + y;

    /**
     * Note, this instance can't be replaced with offset.
     * By adding translate to offset, with each move will double the
     * increase:
     *
     * Suppose top = 100 and translateY = 20 the result is 120.
     * But what'll happen to next move translateY = 20 the result is 120 + 20 = 140.
     *
     * To solve this issue, we keep the offset and returns the new value with
     * increase as 100 + 20 or 100 + 40.
     *
     * Also, you can always call currentOffset and get the right value since
     * it's updated with each translate value.
     */
    this.currentLeft = _left;
    this.currentRight = _left + width;
    this.currentTop = _top;
    this.currentBottom = _top + height;
  }

  /**
   * Checks if dragged it out of its position or parent.
   *
   * @param {this|this.parentThreshold[currentIndex]} $
   * @returns {boolean} isOut
   * @memberof Draggable
   */
  isDraggedOut(id) {
    const { parents, dragged } = this.thresholds;

    let $ = id ? parents[id] : dragged;

    const isOut =
      this.currentLeft < $.maxLeft ||
      this.currentRight > $.maxRight ||
      this.currentTop < $.maxTop ||
      this.currentBottom > $.maxBottom;

    return isOut;
  }

  /**
   * Checks if dragged is last element is parent list.
   *
   * @returns {boolean}
   * @memberof Draggable
   */
  isDraggedLastElm() {
    return this.draggedTempIndex === this.siblingsList.length - 1;
  }

  /**
   * Executes dragging by applying transform.
   * Writes to draggedElmCurrentOffset in Transform class.
   * Set values to isDragged flags.
   *
   * @param {number} x - mouse x coordinates
   * @param {number} y - mouse y coordinates
   * @memberof Draggable
   */
  dragAt(x, y) {
    /**
     * Calculates translate coordinates.
     *
     * Indicates dragged y-transformation that's will be updated during the
     * dropping process. Updating Y immediately will effect calculations in
     * transform, that's why it is updated when dragging is done.
     */
    this.goToX = x + this.offsetX;
    this.goToY = y + this.offsetY;

    this.draggedStyle.transform = `translate(${this.goToX}px,${this.goToY}px)`;

    this.setDraggedTempCurrentOffset(this.goToX, this.goToY);
  }
}

export default Draggable;
