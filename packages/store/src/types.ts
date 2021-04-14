/**
 * Copyright (c) Jalal Maskoun.
 *
 * This source code is licensed under the AGPL3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Keys, Order } from "@dflex/dom-gen";

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
