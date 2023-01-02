/* eslint-disable no-param-reassign */
import { PointNum, dirtyAssignBiggestRect, AbstractBox } from "@dflex/utils";

import type { Dimensions, AxesPoint } from "@dflex/utils";

const defaultStrictBoundaries = {
  bottom: 0,
  left: 0,
  right: 0,
  top: 0,
};

class DFlexParentContainer {
  private _boundariesByRow: Record<number, AbstractBox>;

  /** Strict Rect for siblings containers. */
  strictBoundaries: AbstractBox;

  /** Relaxed Rect for parent containers. */
  containerBoundaries?: AbstractBox;

  /** Numbers of total columns and rows each container has.  */
  grid: PointNum;

  /**
   * Origin length for container before being transformed used to prevent
   * layout shift.
   * */
  originLength: number;

  id: string;

  private _gridSiblingsHasNewRow: boolean;

  /**
   * Preserve the last element position in the list .
   * Usage: Getting this position when the dragged is going back from the tail.
   */
  lastElmPosition!: PointNum;

  static OUT_OF_RANGE = -1;

  constructor(originLength: number, id: string) {
    this.id = id;
    this.grid = new PointNum(1, 1);
    this.originLength = originLength;
    this._boundariesByRow = {};
    this._gridSiblingsHasNewRow = false;
    this.strictBoundaries = Object.assign({}, defaultStrictBoundaries);
    // @ts-expect-error
    this.lastElmPosition = null;
  }

  private _addNewElmToGridIndicator(rect: AbstractBox): void {
    if (!this._boundariesByRow[this.grid.x]) {
      this._boundariesByRow[this.grid.x] = Object.seal({
        bottom: rect.bottom,
        left: rect.left,
        right: rect.right,
        top: rect.top,
      });

      return;
    }

    const $ = this._boundariesByRow[this.grid.x];

    // Defining elements in different row.
    if (rect.bottom > $.bottom || rect.top < $.top) {
      this.grid.y += 1;

      this._gridSiblingsHasNewRow = true;

      $.left = 0;
      $.right = 0;
    }

    // Defining elements in different column.
    if (rect.left > $.right || rect.right < $.left) {
      if (this._gridSiblingsHasNewRow) {
        this.grid.x = 1;

        this._gridSiblingsHasNewRow = false;
      } else {
        this.grid.x += 1;
      }
    }

    dirtyAssignBiggestRect($, rect);
  }

  // TODO: How to unregister element from the edge of the container? Currently
  // we reset and accumulate, it's inefficient. removeElmFromEdge() is a better.

  registerNewElm(
    rect: AbstractBox,
    unifiedContainerDimensions?: Dimensions
  ): void {
    dirtyAssignBiggestRect(this.strictBoundaries, rect);

    this._addNewElmToGridIndicator(rect);

    const $ = this.strictBoundaries;

    const uni = unifiedContainerDimensions;

    if (!uni) {
      return;
    }

    const $height = $.bottom - $.top;
    const $width = $.right - $.left;

    if (uni.height < $height) {
      uni.height = $height;
    }

    if (uni.width < $width) {
      uni.width = $height;
    }
  }

  /**
   *
   * @param originLength
   */
  resetIndicators(originLength: number): void {
    this.grid.setAxes(1, 1);
    this.originLength = originLength;
    this._boundariesByRow = {};
    this._gridSiblingsHasNewRow = false;
    this.strictBoundaries = Object.assign({}, defaultStrictBoundaries);
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
