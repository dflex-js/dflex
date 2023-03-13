/* eslint-disable no-param-reassign */
import { PointNum, AbstractBox, BoxRect, BoxNum } from "@dflex/utils";

import type { Dimensions, AxesPoint } from "@dflex/utils";

class DFlexParentContainer {
  private _boundariesByRow: BoxNum;

  /** Strict Rect for siblings containers. */
  private _siblingBoundaries: BoxNum | null;

  private _rect!: BoxRect;

  /** Numbers of total columns and rows each container has.  */
  private _gridIndex: PointNum;

  grid: PointNum;

  /**
   * Origin length for container before being transformed used to prevent
   * layout shift.
   * */
  originLength: number;

  id: string;

  /**
   * Preserve the last element position in the list .
   * Usage: Getting this position when the dragged is going back from the tail.
   */
  lastElmPosition!: PointNum;

  static OUT_OF_RANGE = -1;

  constructor(DOM: HTMLElement, originLength: number, id: string) {
    this.id = id;
    this._gridIndex = new PointNum(-1, -1);
    this.grid = new PointNum(-1, -1);
    this.originLength = originLength;
    this._boundariesByRow = new BoxNum(0, 0, 0, 0);
    this._siblingBoundaries = null;
    this._initRect(DOM);
    // @ts-expect-error
    this.lastElmPosition = null;
  }

  private _initRect(DOM: HTMLElement): void {
    const { left, top, right, bottom } = DOM.getBoundingClientRect();

    this._rect = new BoxRect(top, right, bottom, left);
  }

  private _addNewElmToGridIndicator(rect: AbstractBox): PointNum {
    const $ = this._boundariesByRow;

    // Defining elements in different row.
    const isNewRow = $.isPositionedY(rect);

    if (isNewRow) {
      this._gridIndex.y += 1;
      this._gridIndex.x = 0;
      this._boundariesByRow.setBox(0, 0, 0, 0);
    } else {
      this._gridIndex.x += 1;
    }

    if (this._gridIndex.x > this.grid.x) {
      this.grid.x = this._gridIndex.x;
    }

    if (this._gridIndex.y > this.grid.y) {
      this.grid.y = this._gridIndex.y;
    }

    $.assignBiggestBox(rect);

    return this._gridIndex;
  }

  // TODO: How to unregister element from the edge of the container? Currently
  // we reset and accumulate, it's inefficient. removeElmFromEdge() is a better.
  register(
    rect: AbstractBox,
    unifiedContainerDimensions?: Dimensions
  ): PointNum {
    if (this._siblingBoundaries) {
      this._siblingBoundaries.assignBiggestBox(rect);
    } else {
      this._siblingBoundaries = new BoxNum(
        rect.top,
        rect.right,
        rect.bottom,
        rect.left
      );
    }

    const gridIndex = this._addNewElmToGridIndicator(rect);

    const $ = this._siblingBoundaries;

    const uni = unifiedContainerDimensions;

    if (!uni) {
      return gridIndex;
    }

    const $height = $.bottom - $.top;
    const $width = $.right - $.left;

    if (uni.height < $height) {
      uni.height = $height;
    }

    if (uni.width < $width) {
      uni.width = $height;
    }

    return gridIndex;
  }

  /**
   * If container doesn't have siblings then it returns the container rect.
   *
   * @returns
   */
  getBoundaries(): AbstractBox<number> {
    return this._siblingBoundaries || this._rect.getBox();
  }

  /**
   *
   * @param originLength
   */
  resetIndicators(originLength: number): void {
    this._gridIndex.setAxes(-1, -1);
    this.grid.setAxes(-1, -1);
    this.originLength = originLength;
    this._boundariesByRow.setBox(0, 0, 0, 0);
    this._siblingBoundaries = null;
    // @ts-expect-error
    this.lastElmPosition = null;
  }

  preservePosition(pos: AxesPoint): void {
    if (this.lastElmPosition) {
      this.lastElmPosition.setAxes(pos.x, pos.y);
    } else {
      this.lastElmPosition = new PointNum(pos.x, pos.y);
    }
  }
}

export default DFlexParentContainer;
