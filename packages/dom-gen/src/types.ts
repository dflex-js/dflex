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
  getElmBranch(SK: string): ELmBranch;
  getElmPointer(id: string, depth: number): Pointer;
  accumulateIndicators(depth: number): Keys & {
    parentIndex: number;
  };
  removeElementIDFromBranch(SK: string, index: number): string | null;
  destroyBranch(SK: string, cb: (elmID: string) => unknown): void;
  clearBranchesAndIndicator(): void;
}
