/* eslint-disable no-param-reassign */
import { PointNum, dirtyAssignBiggestRect } from "@dflex/utils";

import type {
  Dimensions,
  AxesPoint,
  RectBoundaries,
  RectDimensions,
} from "@dflex/utils";

class DFlexParentContainer {
  private _boundariesByRow: Record<number, RectBoundaries>;

  /** Strict Rect for siblings containers. */
  boundaries!: RectBoundaries;

  /** Numbers of total columns and rows each container has.  */
  grid: PointNum;

  /**
   * Origin length for container before being transformed used to prevent
   * layout shift.
   * */
  originLength: number;

  private _gridSiblingsHasNewRow: boolean;

  /**
   * Preserve the last element position in the list .
   * Usage: Getting this position when the dragged is going back from the tail.
   */
  lastElmPosition!: PointNum;

  static OUT_OF_RANGE = -1;

  constructor(originLength: number) {
    this.grid = new PointNum(1, 1);
    this.originLength = originLength;
    this._boundariesByRow = {};
    this._gridSiblingsHasNewRow = false;
  }

  private _addNewElmToGridIndicator(rect: RectBoundaries): void {
    if (!this._boundariesByRow[this.grid.x]) {
      this._boundariesByRow[this.grid.x] = Object.seal({ ...rect });

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
    offset: RectDimensions,
    unifiedContainerDimensions?: Dimensions
  ): void {
    const { height, left, top, width } = offset;

    const right = left + width;
    const bottom = top + height;

    const elmRectBoundaries = {
      top,
      left,
      right,
      bottom,
    };

    if (!this.boundaries) {
      this.boundaries = elmRectBoundaries;
    } else {
      dirtyAssignBiggestRect(this.boundaries, elmRectBoundaries);
    }

    this._addNewElmToGridIndicator(elmRectBoundaries);

    const $ = this.boundaries;

    const uni = unifiedContainerDimensions;

    if (!uni) return;

    const $height = $.bottom - $.top;
    const $width = $.right - $.left;

    if (uni.height < $height) {
      uni.height = $height;
    }

    if (uni.width < $width) {
      uni.width = $height;
    }
  }

  resetIndicators(): void {
    // @ts-expect-error - Just resetting the boundaries.
    this.boundaries = null;
    this.grid.setAxes(1, 1);
    this._boundariesByRow = {};
    this._gridSiblingsHasNewRow = false;
  }

  preservePosition(position: AxesPoint): void {
    if (!this.lastElmPosition) {
      this.lastElmPosition = new PointNum(position.x, position.y);
    } else {
      this.lastElmPosition.setAxes(position.x, position.y);
    }
  }
}

export default DFlexParentContainer;
