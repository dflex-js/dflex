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
  #rectByRows: {
    [row: number]: RectBoundaries;
  };

  boundaries!: RectBoundaries;

  grid: IPointNum;

  scroll!: IScroll;

  #gridContainer: IPointNum;

  #gridSiblingsHasNewRow: boolean;

  lastElmPosition!: IPointNum;

  constructor() {
    this.#rectByRows = {
      1: {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      },
    };
    this.grid = new PointNum(1, 1);
    this.#gridContainer = new PointNum(1, 0);
    this.#gridSiblingsHasNewRow = false;
  }

  #setGridContainer($: RectBoundaries, elmRect: RectBoundaries) {
    const { left, right, top, bottom } = elmRect;

    // Defining elements in different row.
    if (bottom > $.bottom || top < $.top) {
      this.grid.y += 1;

      this.#gridSiblingsHasNewRow = true;

      $.left = 0;
      $.right = 0;
    }

    // Defining elements in different column.
    if (left > $.right || right < $.left) {
      if (this.#gridSiblingsHasNewRow) {
        this.grid.x = 1;

        this.#gridSiblingsHasNewRow = false;
      } else {
        this.grid.x += 1;
      }
    }
  }

  setGrid(grid: IPointNum, rect: RectDimensions) {
    const { height, left, top, width } = rect;

    const right = left + width;
    const bottom = top + height;

    const elmRectBoundaries = {
      top,
      left,
      right,
      bottom,
    };

    const $ = this.#rectByRows;

    const rowRect = $[grid.x];

    this.#setGridContainer(rowRect, elmRectBoundaries);
    dirtyAssignBiggestRect(rowRect, elmRectBoundaries);

    grid.clone(this.grid);
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
