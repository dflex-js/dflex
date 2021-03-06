export type ELmBranch = string | string[];

/**
 * Element unique keys in DOM tree.
 */
export interface Keys {
  sK: string;
  pK: string;
  chK: string | null;
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
