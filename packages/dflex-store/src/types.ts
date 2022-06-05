export type RegisterInputOpts = {
  /** Element Id. */
  id: string;
  /** provide a depth if you want to drag the parent container.  */
  depth?: number;
  /** Unique key to connect elements with the same parent together. */
  parentID?: string;
  /** True for elements that won't be transformed.  */
  readonly?: boolean;
};

export type RegisterInputSuper = RegisterInputOpts & {
  depth: number;
  isInitialized: boolean;
  isPaused: boolean;
  scrollX: number;
  scrollY: number;
};

export interface IStore {
  register(element: RegisterInputSuper): void;
  unregister(id: string): void;
  destroy(): void;
  getElmBranchByKey(siblingsKy: string): string[];
}
