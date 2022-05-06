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

  boundaries: RectBoundaries;

  grid: IPointNum;

  scroll!: IScroll;

  #gridContainer: IPointNum;

  #gridSiblingsHasNewRow: boolean;

  lastElmPosition!: IPointNum;

  static INITIAL_BOUNDARIES = {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  };

  constructor() {
    this.#rectByRows = {
      1: {
        ...Container.INITIAL_BOUNDARIES,
      },
    };
    this.boundaries = { ...Container.INITIAL_BOUNDARIES };
    this.grid = new PointNum(0, 0);
    this.#gridContainer = new PointNum(0, 0);
    this.#gridSiblingsHasNewRow = false;
  }

  assignNewElm(rect: RectDimensions, unifiedContainerDimensions: Dimensions) {
    const { height, left, top, width } = rect;

    const right = left + width;
    const bottom = top + height;

    const elmRectBoundaries = {
      top,
      left,
      right,
      bottom,
    };

    if (!this.#rectByRows[this.#gridContainer.x]) {
      this.#rectByRows[this.#gridContainer.x] = {
        ...Container.INITIAL_BOUNDARIES,
      };
    }

    let $ = this.#rectByRows[this.#gridContainer.x];

    // Defining elements in different row.
    if (bottom > $.bottom || top < $.top) {
      this.#gridContainer.y += 1;
      this.grid.y += 1;

      this.#gridSiblingsHasNewRow = true;

      $.left = 0;
      $.right = 0;
    }

    // Defining elements in different column.
    if (left > $.right || right < $.left) {
      this.#gridContainer.x += 1;

      if (this.#gridSiblingsHasNewRow) {
        this.grid.x = 1;

        this.#gridSiblingsHasNewRow = false;
      } else {
        this.grid.x += 1;
      }
    }

    dirtyAssignBiggestRect($, elmRectBoundaries);
    dirtyAssignBiggestRect(this.boundaries, elmRectBoundaries);

    $ = this.boundaries;

    const uni = unifiedContainerDimensions;

    const $height = $.bottom - $.top;
    const $width = $.right - $.left;

    if (uni.height < $height) {
      uni.height = $height;
    }

    if (uni.width < $width) {
      uni.width = $height;
    }

    return this.grid;
  }

  preservePosition(position: IPointAxes) {
    this.lastElmPosition = new PointNum(position.x, position.y);
  }
}

export default Container;
