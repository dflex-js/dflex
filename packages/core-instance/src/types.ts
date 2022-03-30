import type {
  RectDimensions,
  IPointNum,
  IPointAxes,
  Direction,
  Axes,
  RectBoundaries,
} from "@dflex/utils";

export interface AbstractOpts {
  isInitialized: boolean;
  isPaused: boolean;
  isInjected?: true;
}

export type AbstractInput = {
  id: string;
  ref?: HTMLElement;
};

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

export interface AbstractInterface {
  readonly isInitialized: boolean;
  isPaused: boolean;
  readonly ref: HTMLElement | null;
  readonly id: string;
  readonly translate: IPointNum;
  attach(ref: HTMLElement | null): void;
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

export interface CoreInput extends AbstractInput {
  order: Order;
  keys: Keys;
  depth: number;
  scrollX: number;
  scrollY: number;
}

export type TransitionHistory = {
  ID: string;
  axis: Axes;
  translate: IPointAxes;
};

export interface CoreInstanceInterface extends AbstractInterface {
  /** Initial read-only element offset */
  readonly offset: RectDimensions;

  /** Element boundaries for parent instance only. */
  readonly boundaries?: RectBoundaries;

  /** Current element offset (x-left, y-top) */
  readonly currentPosition: IPointNum;

  /** Element position in the grid container. */
  grid: IPointNum;

  /** Element visibility in the scroll container. */
  isVisible: boolean;

  /**
   * True when element is injected in the registry.
   * Represents the higher node element in the registered tree and prevents
   * recursive fetching child/parent.
   * So when the store reads `isInjected: true` it knows this is it and whe have
   * to stop fetching higher nodes.
   */
  isInjected?: true;

  /** Animated frame if the element is transforming  */
  readonly animatedFrame: number | null;

  readonly order: Order;
  readonly keys: Keys;
  readonly depth: number;

  /** Calculate Strict Rect for siblings containers */
  assignBoundaries(childELmRect: RectDimensions): void;

  getELmParentRef(): HTMLElement | null;
  isPositionedUnder(elmY: number): boolean;
  isPositionedLeft(elmX: number): boolean;
  resume(scrollX: number, scrollY: number): void;
  changeVisibility(isVisible: boolean): void;
  setPosition(
    iDsInOrder: string[],
    direction: Direction,
    elmSpace: IPointNum,
    operationID: string,
    siblingsEmptyElmIndex: IPointAxes,
    axis: Axes,
    vIncrement?: number,
    isShuffle?: boolean
  ): number;
  transformElm(): void;
  assignNewPosition(
    branchIDsOrder: string[],
    newIndex: number,
    oldIndex?: number,
    siblingsHasEmptyElm?: number
  ): number;
  rollBack(operationID: string, isForceTransform: boolean): void;
}
