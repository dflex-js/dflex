/**
 * Copyright (c) Jalal Maskoun.
 *
 * This source code is licensed under the AGPL3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Keys, Order, ELmBranch } from "@dflex/dom-gen";

export type Class<classInstance> = new (...args: any[]) => classInstance;

export interface ElmInstance {
  id: string;
  depth: number;
}

export interface ElmInstanceWithProps extends Required<ElmInstance> {
  [key: string]: any;
}

export interface ElmWithPointerWithProps
  extends Omit<ElmInstanceWithProps, "depth"> {
  order: Order;
  keys: Keys;
}

export interface StoreInterface<T> {
  register(
    element: ElmInstanceWithProps,
    CustomInstance?: Class<T>,
    opts?: {}
  ): void;
  unregister(id: string): void;
  destroy(): void;
  getElmBranchByKey(siblingsKy: string): ELmBranch;
}
