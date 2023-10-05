import {
  AbstractBoxRect,
  AxesPoint,
  BoxNum,
  BoxRect,
  PointNum,
} from "@dflex/utils";

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
   * @param {BoxRect} totalScrollRect - The total scroll rectangle representing scroll offsets.
   *                                    Pass `0` for both values to calculate absolute position.
   */
  constructor(
    initCoordinates: AxesPoint,
    rect: AbstractBoxRect,
    totalScrollRect: BoxRect,
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
}

export default CurrentPosition;
