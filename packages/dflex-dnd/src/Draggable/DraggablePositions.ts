import {
  AbstractBoxRect,
  AxesPoint,
  BoxNum,
  BoxRect,
  PointNum,
} from "@dflex/utils";
import CurrentPosition from "./DraggedCurrentPosition";

class DraggablePositions {
  private _absolute: CurrentPosition;

  private _viewport: CurrentPosition;

  constructor(
    initCoordinates: AxesPoint,
    rect: AbstractBoxRect,
    totalScrollRect: BoxRect,
  ) {
    this._viewport = new CurrentPosition(
      initCoordinates,
      rect,
      totalScrollRect,
    );

    this._absolute = new CurrentPosition(initCoordinates, rect, {
      left: 0,
      top: 0,
    });
  }

  setPos(
    x: number,
    y: number,
    scrollOffsetX: number,
    scrollOffsetY: number,
    draggedRect: BoxRect,
  ): void {
    this._viewport.setPos(x, y, scrollOffsetX, scrollOffsetY, draggedRect);
    this._absolute.setPos(x, y, scrollOffsetX, scrollOffsetY, draggedRect);
  }

  getPos(isAbsolute: boolean): BoxNum {
    return isAbsolute ? this._absolute.getPos() : this._viewport.getPos();
  }

  getInnerOffset(isAbsolute: boolean): PointNum {
    return isAbsolute
      ? this._absolute.getInnerOffset()
      : this._viewport.getInnerOffset();
  }
}

export default DraggablePositions;
