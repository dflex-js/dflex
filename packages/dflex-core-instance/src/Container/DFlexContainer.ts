/* eslint-disable no-param-reassign */
import { PointNum, dirtyAssignBiggestRect } from "@dflex/utils";

import type {
  Dimensions,
  IScroll,
  IPointNum,
  IPointAxes,
  RectBoundaries,
  RectDimensions,
} from "@dflex/utils";

import type { IDFlexContainer } from "./types";

class DFlexContainer implements IDFlexContainer {
  private _boundariesByRow: {
    [row: number]: RectBoundaries;
  };

  boundaries!: RectBoundaries;

  grid: IPointNum;

  originLength: number;

  ref?: HTMLElement | null;

  scroll!: IScroll;

  private _gridSiblingsHasNewRow: boolean;

  lastElmPosition!: IPointNum;

  static OUT_OF_RANGE = -1;

  constructor() {
    this.grid = new PointNum(1, 1);
    this.originLength = DFlexContainer.OUT_OF_RANGE;
    this._boundariesByRow = {};
    this._gridSiblingsHasNewRow = false;
  }

  private _addNewElmToGridIndicator(rect: RectBoundaries) {
    if (!this._boundariesByRow[this.grid.x]) {
      this._boundariesByRow[this.grid.x] = {
        ...rect,
      };

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
  ) {
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

  resetIndicators() {
    // @ts-expect-error - Just resetting the boundaries.
    this.boundaries = null;
    this.grid.setAxes(1, 1);
    this._boundariesByRow = {};
    this._gridSiblingsHasNewRow = false;
  }

  preservePosition(position: IPointAxes) {
    this.lastElmPosition = new PointNum(position.x, position.y);
  }
}

export default DFlexContainer;
