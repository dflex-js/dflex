/* eslint-disable no-param-reassign */
import { PointNum, AbstractBox, BoxRect, BoxNum, Axis } from "@dflex/utils";

import type { Dimensions, AxesPoint } from "@dflex/utils";

const EMPTY_GRID_INDEX = -1;

class DFlexParentContainer {
  private _boundariesByRow: BoxNum;

  /** Strict Rect for siblings containers. */
  private _siblingBoundaries: BoxNum | null;

  private _rect!: BoxRect;

  /** Numbers of total columns and rows each container has.  */
  private _gridIndex: PointNum;

  _grid: PointNum;

  /**
   * Origin length for container before being transformed used to prevent
   * layout shift.
   * */
  _originLength: number;

  readonly _id: string;

  /**
   * Preserve the last element position in the list .
   * Usage: Getting this position when the dragged is going back from the tail.
   */
  lastElmPosition!: PointNum;

  constructor(DOM: HTMLElement, originLength: number, id: string) {
    this._id = id;
    this._gridIndex = new PointNum(EMPTY_GRID_INDEX, EMPTY_GRID_INDEX);
    this._grid = new PointNum(EMPTY_GRID_INDEX, EMPTY_GRID_INDEX);
    this._originLength = originLength;
    this._boundariesByRow = new BoxNum(0, 0, 0, 0);
    this._siblingBoundaries = null;
    this._initRect(DOM);
    // @ts-expect-error
    this.lastElmPosition = null;

    if (__DEV__) {
      Object.seal(this);
    }
  }

  private _initRect(DOM: HTMLElement): void {
    const { left, top, right, bottom } = DOM.getBoundingClientRect();

    this._rect = new BoxRect(top, right, bottom, left);
  }

  private _addNewElmToGridIndicator(rect: AbstractBox): PointNum {
    const $ = this._boundariesByRow;

    // Defining elements in different row.
    const isNewRow = $._isPositionedY(rect);

    if (isNewRow) {
      this._gridIndex.y += 1;
      this._gridIndex.x = 0;
      this._boundariesByRow._setBox(0, 0, 0, 0);
    } else {
      this._gridIndex.x += 1;
    }

    if (this._gridIndex.x > this._grid.x) {
      this._grid.x = this._gridIndex.x;
    }

    if (this._gridIndex.y > this._grid.y) {
      this._grid.y = this._gridIndex.y;
    }

    $._assignBiggestBox(rect);

    return this._gridIndex;
  }

  // TODO: How to unregister element from the edge of the container? Currently
  // we reset and accumulate, it's inefficient. removeElmFromEdge() is a better.
  _register(
    rect: AbstractBox,
    unifiedContainerDimensions?: Dimensions
  ): PointNum {
    if (this._siblingBoundaries) {
      this._siblingBoundaries._assignBiggestBox(rect);
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

  _extendGrid(axis: Axis) {
    this._grid[axis] += 1;
  }

  _reduceGrid(axis: Axis) {
    this._grid[axis] -= 1;

    if (__DEV__) {
      if (this._grid[axis] < EMPTY_GRID_INDEX) {
        throw new Error(
          `reduceGrid: Cannot reduce grid on axis:${axis} to below ${EMPTY_GRID_INDEX}`
        );
      }
    }
  }

  /**
   * If container doesn't have siblings then it returns the container rect.
   *
   * @returns
   */
  _getBoundaries(): AbstractBox<number> {
    return this._siblingBoundaries || this._rect._getBox();
  }

  /**
   *
   * @param originLength
   */
  _resetIndicators(originLength: number): void {
    this._gridIndex._setAxes(-1, -1);
    this._grid._setAxes(-1, -1);
    this._originLength = originLength;
    this._boundariesByRow._setBox(0, 0, 0, 0);
    this._siblingBoundaries = null;
    // @ts-expect-error
    this.lastElmPosition = null;
  }

  _preservePosition(pos: AxesPoint): void {
    if (this.lastElmPosition) {
      this.lastElmPosition._setAxes(pos.x, pos.y);
    } else {
      this.lastElmPosition = new PointNum(pos.x, pos.y);
    }
  }
}

export default DFlexParentContainer;
