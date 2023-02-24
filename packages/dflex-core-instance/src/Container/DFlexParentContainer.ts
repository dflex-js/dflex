/* eslint-disable no-param-reassign */
import {
  PointNum,
  dirtyAssignBiggestRect,
  AbstractBox,
  BoxRect,
} from "@dflex/utils";

import type { Dimensions, AxesPoint } from "@dflex/utils";

class DFlexParentContainer {
  private _boundariesByRow: Record<number, AbstractBox>;

  /** Strict Rect for siblings containers. */
  private _siblingBoundaries: AbstractBox | null;

  private _rect!: BoxRect;

  /** Numbers of total columns and rows each container has.  */
  siblingsGrid: PointNum;

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

  constructor(DOM: HTMLElement, originLength: number, id: string) {
    this.id = id;
    this.siblingsGrid = new PointNum(1, 1);
    this.originLength = originLength;
    this._boundariesByRow = {};
    this._gridSiblingsHasNewRow = false;
    this._siblingBoundaries = null;
    this._initRect(DOM);
    // @ts-expect-error
    this.lastElmPosition = null;
  }

  private _initRect(DOM: HTMLElement): void {
    const { left, top, right, bottom } = DOM.getBoundingClientRect();

    this._rect = new BoxRect(top, right, bottom, left);
  }

  private _addNewElmToGridIndicator(rect: AbstractBox): void {
    if (!this._boundariesByRow[this.siblingsGrid.x]) {
      this._boundariesByRow[this.siblingsGrid.x] = Object.seal({
        bottom: rect.bottom,
        left: rect.left,
        right: rect.right,
        top: rect.top,
      });

      return;
    }

    const $ = this._boundariesByRow[this.siblingsGrid.x];

    // Defining elements in different row.
    if (rect.bottom > $.bottom || rect.top < $.top) {
      this.siblingsGrid.y += 1;

      this._gridSiblingsHasNewRow = true;

      $.left = 0;
      $.right = 0;
    }

    // Defining elements in different column.
    if (rect.left > $.right || rect.right < $.left) {
      if (this._gridSiblingsHasNewRow) {
        this.siblingsGrid.x = 1;

        this._gridSiblingsHasNewRow = false;
      } else {
        this.siblingsGrid.x += 1;
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
    if (this._siblingBoundaries) {
      dirtyAssignBiggestRect(this._siblingBoundaries, rect);
    } else {
      this._siblingBoundaries = {
        bottom: rect.bottom,
        left: rect.left,
        right: rect.right,
        top: rect.top,
      };
    }

    this._addNewElmToGridIndicator(rect);

    const $ = this._siblingBoundaries;

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
    this.siblingsGrid.setAxes(1, 1);
    this.originLength = originLength;
    this._boundariesByRow = {};
    this._gridSiblingsHasNewRow = false;
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
