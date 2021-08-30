/**
 * Copyright (c) Jalal Maskoun.
 *
 * This source code is licensed under the AGPL3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
export type ELmBranch = string | Array<string> | null;

/**
 * Element unique keys in DOM tree.
 */
export interface Keys {
  SK: string;
  PK: string;
  CHK: string | null;
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

export interface GeneratorInterface {
  branches: {
    [keys: string]: ELmBranch;
  };
  setElmBranch(SK: string, branch: ELmBranch): void;
  getElmBranch(SK: string): ELmBranch;
  getElmPointer(id: string, depth: number): Pointer;
  removeElementIDFromBranch(SK: string, index: number): string | null;
  destroyBranch(SK: string, cb: (elmID: string) => unknown): void;
  clearBranchesAndIndicator(): void;
}
