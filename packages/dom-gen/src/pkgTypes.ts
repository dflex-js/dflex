export type ELmBranch = string | string[];

/**
 * Element unique keys in DOM tree.
 */
export type Keys = {
  sK: string;
  pK: string;
  chK: string | null;
};

/**
 * Element order in its branch & higher branch
 */
export type Order = {
  self: number;
  parent: number;
};

/**
 * Generated element pointer
 */
export type Pointer = {
  keys: Keys;
  order: Order;
};
