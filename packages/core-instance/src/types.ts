/**
 * Copyright (c) Jalal Maskoun.
 *
 * This source code is licensed under the AGPL3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable no-unused-vars */

export type AbstractCoreInput =
  | {
      id: string;
      isPause: true;
      ref: HTMLElement | null;
    }
  | {
      id: string;
      isPause: false;
      ref: HTMLElement;
    };

export interface AbstractCoreInterface {
  ref: HTMLElement | null;
  id: string;
  translateY?: number;
  translateX?: number;
}

export interface ElmInstance {
  id: string;
  depth: number;
  ref: HTMLElement;
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

export interface ElmWIthPointer extends ElmInstance {
  order: Order;
  keys: Keys;
}

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
  initIndicators(scrollX: number, scrollY: number): void;
  visibilityHasChanged(isVisible: boolean): void;
  updateDataset(index: number): void;
}
