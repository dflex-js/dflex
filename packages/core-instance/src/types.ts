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
  isDetached: boolean;
  isPaused: boolean;
  translateY?: number;
  translateX?: number;
  initialize(ref: HTMLElement | null): void;
  initTranslate(): void;
  attach(ref: HTMLElement | null): void;
  detach(): void;
}

export type ELmBranch = string | string[];

/**
 * Element unique keys in DOM tree.
 */
export interface Keys {
  sK: string;
  pK: string;
  chK: string | null;
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
  scrollX: number;
  scrollY: number;
}

export type CoreInput = CoreEssential & AbstractCoreInput;

export interface Offset {
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
  offset?: Offset;
  prevTranslateY?: TransitionHistory;
  currentTop?: number;
  currentLeft?: number;
  order: Order;
  keys: Keys;
  resume(scrollX: number, scrollY: number): void;
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
  visibilityHasChanged(isVisible: boolean): void;
  updateDataset(index: number): void;
}
