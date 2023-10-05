import {
  AbstractBoxRect,
  AxesPoint,
  Axis,
  BoxNum,
  BoxRect,
  PointNum,
} from "@dflex/utils";

import CurrentPosition from "./DraggedCurrentPosition";
import type { MovementDirection } from "./types";

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
  ): void {
    this._viewport.setPos(x, y, scrollOffsetX, scrollOffsetY);
    this._absolute.setPos(x, y, scrollOffsetX, scrollOffsetY);
  }

  private _getInstance(isAbsolute: boolean): CurrentPosition {
    const $ = isAbsolute ? this._absolute : this._viewport;

    return $;
  }

  getPos(isAbsolute: boolean): BoxNum {
    return this._getInstance(isAbsolute).getPos();
  }

  getInnerOffset(isAbsolute: boolean): PointNum {
    return this._getInstance(isAbsolute).getInnerOffset();
  }

  getMovementDirection(axis: Axis, isAbsolute: boolean): MovementDirection {
    return this._getInstance(isAbsolute).getMovementDirection(axis);
  }
}

export default DraggablePositions;
