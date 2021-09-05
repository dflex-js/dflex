/**
 * Copyright (c) Jalal Maskoun.
 *
 * This source code is licensed under the AGPL3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable no-unused-vars */

interface AbsCoreEssential {
  id: string;
  isPaused?: boolean;
}

interface AbsCoreWithRef {
  isInitialized: true;
  ref: HTMLElement;
}

interface AbsCoreWithoutRef {
  isInitialized: false;
  ref: null;
}

export type AbstractCoreInput =
  | (AbsCoreEssential & AbsCoreWithoutRef)
  | (AbsCoreEssential & AbsCoreWithRef);

export interface AbstractCoreInterface {
  ref: HTMLElement | null;
  id: string;
  isPaused: boolean;
  isInitialized: boolean;
  translateY?: number;
  translateX?: number;
  initialize(ref: HTMLElement | null): void;
  initTranslate(): void;
  attach(ref: HTMLElement | null): void;
  detach(): void;
  hasValidRef(): void;
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
  translateY: number;
}[];

export interface CoreInstanceInterface extends AbstractCoreInterface {
  offset?: Rect;
  prevTranslateY?: TransitionHistory;
  currentTop?: number;
  currentLeft?: number;
  order: Order;
  keys: Keys;
  depth: number;
  animatedFrame: number | null;
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
  ): void;
  transformElm(): void;
  assignNewPosition(
    branchIDsOrder: string[],
    newIndex: number,
    oldIndex?: number,
    siblingsHasEmptyElm?: number
  ): number;
  updateDataset(index: number): void;
}
