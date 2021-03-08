import type { Keys, Order } from "@dflex/dom-gen";

// eslint-disable-next-line no-unused-vars
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
