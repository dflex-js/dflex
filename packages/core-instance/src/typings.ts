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

export type TransitionHistory = { ID: string; translateY: number }[];

export interface CoreInstanceInterface extends AbstractCoreInterface {
  offset: Offset;
  prevTranslateY: TransitionHistory;
  currentTop: number;
  currentLeft: number;
  order: Order;
  keys: Keys;
  setCurrentOffset(): void;
  setYPosition(
    iDsInOrder: ELmBranch,
    sign: number,
    topSpace: number,
    operationID: string,
    vIncrement: number,
    isShuffle: boolean
  ): void;
  transformElm(): void;
  updateIDsOrder(
    branchIDsOrder: string[],
    inc: number,
    isShuffle: boolean
  ): void;
}
