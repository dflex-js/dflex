export interface Dimensions {
  height: number;
  width: number;
}

export interface RectDimensions extends Dimensions {
  top: number;
  left: number;
}

export interface RectBoundaries {
  top: number;
  left: number;
  bottom: number;
  right: number;
}

export type Direction = 1 | -1;

/** Single Axis. */
export type Axis = "x" | "y";

/** Bi-directional Axis. */
export type Axes = Axis | "z";

export type DFlexElmType =
  /** Interactive element can be dragged and switched its position. */
  | "interactive"

  /** To define droppable area. */
  | "droppable"

  /** For elements that won't interact with active dragging element. */
  | "draggable";
