import type {
  RectDimensions,
  IPointNum,
  IPointAxes,
  Direction,
  Axes,
  Axis,
} from "@dflex/utils";

export interface DFlexBaseNodeOpts {
  isInitialized: boolean;
  isPaused: boolean;
}

export type AllowedDataset =
  | "gridX"
  | "gridY"
  | "index"
  | "draggedOutPosition"
  | "draggedOutContainer";

export type AllowedAttributes = "dragged";

export type AttributesIndicators =
  | Exclude<AllowedDataset, "index">
  | AllowedAttributes;

export interface IDFlexBaseNode {
  readonly isInitialized: boolean;
  isPaused: boolean;
  readonly ref: HTMLElement | null;
  readonly id: string;
  readonly translate: IPointNum;
  attach(): void;
  detach(): void;
  initTranslate(): void;
  transform(x: number, y: number): void;
  setDataset(key: AllowedDataset, value: number | boolean): void;
  rmDateset(key: Exclude<AllowedDataset, "index">): void;
  setAttribute(key: AllowedAttributes, value: string): void;
  removeAttribute(key: AllowedAttributes): void;
  clearAttributes(): void;
}

/**
 * Element unique keys in DOM tree.
 */
export interface Keys {
  SK: string;
  PK: string;
  CHK: string | null;
}

/**
 * Element order in its branch & higher branch
 */
export interface Order {
  self: number;
  parent: number;
}

/**
 * Generated element pointer
 */
export interface Pointer {
  keys: Keys;
  order: Order;
}

export interface DFlexBaseNodeInput {
  readonly id: string;
  readonly order: Order;
  readonly keys: Keys;
  readonly depth: number;
  readonly readonly: boolean;
  readonly scrollX: number;
  readonly scrollY: number;
}

export type ITransitionHistory = {
  ID: string;
  axis: Axes;
  translate: IPointAxes;
};

export interface IDFlexCoreNode extends IDFlexBaseNode {
  /** Initial read-only element offset */
  readonly offset: RectDimensions;

  /** Current element offset (x-left, y-top) */
  readonly currentPosition: IPointNum;

  /** Element position in the grid container. */
  grid: IPointNum;

  /** Element visibility in the scroll container. */
  isVisible: boolean;

  /** Animated frame if the element is transforming  */
  readonly animatedFrame: number | null;

  readonly order: Order;
  readonly keys: Keys;
  readonly depth: number;

  readonly readonly: boolean;

  resume(scrollX: number, scrollY: number): void;
  changeVisibility(isVisible: boolean): void;
  setPosition(
    iDsInOrder: string[],
    direction: Direction,
    elmSpace: IPointNum,
    operationID: string,
    axis: Axes
  ): void;
  transformElm(): void;
  /** Direct element assignment. Handle the case for settling the draggable element */
  assignNewPosition(branchIDsOrder: string[], newIndex: number): void;
  rollBack(operationID: string, isForceTransform: boolean): void;
}

export interface IDFlexNode extends IDFlexCoreNode {
  isConnected(): boolean;
  isPositionedUnder(elmY: number): boolean;
  isPositionedLeft(elmX: number): boolean;
  getRectBottom(): number;
  getRectRight(): number;
  getRectDiff(elm: this, axis: Axis): number;
  /** Getting the displacement between two points. Rect is excluded. */
  getDisplacement(elm: this, axis: Axis): number;
  getDistance(elm: this, axis: Axis): number;
  getOffset(): RectDimensions;
  hasSamePosition(elm: this, axis: Axis): boolean;
}
