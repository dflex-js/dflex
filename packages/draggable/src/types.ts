import type { AbstractCoreInterface } from "@dflex/core-instance";
import { AxesCoordinates } from "@dflex/utils";

export interface Coordinates {
  x: number;
  y: number;
}

export type DraggedStyle = {
  prop: string;
  dragValue: string;
  afterDragValue: string | null;
}[];

interface RegisterInputID {
  id: string;
  ref?: never;
}

interface RegisterInputRef {
  id?: never;
  ref: HTMLElement;
}

interface RegisterInputIDWithRef {
  id: string;
  ref: HTMLElement;
}

export type RegisterInput =
  | RegisterInputIDWithRef
  | RegisterInputID
  | RegisterInputRef;

export interface AbstractDraggableInterface<T extends AbstractCoreInterface> {
  draggedElm: T;

  /**
   * When dragging start, element shouldn't jump from its translate. So, we
   * calculate offset that make translate X,Y start from zero:
   *  goToX = x + this.outerOffsetX.
   *  goToY = y + this.outerOffsetY.
   *
   * goToX and goToY both should be zero with first click. Starts with simple
   * equating: initX = X. Taking into considerations translate value.
   *
   */
  outerOffset: AxesCoordinates;
  tempTranslate: AxesCoordinates;
  changeStyle(style: DraggedStyle, shouldAddPosition: boolean): void;
}
