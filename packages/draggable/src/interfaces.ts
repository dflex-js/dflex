import { AbstractCoreInterface } from "@dflex/core-instance/src/interfaces";

export interface TempTranslate {
  x: number;
  y: number;
}

export type DraggedStyle = {
  prop: string;
  dragValue: string;
  afterDragValue: null;
}[];

export interface AbstractDraggableInterface<T extends AbstractCoreInterface> {
  draggedElm: T;

  draggedStyleRef: CSSStyleDeclaration;

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
  outerOffsetX: number;
  outerOffsetY: number;

  tempTranslate: TempTranslate;

  draggedStyle: DraggedStyle;
}

export interface MouseCoordinates {
  x: number;
  y: number;
}
