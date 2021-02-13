/* eslint-disable no-unused-vars */
import { Keys, Order } from "@dflex/dom-gen/src/pkgTypes";

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
