import {
  AbstractBoxRect,
  AxesPoint,
  Axis,
  BoxNum,
  BoxRect,
  PointNum,
} from "@dflex/utils";

type MovementDirection = "r" | "l" | "d" | "u";

class CurrentPosition {
  /**
   *  It represents the distance between the mouse pointer and the
   *  top-left corner of the element. It's called "inner offset" because it's an
   *  offset within the element itself.
   */
  private _innerOffset: PointNum;

  private _currentPos: BoxNum;

  private _prevPoint: PointNum;

  /**
   * Constructs a Position object.
   *
   * @param {AxesPoint} initCoordinates - The initial coordinates of the element.
   * @param {AbstractBoxRect} rect - The rectangle representing the element's position and dimensions.
   * @param {{ left: number; top: number }} totalScrollRect - The total scroll rectangle representing scroll offsets.
   *                                    Pass `0` for both values to calculate absolute position.
   */
  constructor(
    initCoordinates: AxesPoint,
    rect: AbstractBoxRect,
    totalScrollRect: { left: number; top: number },
  ) {
    const { x, y } = initCoordinates;
    const { left, top } = totalScrollRect;

    // Store the previous point for reference
    this._prevPoint = new PointNum(x, y);

    // Calculate the current position, accounting for scroll offsets
    const viewportTop = rect.top - top;
    const viewportLeft = rect.left - left;

    this._currentPos = new BoxNum(
      viewportTop,
      viewportLeft + rect.width,
      viewportTop + rect.height,
      viewportLeft,
    );

    // Calculate the inner offset based on initial coordinates and viewport position
    this._innerOffset = new PointNum(
      Math.round(x - viewportLeft),
      Math.round(y - viewportTop),
    );
  }

  private _updatePrevPos(): void {
    const { left, top } = this._currentPos;
    this._prevPoint.setAxes(left, top);
  }

  private _getEdgePos(x: number, y: number): [number, number] {
    const edgePosLeft = x - this._innerOffset.x;
    const edgePosTop = y - this._innerOffset.y;

    return [edgePosLeft, edgePosTop];
  }

  setPos(
    x: number,
    y: number,
    scrollOffsetX: number,
    scrollOffsetY: number,
    draggedRect: BoxRect,
  ): void {
    this._updatePrevPos();

    const { width, height } = draggedRect;

    const [edgePosLeft, edgePosTop] = this._getEdgePos(x, y);

    const absTop = edgePosTop + scrollOffsetY;
    const absLeft = edgePosLeft + scrollOffsetX;

    this._currentPos.setBox(absTop, absLeft + width, absTop + height, absLeft);
  }

  getPos(): BoxNum {
    return this._currentPos;
  }

  getInnerOffset(): PointNum {
    return this._innerOffset;
  }

  getMovementDirection(axis: Axis): MovementDirection {
    const { x: previousX, y: previousY } = this._prevPoint;
    const { left: currentX, top: currentY } = this.getPos();

    if (axis === "x") {
      if (currentX > previousX) {
        // Box moved right
        return "r";
      }

      // Box moved left
      return "l";
    }

    if (currentY > previousY) {
      // Box moved down
      return "d";
    }

    // Box moved up
    return "u";
  }
}

export default CurrentPosition;
