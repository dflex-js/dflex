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

import type { IContainer } from "./types";

class Container implements IContainer {
  #boundariesStorageForGrid: {
    [row: number]: RectBoundaries;
  };

  boundaries!: RectBoundaries;

  grid: IPointNum;

  scroll!: IScroll;

  #gridContainer: IPointNum;

  #gridSiblingsHasNewRow: boolean;

  lastElmPosition!: IPointNum;

  constructor() {
    this.#boundariesStorageForGrid = {};
    this.grid = new PointNum(1, 1);
    this.#gridContainer = new PointNum(1, 0);
    this.#gridSiblingsHasNewRow = false;
  }

  setGrid(grid: IPointNum, rect: RectDimensions) {
    const { height, left, top, width } = rect;

    const right = left + width;
    const bottom = top + height;

    const $ = this.#boundariesStorageForGrid;

    const row = grid.x || 1;

    const rowRect = $[row];

    if (!rowRect) {
      this.grid = new PointNum(1, 1);

      grid.clone(this.grid);

      this.#boundariesStorageForGrid = {
        [row]: {
          top,
          left,
          right,
          bottom,
        },
      };

      return;
    }

    // Defining elements in different row.
    if (bottom > rowRect.bottom || top < rowRect.top) {
      this.grid.y += 1;

      this.#gridSiblingsHasNewRow = true;

      rowRect.left = 0;
      rowRect.right = 0;
    }

    // Defining elements in different column.
    if (left > rowRect.right || right < rowRect.left) {
      if (this.#gridSiblingsHasNewRow) {
        this.grid.x = 1;

        this.#gridSiblingsHasNewRow = false;
      } else {
        this.grid.x += 1;
      }
    }

    grid.clone(this.grid);

    if (left < rowRect.left) {
      rowRect.left = left;
    }

    if (top < rowRect.top) {
      rowRect.top = top;
    }

    if (right > rowRect.right) {
      rowRect.right = right;
    }

    if (bottom > rowRect.bottom) {
      rowRect.bottom = bottom;
    }
  }

  setBoundaries(rect: RectDimensions, unifiedContainerDimensions: Dimensions) {
    const { height, left, top, width } = rect;

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

      return;
    }

    const $ = this.boundaries;

    // Defining elements in different row.
    if (bottom > $.bottom || top < $.top) {
      this.#gridContainer.y += 1;
    }

    // Defining elements in different column.
    if (left > $.right || right < $.left) {
      this.#gridContainer.x += 1;
    }

    dirtyAssignBiggestRect($, elmRectBoundaries);

    const uni = unifiedContainerDimensions;

    const $height = $.bottom - $.top;
    const $width = $.right - $.left;

    if (uni.height < $height) {
      uni.height = $height;
    }

    if (uni.width < $width) {
      uni.width = $height;
    }
  }

  preservePosition(position: IPointAxes) {
    this.lastElmPosition = new PointNum(position.x, position.y);
  }
}

export default Container;
