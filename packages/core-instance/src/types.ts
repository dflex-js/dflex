/* eslint-disable no-unused-vars */

import { AxesCoordinates } from "@dflex/utils";

export type AbstractCoreInput = {
  id: string;
  isInitialized: boolean;
  ref?: HTMLElement;
};

export interface AbstractInterface {
  ref: HTMLElement | null;
  id: string;
  isInitialized: boolean;
  attach(ref: HTMLElement | null): void;
  detach(): void;
}

export type ELmBranch = string | string[];

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

export interface CoreEssential {
  order: Order;
  keys: Keys;
  depth: number;
  scrollX: number;
  scrollY: number;
}

export type CoreInput = CoreEssential & AbstractCoreInput;

export interface Rect {
  height: number;
  width: number;
  left: number;
  top: number;
}

export type TransitionHistory = {
  ID: string;
  pre: number;
}[];

export interface Coordinates {
  x: number;
  y: number;
}

export interface CoreInstanceInterface extends AbstractInterface {
  isPaused: boolean;
  isVisible: boolean;
  offset: Rect;
  translateHistory?: AxesCoordinates<TransitionHistory>;
  currentPosition?: AxesCoordinates;
  readonly currentTop?: number;
  readonly currentLeft?: number;
  order: Order;
  keys: Keys;
  depth: number;
  animatedFrame: number | null;
  isPositionedUnder(elmY: number): boolean;
  isPositionedLeft(elmX: number): boolean;
  initTranslate(): void;
  resume(scrollX: number, scrollY: number): void;
  changeVisibility(isVisible: boolean): void;
  setYPosition(
    iDsInOrder: ELmBranch,
    sign: 1 | -1,
    topSpace: number,
    operationID: string,
    siblingsHasEmptyElm?: number,
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
  rollYBack(operationID: string, isForceTransform: boolean): void;
}
