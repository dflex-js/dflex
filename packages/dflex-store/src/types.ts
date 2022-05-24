import type { Keys, Order } from "@dflex/dom-gen";

interface RegisterInputMetaBase {
  /** provide a depth if you want to drag the parent container  */
  depth?: number;
  /** Unique key to connect elements with the same parent together */
  parentID?: string;
}

interface RegisterInputID {
  id: string;
  ref?: never;
}

interface RegisterInputRef {
  id?: never;
  ref: HTMLElement;
}

interface RegisterInputAll {
  id: string;
  ref: HTMLElement;
}

/** Element before entering Registry abstract */
export type RegisterInputMeta =
  | (RegisterInputMetaBase & RegisterInputAll)
  | (RegisterInputMetaBase & RegisterInputID)
  | (RegisterInputMetaBase & RegisterInputRef);

export type RegisterInput = {
  /** Unique key to connect elements with the same parent together */
  parentID?: string;
  id: string;
  ref?: HTMLElement;
  depth: number;
  isInitialized: boolean;
  isPaused: boolean;
  scrollX: number;
  scrollY: number;
};

export type ElmPointerWithProps = RegisterInput & {
  order: Order;
  keys: Keys;
};

export interface StoreInterface {
  register(element: RegisterInput): void;
  unregister(id: string): void;
  destroy(): void;
  getElmBranchByKey(siblingsKy: string): string[];
}
