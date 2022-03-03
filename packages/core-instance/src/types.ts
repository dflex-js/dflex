import { AxesCoordinates } from "@dflex/utils";
import type { Rect, Direction, EffectedElemDirection } from "@dflex/utils";

export interface AbstractOpts {
  isInitialized: boolean;
  isPaused: boolean;
}

export type AbstractInput = {
  id: string;
  ref?: HTMLElement;
};

export interface AbstractInterface {
  isInitialized: boolean;
  isPaused: boolean;
  ref: HTMLElement | null;
  id: string;
  translate: AxesCoordinates;
  attach(ref: HTMLElement | null): void;
  detach(): void;
  initTranslate(): void;
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
  pre: number;
}[];

export interface CoreInstanceInterface extends AbstractInterface {
  isVisible: boolean;
  offset: Rect;
  translateHistory?: AxesCoordinates<TransitionHistory>;
  currentPosition: AxesCoordinates;
  order: Order;
  keys: Keys;
  depth: number;
  animatedFrame: number | null;
  isPositionedUnder(elmY: number): boolean;
  isPositionedLeft(elmX: number): boolean;
  resume(scrollX: number, scrollY: number): void;
  changeVisibility(isVisible: boolean): void;
  setPosition(
    iDsInOrder: string[],
    effectedElemDirection: EffectedElemDirection,
    elmSpace: AxesCoordinates,
    operationID: string,
    siblingsEmptyElmIndex: AxesCoordinates,
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
  updateDataset(index: number): void;
  rollBack(operationID: string, isForceTransform: boolean): void;
}
