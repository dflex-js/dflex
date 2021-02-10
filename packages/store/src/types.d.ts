import { Keys, Order } from "packages/dom-gen/src/types";

export type Class<classInstance> = new (...args: any[]) => classInstance;

export interface ElmInstance {
  id: string;
  depth: number;
  ref: HTMLElement;
}

export interface ElmWIthPointer extends ElmInstance {
  order: Order;
  keys: Keys;
}
