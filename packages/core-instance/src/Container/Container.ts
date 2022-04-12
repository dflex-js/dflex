import { PointNum } from "@dflex/utils";

import type {
  IScroll,
  IPointNum,
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

  setBoundaries(rect: RectDimensions) {
    const { height, left, top, width } = rect;

    const right = left + width;
    const bottom = top + height;

    if (!this.boundaries) {
      this.boundaries = {
        top,
        left,
        right,
        bottom,
      };

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

    if (left < $.left) {
      $.left = left;
    }

    if (top < $.top) {
      $.top = top;
    }

    if (right > $.right) {
      $.right = right;
    }

    if (bottom > $.bottom) {
      $.bottom = bottom;
    }
  }
}

export default Container;
