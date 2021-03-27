/* eslint-disable no-unused-vars */
import type { ELmBranch, Keys, Order } from "@dflex/dom-gen";

export interface AbstractCoreInterface {
  ref: HTMLElement;
  id: string;
  depth: number;
  translateY: number;
  translateX: number;
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
  shiftOffsetY: number;
}[];

export interface CoreInstanceInterface extends AbstractCoreInterface {
  offset: Offset;
  prevTranslateY: TransitionHistory;
  currentTop: number;
  currentLeft: number;
  order: Order;
  keys: Keys;
  setYPosition(
    iDsInOrder: ELmBranch,
    sign: number,
    topSpace: number,
    shiftOffsetY: number,
    operationID: string,
    vIncrement: number,
    isShuffle: boolean
  ): void;
  transformElm(): void;
  assignNewPosition(
    branchIDsOrder: string[],
    newIndex: number,
    oldIndex?: number
  ): void;
}
