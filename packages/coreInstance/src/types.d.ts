import { Keys, Order } from "packages/dom-gen/src/types";

export interface AbstractCore {
  ref: HTMLElement | null;

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

export interface CoreInstance extends AbstractCore {
  offset: Offset;
  prevTranslateY: TransitionHistory;
  currentTop: number;
  currentLeft: number;
  order: Order;
  keys: Keys;
}
